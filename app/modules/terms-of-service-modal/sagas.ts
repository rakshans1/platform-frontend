import { Effect, fork, put, select } from "redux-saga/effects";

import { getMessageTranslation, ToSMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { SIGN_TOS } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IUser } from "../../lib/api/users/interfaces";
import { actions } from "../actions";
import { ensurePermissionsArePresent } from "../auth/jwt/sagas";
import { selectCurrentAgreementHash } from "../auth/selectors";
import { selectIsSmartContractInitDone } from "../init/selectors";
import { neuCall, neuTakeEvery, neuTakeOnly } from "../sagasUtils";
import { AuthMessage } from "./../../components/translatedMessages/messages";
import { EInitType } from "./../init/reducer";

/**
 * Handle ToS / agreement
 */
export function* loadCurrentAgreement({
  contractsService,
  logger,
}: TGlobalDependencies): Iterator<any> {
  logger.info("Loading current agreement hash");

  const isSmartContractsInitialized = yield select(selectIsSmartContractInitDone);

  if (!isSmartContractsInitialized) {
    yield neuTakeOnly("INIT_DONE", { initType: EInitType.START_CONTRACTS_INIT });
  }

  try {
    const result = yield contractsService.universeContract.currentAgreement();
    let currentAgreementHash = result[2] as string;
    currentAgreementHash = currentAgreementHash.replace("ipfs:", "");
    yield put(actions.tosModal.setCurrentAgreementHash(currentAgreementHash));
  } catch (e) {
    logger.error("Could not load current agreement", e);
  }
}

function* handleAcceptCurrentAgreement({
  apiUserService,
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  const currentAgreementHash: string = yield select(selectCurrentAgreementHash);
  yield neuCall(
    ensurePermissionsArePresent,
    [SIGN_TOS],
    createMessage(ToSMessage.TOS_ACCEPT_PERMISSION_TITLE),
    createMessage(ToSMessage.TOS_ACCEPT_PERMISSION_TEXT),
  );
  try {
    const user: IUser = yield apiUserService.setLatestAcceptedTos(currentAgreementHash);
    yield put(actions.auth.setUser(user));
  } catch (e) {
    notificationCenter.error(createMessage(AuthMessage.AUTH_TOC_ACCEPT_ERROR));
    logger.error("Could not accept Terms and Conditions", e);
  }
}

function* handleDownloadCurrentAgreement(_: TGlobalDependencies): Iterator<any> {
  const currentAgreementHash: string = yield select(selectCurrentAgreementHash);
  const fileName = createMessage(AuthMessage.AUTH_TOC_FILENAME);
  yield put(
    actions.immutableStorage.downloadImmutableFile(
      {
        ipfsHash: currentAgreementHash,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        asPdf: true,
      },
      getMessageTranslation(fileName) as string,
    ),
  );
}

export const termsOfServiceSagas = function*(): Iterator<Effect> {
  yield fork(neuTakeEvery, "AUTH_SET_USER", loadCurrentAgreement);
  yield fork(neuTakeEvery, "ACCEPT_CURRENT_AGREEMENT", handleAcceptCurrentAgreement);
  yield fork(neuTakeEvery, "DOWNLOAD_CURRENT_AGREEMENT", handleDownloadCurrentAgreement);
};
