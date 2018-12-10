import { Effect, fork, put, select } from "redux-saga/effects";

import { SignInUserErrorMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { SignerRejectConfirmationError, SignerTimeoutError } from "../../lib/web3/Web3Manager";
import { IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { neuCall, neuTakeEvery, neuTakeLatest } from "../sagasUtils";
import { selectActivationCodeFromQueryString, selectEmailFromQueryString } from "../web3/selectors";
import { verifyUserEmailPromise } from "./email/sagas";
import { selectVerifiedUserEmail } from "./selectors";
import { loadUser, signInUser } from "./user/sagas";
import { EInitType } from "../init/reducer";

export function* loadJwt({ jwtStorage }: TGlobalDependencies): Iterator<Effect> {
  const jwt = jwtStorage.get();
  if (jwt) {
    yield effects.put(actions.auth.loadJWT(jwt));
    return jwt;
  }
}

export async function loadOrCreateUserPromise(
  { apiUserService, web3Manager }: TGlobalDependencies,
  userType: EUserType,
): Promise<IUser> {
  // tslint:disable-next-line
  const walletMetadata = web3Manager.personalWallet!.getMetadata();
  try {
    const user = await apiUserService.me();
    if (
      user.walletType === walletMetadata.walletType &&
      user.walletSubtype === walletMetadata.walletSubType
    ) {
      return user;
    }
    // if wallet type changed send correct wallet type to the backend
    user.walletType = walletMetadata.walletType;
    user.walletSubtype = walletMetadata.walletSubType;
    return await apiUserService.updateUser(user);
  } catch (e) {
    if (!(e instanceof UserNotExisting)) {
      throw e;
    }
  }
  // for light wallet we need to send slightly different request
  if (walletMetadata && walletMetadata.walletType === EWalletType.LIGHT) {
    return apiUserService.createAccount({
      newEmail: walletMetadata.email,
      salt: walletMetadata.salt,
      backupCodesVerified: false,
      type: userType,
      walletType: walletMetadata.walletType,
      walletSubtype: EWalletSubType.UNKNOWN,
    });
  } else {
    return apiUserService.createAccount({
      backupCodesVerified: true,
      type: userType,
      walletType: walletMetadata.walletType,
      walletSubtype:
        walletMetadata.walletType === EWalletType.BROWSER
          ? walletMetadata.walletSubType
          : EWalletSubType.UNKNOWN,
    });
  }
}

export async function verifyUserEmailPromise(
  {
    apiUserService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  userCode: IVerifyEmailUser,
  urlEmail: string,
  verifiedEmail: string,
): Promise<void> {
  if (urlEmail === verifiedEmail) {
    notificationCenter.info(
      formatIntlMessage("modules.auth.sagas.verify-user-email-promise.email-already-verified"),
    );
    return;
  }
  if (!userCode) return;
  try {
    await apiUserService.verifyUserEmail(userCode);
    notificationCenter.info(
      formatIntlMessage("modules.auth.sagas.verify-user-email-promise.email-verified"),
    );
  } catch (e) {
    if (e instanceof EmailAlreadyExists)
      notificationCenter.error(
        formatIntlMessage("modules.auth.sagas.sign-in-user.email-already-exists"),
      );
    else
      notificationCenter.error(
        formatIntlMessage("modules.auth.sagas.verify-user-email-promise.failed-email-verify"),
      );
  }
}

export async function updateUserPromise(
  { apiUserService }: TGlobalDependencies,
  user: IUserInput,
): Promise<IUser> {
  return apiUserService.updateUser(user);
}

export function* loadOrCreateUser(userType: EUserType): Iterator<any> {
  const user: IUser = yield neuCall(loadOrCreateUserPromise, userType);
  yield effects.put(actions.auth.setUser(user));

  yield neuCall(loadKycRequestData);
}

export async function createUserPromise(
  { apiUserService }: TGlobalDependencies,
  user: IUserInput,
): Promise<IUser> {
  return apiUserService.createAccount(user);
}

export function* createUser(newUser: IUserInput): Iterator<any> {
  const user: IUser = yield neuCall(createUserPromise, newUser);
  yield effects.put(actions.auth.setUser(user));

  yield neuCall(loadKycRequestData);
}

export function* loadUser(): Iterator<any> {
  const user: IUser = yield neuCall(loadUserPromise);
  yield neuCall(loadPreviousWallet, user.type);
  yield effects.put(actions.auth.setUser(user));

  yield neuCall(loadKycRequestData);
}

export async function loadUserPromise({ apiUserService }: TGlobalDependencies): Promise<IUser> {
  return await apiUserService.me();
}

export function* updateUser(updatedUser: IUserInput): Iterator<any> {
  const user: IUser = yield neuCall(updateUserPromise, updatedUser);
  yield effects.put(actions.auth.setUser(user));
}

function* setUser({ logger }: TGlobalDependencies, action: TAction): Iterator<any> {
  if (action.type !== "AUTH_SET_USER") return;

  const user = action.payload.user;

  logger.setUser({ id: user.userId, type: user.type, walletType: user.walletType });
}

function* logoutWatcher(
  { web3Manager, jwtStorage, logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "AUTH_LOGOUT") return;
  const { userType } = action.payload;
  jwtStorage.clear();
  yield web3Manager.unplugPersonalWallet();
  if (userType === EUserType.INVESTOR || !userType) {
    yield effects.put(actions.routing.goHome());
  } else {
    yield effects.put(actions.routing.goEtoHome());
  }

  yield effects.put(actions.init.start("appInit"));

  logger.setUser(null);
}

export function* signInUser({ walletStorage, web3Manager }: TGlobalDependencies): Iterator<any> {
  try {
    // we will try to create with user type from URL but it could happen that account already exists and has different user type
    const probableUserType: EUserType = yield select((s: IAppState) => selectUrlUserType(s.router));
    yield effects.put(actions.walletSelector.messageSigning());

    yield neuCall(obtainJWT, [SIGN_TOS]); // by default we have the sign-tos permission, as this is the first thing a user will have to do after signup
    yield call(loadOrCreateUser, probableUserType);
    // tslint:disable-next-line
    walletStorage.set(web3Manager.personalWallet!.getMetadata());

    const redirectionUrl = yield effects.select((state: IAppState) =>
      selectRedirectURLFromQueryString(state.router),
    );
    if (redirectionUrl) {
      yield effects.put(actions.routing.goTo(redirectionUrl));
    } else {
      yield effects.put(actions.routing.goToDashboard());
    }
  } catch (e) {
    if (e instanceof SignerRejectConfirmationError || e instanceof SignerTimeoutError) {
      throw e;
    } else {
      throw new SignerUnknownError();
    }
  }
}

function* handleSignInUser({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(signInUser);
  } catch (e) {
    logger.error("User Sign in error", e);
    yield put(actions.auth.logout());
    if (e instanceof SignerRejectConfirmationError) {
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_REJECTED),
        ),
      );
    } else if (e instanceof SignerTimeoutError) {
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_TIMEOUT),
        ),
      );
    } else {
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE),
        ),
      );
    }
  }
}

