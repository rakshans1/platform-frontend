import { channel, delay, eventChannel } from "redux-saga";
import { call, Effect, put, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { STORAGE_JWT_KEY } from "../../../lib/persistence/JwtObjectStorage";
import { hasValidPermissions } from "../../../utils/JWTUtils";
import { accessWalletAndRunEffect } from "../../access-wallet/sagas";
import { actions } from "../../actions";
import { neuCall } from "../../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../../web3/selectors";
import { TEventEmitterChannelEvents } from "../../tx/monitor/sagas";

/**
 * Saga & Promise to fetch a new jwt from the authentication server
 */

export function* loadJwt({ jwtStorage }: TGlobalDependencies): Iterator<Effect> {
  const jwt = jwtStorage.get();
  if (jwt) {
    yield put(actions.auth.loadJWT(jwt));
    return jwt;
  }
}

export async function obtainJwtPromise(
  { getState, web3Manager, signatureAuthApi, cryptoRandomString, logger }: TGlobalDependencies,
  permissions: Array<string> = [],
): Promise<string> {
  const address = selectEthereumAddressWithChecksum(getState());

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
  const jwt: string = yield neuCall(obtainJwtPromise, permissions);
  yield put(actions.auth.loadJWT(jwt));
  yield jwtStorage.set(jwt);

  return jwt;
}

/**
 * Saga to ensure all the needed permissions are present and still valid
 * on the current jwt
 */
export function* ensurePermissionsArePresent(
  { jwtStorage }: TGlobalDependencies,
  permissions: Array<string> = [],
  title: string = "",
  message: string = "",
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
  } catch {
    throw new Error("Message signing failed");
  }
}

const redirectChannel = channel();

export function* startRedirectChannel(): any {
  window.addEventListener("storage", (evt: StorageEvent) => {
    if (evt.key === STORAGE_JWT_KEY && !evt.newValue) {
      console.log("LOG OUT");
      redirectChannel.put({
        type: actions.auth.logout,
      });
      redirectChannel.close();
    }
  });
}

export function* watchRedirectChannel(): any {
  yield startRedirectChannel();
  while (true) {
    yield take(redirectChannel);
    yield put(actions.auth.logout());
    yield delay(5000);
  }
}
