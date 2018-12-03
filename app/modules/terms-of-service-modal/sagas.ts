import { Effect, fork, put, select } from "redux-saga/effects";

import { SIGN_TOS } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IUser } from "../../lib/api/users/interfaces";
import { actions } from "../actions";
import { ensurePermissionsArePresent } from "../auth/jwt/sagas";
import { selectIsSmartContractInitDone } from "../init/selectors";
import { neuCall, neuTakeEvery, neuTakeOnly } from "../sagasUtils";
import { selectCurrentAgreementHash } from "./selectos";

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
    yield neuTakeOnly("INIT_DONE", { initType: "smartcontractsInit" });
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

function* handleDownloadCurrentAgreement({
  intlWrapper: {
    intl: { formatIntlMessage },
  },
}: TGlobalDependencies): Iterator<any> {
  const currentAgreementHash: string = yield select(selectCurrentAgreementHash);
  const fileName = formatIntlMessage("settings.modal.accept-tos.filename");
  yield put(
    actions.immutableStorage.downloadImmutableFile(
      {
        ipfsHash: currentAgreementHash,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        asPdf: true,
      },
      fileName,
    ),
  );
}

function* handleAcceptCurrentAgreement({
  apiUserService,
  logger,
  notificationCenter,
  intlWrapper: {
    intl: { formatIntlMessage },
  },
}: TGlobalDependencies): Iterator<any> {
  const currentAgreementHash: string = yield select(selectCurrentAgreementHash);
  yield neuCall(
    ensurePermissionsArePresent,
    [SIGN_TOS],
    formatIntlMessage("settings.modal.accept-tos.permission.title"),
    formatIntlMessage("settings.modal.accept-tos.permission.text"),
  );
  try {
    const user: IUser = yield apiUserService.setLatestAcceptedTos(currentAgreementHash);
    yield put(actions.auth.setUser(user));
  } catch (e) {
    notificationCenter.error("There was a problem with accepting Terms and Conditions");
    logger.error("Could not accept Terms and Conditions", e);
  }
}

export const termsOfServiceSagas = function*(): Iterator<Effect> {
  yield fork(neuTakeEvery, "AUTH_SET_USER", loadCurrentAgreement);
  yield fork(neuTakeEvery, "ACCEPT_CURRENT_AGREEMENT", handleAcceptCurrentAgreement);
  yield fork(neuTakeEvery, "DOWNLOAD_CURRENT_AGREEMENT", handleDownloadCurrentAgreement);
};