function* logoutWatcher(
  { web3Manager, jwtStorage, logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "AUTH_LOGOUT") return;
  const { userType } = action.payload;
  jwtStorage.clear();
  yield web3Manager.unplugPersonalWallet();
  if (userType === EUserType.INVESTOR || !userType) {
    yield put(actions.routing.goHome());
  } else {
    yield put(actions.routing.goEtoHome());
  }
  yield put(actions.init.start(EInitType.appInit));
  logger.setUser(null);
}

/**
 * Email Verification
 */
function* verifyUserEmail(): Iterator<any> {
  const userCode = yield select((s: IAppState) => selectActivationCodeFromQueryString(s.router));
  const urlEmail = yield select((s: IAppState) => selectEmailFromQueryString(s.router));

  const verifiedEmail = yield select((s: IAppState) => selectVerifiedUserEmail(s.auth));
  yield neuCall(verifyUserEmailPromise, userCode, urlEmail, verifiedEmail);
  yield loadUser();
  yield put(actions.routing.goToProfile());
}

function* setUser({ logger }: TGlobalDependencies, action: TAction): Iterator<any> {
  if (action.type !== "AUTH_SET_USER") return;

  const { user } = action.payload;
  logger.setUser({ id: user.userId, type: user.type });
}

export const authSagas = function*(): Iterator<Effect> {
  yield fork(neuTakeLatest, "AUTH_LOGOUT", logoutWatcher);
  yield fork(neuTakeEvery, "AUTH_SET_USER", setUser);
  yield fork(neuTakeEvery, "AUTH_VERIFY_EMAIL", verifyUserEmail);
  yield fork(neuTakeEvery, "WALLET_SELECTOR_CONNECTED", handleSignInUser);
};
