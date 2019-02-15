import * as moment from "moment";
import { fork, put, select } from "redux-saga/effects";

import { BankTransferFlowMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { cryptoRandomString } from "../../lib/dependencies/cryptoRandomString";
import { EthereumAddressWithChecksum } from "../../types";
import { actions } from "../actions";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";

function* generateReference(): Iterable<any> {
  const addressHex: EthereumAddressWithChecksum = yield select(selectEthereumAddressWithChecksum);

  const reference = btoa(cryptoRandomString(9))
    .replace("=", "")
    .toUpperCase();

  const date = moment().format("DD-MM-YYYY");

  // see https://github.com/Neufund/platform-backend/wiki/5.4.-Use-Case-EUR-T-deposit for reference
  return `Bank Transfer from ${date} NF ${addressHex} REF ${reference}`;
}

function* start({ logger, notificationCenter }: TGlobalDependencies): any {
  try {
    const reference: string = yield neuCall(generateReference);

    yield put(
      actions.bankTransferFlow.continueToDetails({
        minEuroUlps: "1",
        reference: reference,
      }),
    );
  } catch (e) {
    yield put(actions.bankTransferFlow.stopBankTransfer());

    notificationCenter.error(createMessage(BankTransferFlowMessage.BANK_TRANSFER_FLOW_ERROR));

    logger.error(`Failed to start bank transfer flow`, e);
  }
}

function* stop(): any {
  yield put(actions.bankTransferFlow.stopBankTransfer());
}

export function* bankTransferFlowSaga(): any {
  yield fork(neuTakeEvery, actions.bankTransferFlow.startBankTransfer, start);
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", stop);
}
