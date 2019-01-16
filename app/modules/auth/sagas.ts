import { Effect, fork, put, select } from "redux-saga/effects";

import {
  AuthMessage,
  SignInUserErrorMessage,
  ToSMessage,
} from "../../components/translatedMessages/messages";
import { createMessage, TMessage } from "../../components/translatedMessages/utils";
import { SIGN_TOS } from "../../config/constants";
import { SignInUserErrorMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { SignerRejectConfirmationError, SignerTimeoutError } from "../../lib/web3/Web3Manager";
import { IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { EInitType } from "../init/reducer";
import { neuCall, neuTakeEvery, neuTakeLatest } from "../sagasUtils";
import { selectActivationCodeFromQueryString, selectEmailFromQueryString } from "../web3/selectors";
import { verifyUserEmailPromise } from "./email/sagas";
import { watchRedirectChannel } from "./jwt/sagas";
import { selectVerifiedUserEmail } from "./selectors";
import { loadUser, signInUser } from "./user/sagas";

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
  { apiUserService, notificationCenter }: TGlobalDependencies,
  userCode: IVerifyEmailUser,
  urlEmail: string,
  verifiedEmail: string,
): Promise<void> {
  if (urlEmail === verifiedEmail) {
    notificationCenter.info(createMessage(AuthMessage.AUTH_EMAIL_ALREADY_VERIFIED));
    return;
  }
  if (!userCode) return;
  try {
    await apiUserService.verifyUserEmail(userCode);
    notificationCenter.info(createMessage(AuthMessage.AUTH_EMAIL_VERIFIED));
  } catch (e) {
    if (e instanceof EmailAlreadyExists)
      notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_ALREADY_EXISTS));
    else notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED));
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
  { web3Manager, jwtStorage, logger, userStorage }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "AUTH_LOGOUT") return;
  const { userType } = action.payload;

  userStorage.clear();
  jwtStorage.clear();
  yield web3Manager.unplugPersonalWallet();
  yield put(actions.web3.personalWalletDisconnected());
  if (userType === EUserType.INVESTOR || !userType) {
    yield put(actions.routing.goHome());
  } else {
    yield put(actions.routing.goEtoHome());
  }
  yield put(actions.init.start(EInitType.appInit));
  logger.setUser(null);
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
    yield effects.put(actions.auth.setUser(user));
  } catch (e) {
    notificationCenter.error(createMessage(AuthMessage.AUTH_TOC_ACCEPT_ERROR));
    logger.error("Could not accept Terms and Conditions", e);
  }
}

function* handleDownloadCurrentAgreement(_: TGlobalDependencies): Iterator<any> {
  const currentAgreementHash: string = yield select(selectCurrentAgreementHash);
  const fileName = createMessage(AuthMessage.AUTH_TOC_FILENAME);
  yield effects.put(
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

/**
 * Saga & Promise to fetch a new jwt from the authentication server
 */
export async function obtainJwtPromise(
  { web3Manager, signatureAuthApi, cryptoRandomString, logger }: TGlobalDependencies,
  state: IAppState,
  permissions: Array<string> = [],
): Promise<string> {
  const address = selectEthereumAddressWithChecksum(state);

  const salt = cryptoRandomString(64);

  /* tslint:disable: no-useless-cast */
  const signerType = web3Manager.personalWallet!.getSignerType();
  /* tslint:enable: no-useless-cast */

  logger.info("Obtaining auth challenge from api");
  const {
    body: { challenge },
  } = await signatureAuthApi.challenge(address, salt, signerType, permissions);

  logger.info("Signing challenge");
  /* tslint:disable: no-useless-cast */
  const signedChallenge = await web3Manager.personalWallet!.signMessage(challenge);
  /* tslint:enable: no-useless-cast */

  logger.info("Sending signed challenge back to api");
  const {
    body: { jwt },
  } = await signatureAuthApi.createJwt(challenge, signedChallenge, signerType);

  return jwt;
}

// see above
export function* obtainJWT(
  { jwtStorage }: TGlobalDependencies,
  permissions: Array<string> = [],
): Iterator<any> {
  const state: IAppState = yield select();
  const jwt: string = yield neuCall(obtainJwtPromise, state, permissions);
  yield effects.put(actions.auth.loadJWT(jwt));
  jwtStorage.set(jwt);

  return jwt;
}

/**
 * Saga to ensure all the needed permissions are present and still valid
 * on the current jwt
 */
export function* ensurePermissionsArePresent(
  { jwtStorage, logger }: TGlobalDependencies,
  permissions: Array<string> = [],
  title: TMessage,
  message: TMessage,
): Iterator<any> {
  // check wether all permissions are present and still valid
  const jwt = jwtStorage.get();
  if (jwt && hasValidPermissions(jwt, permissions)) {
    return;
  }
  // obtain a freshly signed token with missing permissions
  try {
    const obtainJwtEffect = neuCall(obtainJWT, permissions);
    yield call(accessWalletAndRunEffect, obtainJwtEffect, title, message);
  } catch (error) {
    if (error instanceof MessageSignCancelledError) {
      logger.info("Signing Cancelled");
    } else {
      throw new Error("Message signing failed");
    }
  }
}

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
    yield effects.put(actions.auth.setCurrentAgreementHash(currentAgreementHash));
  } catch (e) {
    logger.error("Could not load current agreement", e);
  }
}

export const authSagas = function*(): Iterator<effects.Effect> {
export const authSagas = function*(): Iterator<Effect> {
  yield fork(watchRedirectChannel);
  yield fork(neuTakeLatest, "AUTH_LOGOUT", logoutWatcher);
  yield fork(neuTakeEvery, "AUTH_SET_USER", setUser);
  yield fork(neuTakeEvery, "AUTH_VERIFY_EMAIL", verifyUserEmail);
  yield fork(neuTakeEvery, "WALLET_SELECTOR_CONNECTED", handleSignInUser);
};
