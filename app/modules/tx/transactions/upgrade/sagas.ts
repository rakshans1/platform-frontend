import { addHexPrefix } from "ethereumjs-util";
import { put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/types";
import { EthereumAddress } from "../../../../types";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall } from "../../../sagasUtils";
import {
  selectIsEtherUpgradeTargetSet,
  selectIsEuroUpgradeTargetSet,
} from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { ETokenType } from "../../interfaces";

export function* generateEuroUpgradeTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const userAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const migrationTarget = yield select(selectIsEuroUpgradeTargetSet);

  if (!migrationTarget) {
    throw new Error();
    // TODO: Add shouldn't hit migration target
  }

  const txData = contractsService.icbmEuroLock.migrateTx().getData();

  const txInitialDetails = {
    to: contractsService.icbmEuroLock.address,
    from: userAddress,
    data: txData,
    value: addHexPrefix("0"),
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: addHexPrefix(estimatedGasWithOverhead),
  };
  return txDetails;
}

export function* generateEtherUpgradeTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const userAddress: EthereumAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const migrationTarget: boolean = yield select(selectIsEtherUpgradeTargetSet);

  if (!migrationTarget) {
    throw new Error();
    // TODO: Add no balance error
  }
  const txInput = contractsService.icbmEtherLock.migrateTx().getData();

  const txInitialDetails = {
    to: contractsService.icbmEtherLock.address,
    from: userAddress,
    data: txInput,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: addHexPrefix(estimatedGasWithOverhead),
  };

  return txDetails;
}

export function* upgradeTransactionFlow(_: TGlobalDependencies, tokenType: ETokenType): any {
  const transactionGenerator =
    tokenType === ETokenType.ETHER
      ? generateEtherUpgradeTransaction
      : generateEuroUpgradeTransaction;
  const generatedTxDetails: ITxData = yield neuCall(transactionGenerator);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary({
      txData: generatedTxDetails,
      additionalData: { tokenType },
    }),
  );
}
