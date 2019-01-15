import { Effect, fork, put, select } from "redux-saga/effects";

import { SignInUserErrorMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { SignerRejectConfirmationError, SignerTimeoutError } from "../../lib/web3/Web3Manager";
import { IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { selectIsSmartContractInitDone } from "../init/selectors";
import { loadKycRequestData } from "../kyc/sagas";
import { selectRedirectURLFromQueryString } from "../routing/selectors";
import { neuCall, neuTakeEvery, neuTakeLatest, neuTakeOnly } from "../sagasUtils";
import { selectUrlUserType } from "../wallet-selector/selectors";
import { loadPreviousWallet } from "../web3/sagas";
import {
  selectActivationCodeFromQueryString,
  selectEmailFromQueryString,
  selectEthereumAddressWithChecksum,
} from "../web3/selectors";
import { EWalletSubType, EWalletType } from "../web3/types";
import { MessageSignCancelledError } from "./errors";
import { selectCurrentAgreementHash, selectUserType, selectVerifiedUserEmail } from "./selectors";
import { EInitType } from "../init/reducer";
import { neuCall, neuTakeEvery, neuTakeLatest } from "../sagasUtils";
import { selectActivationCodeFromQueryString, selectEmailFromQueryString } from "../web3/selectors";
import { verifyUserEmailPromise } from "./email/sagas";
import { watchRedirectChannel } from "./jwt/sagas";
import { selectVerifiedUserEmail } from "./selectors";
import { loadUser, signInUser } from "./user/sagas";

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
  yield effects.put(actions.web3.personalWalletDisconnected());
  if (userType === EUserType.INVESTOR || !userType) {
    yield put(actions.routing.goHome());
  } else {
    yield put(actions.routing.goEtoHome());
  }
  yield put(actions.init.start(EInitType.appInit));
  logger.setUser(null);
}

export function* signInUser({ walletStorage, web3Manager }: TGlobalDependencies): Iterator<any> {
  try {
    // we will try to create with user type from URL but it could happen that account already exists and has different user type
    const probableUserType: EUserType = yield select((s: IAppState) => selectUrlUserType(s.router));
    yield effects.put(actions.walletSelector.messageSigning());

    yield neuCall(obtainJWT, [SIGN_TOS]); // by default we have the sign-tos permission, as this is the first thing a user will have to do after signup
    yield call(loadOrCreateUser, probableUserType);

    const userType: EUserType = yield select(selectUserType);
    // tslint:disable-next-line
    walletStorage.set(web3Manager.personalWallet!.getMetadata(), userType);

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
  title: string,
  message: string,
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

export const authSagas = function*(): Iterator<Effect> {
  yield fork(watchRedirectChannel);
  yield fork(neuTakeLatest, "AUTH_LOGOUT", logoutWatcher);
  yield fork(neuTakeEvery, "AUTH_SET_USER", setUser);
  yield fork(neuTakeEvery, "AUTH_VERIFY_EMAIL", verifyUserEmail);
  yield fork(neuTakeEvery, "WALLET_SELECTOR_CONNECTED", handleSignInUser);
};
