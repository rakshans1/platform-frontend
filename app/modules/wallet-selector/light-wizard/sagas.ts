import { call, fork, put, select } from "redux-saga/effects";

import {
  BackupRecoveryMessage,
  GenericErrorMessage,
  GenericModalMessage,
  SignInUserErrorMessage,
} from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { CHANGE_EMAIL_PERMISSION } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { IUser, IUserInput } from "../../../lib/api/users/interfaces";
import { EmailAlreadyExists, UserNotExisting } from "../../../lib/api/users/UsersApi";
import {
  ILightWalletMetadata,
} from "../../../lib/persistence/WalletMetadataObjectStorage";
import {
  LightError,
  LightWallet,
  LightWalletLocked,
} from "../../../lib/web3/LightWallet";
import { IAppState } from "../../../store";
import { invariant } from "../../../utils/invariant";
import { connectLightWallet } from "../../access-wallet/sagas";
import { actions, TAction } from "../../actions";
import { checkEmailPromise } from "../../auth/email/sagas";
import { obtainJWT } from "../../auth/jwt/sagas";
import {
  createUser,
  loadUser,
  loadUserPromise,
  signInUser,
  updateUser,
  updateUserPromise,
} from "../../auth/user/sagas";
import { displayInfoModalSaga } from "../../generic-modal/sagas";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import {
  selectIsUnlocked,
} from "../../web3/selectors";
import { EWalletSubType } from "../../web3/types";
import { selectUrlUserType } from "../selectors";
import { mapLightWalletErrorToErrorMessage } from "./errors";
import { getWalletMetadataByURL } from './metadata/sagas';
import { setupLightWalletPromise } from "./utils";

export const DEFAULT_HD_PATH = "m/44'/60'/0'";

export function* lightWalletBackupWatch({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    const user = yield select((state: IAppState) => state.auth.user);
    yield neuCall(updateUserPromise, { ...user, backupCodesVerified: true });
    yield neuCall(
      displayInfoModalSaga,
      getMessageTranslation(createMessage(BackupRecoveryMessage.BACKUP_SUCCESS_TITLE)),
      getMessageTranslation(createMessage(BackupRecoveryMessage.BACKUP_SUCCESS_DESCRIPTION)),
    );
    yield loadUser();
    yield put(actions.routing.goToProfile());
  } catch (e) {
    logger.error("Light Wallet Backup Error", e);
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* loadSeedFromWalletWatch({
  logger,
  web3Manager,
}: TGlobalDependencies): Iterator<any> {
  try {
    const isUnlocked = yield select((s: IAppState) => selectIsUnlocked(s.web3));
    if (!isUnlocked) {
      throw new LightWalletLocked();
    }
    const lightWallet = web3Manager.personalWallet as LightWallet;
    const { seed, privateKey } = yield call(lightWallet.getWalletPrivateData.bind(lightWallet));
    yield put(actions.web3.loadWalletPrivateDataToState(seed, privateKey));
  } catch (e) {
    logger.error("Load seed from wallet failed", e);
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* lightWalletRecoverWatch(
  { lightWalletConnector, web3Manager }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  try {
    const userType = yield select((state: IAppState) => selectUrlUserType(state.router));

    if (action.type !== "LIGHT_WALLET_RECOVER") {
      return;
    }
    const { password, email, seed } = action.payload;
    const walletMetadata = yield neuCall(setupLightWalletPromise, email, password, seed, userType);

    yield put(actions.walletSelector.messageSigning());
    yield neuCall(obtainJWT, [CHANGE_EMAIL_PERMISSION]);
    const userUpdate: IUserInput = {
      salt: walletMetadata.salt,
      backupCodesVerified: true,
      type: userType,
      walletType: walletMetadata.walletType,
      walletSubtype: EWalletSubType.UNKNOWN,
    };
    const isEmailAvailable = yield neuCall(checkEmailPromise, email);
    try {
      const user: IUser = yield neuCall(loadUserPromise);
      if (isEmailAvailable) {
        userUpdate.newEmail = walletMetadata.email;
        yield call(updateUser, userUpdate);
      } else {
        if (user.verifiedEmail === email.toLowerCase()) yield call(updateUser, userUpdate);
        else {
          throw new EmailAlreadyExists();
        }
      }
    } catch (e) {
      if (e instanceof UserNotExisting) {
        if (!isEmailAvailable) {
          throw new EmailAlreadyExists();
        }
        userUpdate.newEmail = walletMetadata.email;
        yield call(createUser, userUpdate);
      } else throw e;
    }
    const wallet = yield connectLightWallet(lightWalletConnector, walletMetadata, password);
    yield web3Manager.plugPersonalWallet(wallet);

    yield put(actions.routing.goToSuccessfulRecovery());
  } catch (e) {
    neuCall(handleLightWalletError, e);
  }
}

export function* lightWalletRegisterWatch(_: TGlobalDependencies, action: TAction): Iterator<any> {
  try {
    if (action.type !== "LIGHT_WALLET_REGISTER") return;

    const { password, email } = action.payload;
    const isEmailAvailable = yield neuCall(checkEmailPromise, email);

    if (!isEmailAvailable) {
      throw new EmailAlreadyExists();
    }
    yield neuCall(setupLightWalletPromise, email, password);
    yield neuCall(signInUser);
  } catch (e) {
    neuCall(handleLightWalletError, e);
  }
}

function* handleLightWalletError({ logger }: TGlobalDependencies, e: Error): any {
  yield put(actions.walletSelector.reset());

  let error;
  if (e instanceof EmailAlreadyExists) {
    error = createMessage(GenericErrorMessage.USER_ALREADY_EXISTS);
  } else if (e instanceof LightError) {
    logger.error("Light wallet recovery/register error", e);
    error = mapLightWalletErrorToErrorMessage(e);
  } else {
    error = createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE);
  }

  yield put(
    actions.genericModal.showErrorModal(createMessage(GenericModalMessage.ERROR_TITLE), error),
  );
}

export function* lightWalletLoginWatch(
  { web3Manager, lightWalletConnector, logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "LIGHT_WALLET_LOGIN") {
    return;
  }
  const { password } = action.payload;
  try {
    const walletMetadata: ILightWalletMetadata | undefined = yield neuCall(
      getWalletMetadataByURL,
      password,
    );

    if (!walletMetadata) {
      return invariant(walletMetadata, "Missing metadata");
    }

    const wallet: LightWallet = yield connectLightWallet(
      lightWalletConnector,
      walletMetadata,
      password,
    );

    yield web3Manager.plugPersonalWallet(wallet);
    yield neuCall(signInUser);
  } catch (e) {
    logger.error("Light Wallet login error", e);
    yield put(actions.walletSelector.reset());
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* lightWalletSagas(): Iterator<any> {
  yield fork(neuTakeEvery, "LIGHT_WALLET_LOGIN", lightWalletLoginWatch);
  yield fork(neuTakeEvery, "LIGHT_WALLET_REGISTER", lightWalletRegisterWatch);
  yield fork(neuTakeEvery, "LIGHT_WALLET_BACKUP", lightWalletBackupWatch);
  yield fork(neuTakeEvery, "LIGHT_WALLET_RECOVER", lightWalletRecoverWatch);
  yield fork(neuTakeEvery, "WEB3_FETCH_SEED", loadSeedFromWalletWatch);
}
