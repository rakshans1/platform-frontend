import { delay, Effect, effects } from "redux-saga";
import { call, put, race, select, take } from "redux-saga/effects";

import { GenericErrorMessage } from "../../components/translatedMessages/messages";
import { TMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import {
  IBrowserWalletMetadata,
  ILedgerWalletMetadata,
  ILightWalletMetadata,
  ILightWalletRetrieveMetadata,
} from "../../lib/persistence/WalletMetadataObjectStorage";
import { BrowserWalletConnector } from "../../lib/web3/BrowserWallet";
import { LedgerWalletConnector } from "../../lib/web3/LedgerWallet";
import { LightWalletConnector } from "../../lib/web3/LightWallet";
import { deserializeLightWalletVault } from "../../lib/web3/LightWalletUtils";
import { IPersonalWallet } from "../../lib/web3/PersonalWeb3";
import { SignerError, Web3Manager } from "../../lib/web3/Web3Manager";
import { IAppState } from "../../store";
import { invariant } from "../../utils/invariant";
import { actions, TAction, TActionFromCreator } from "../actions";
import { MessageSignCancelledError } from "../auth/errors";
import { selectUserType } from "../auth/selectors";
import { neuCall } from "../sagasUtils";
import { retrieveMetadataFromVaultAPI } from "../wallet-selector/light-wizard/sagas";
import { EWalletType } from "../web3/types";
import { mapSignMessageErrorToErrorMessage, MismatchedWalletAddressError } from "./errors";
import { selectIsSigning } from "./reducer";

export function* ensureWalletConnection(
  {
    web3Manager,
    walletStorage,
    lightWalletConnector,
    ledgerWalletConnector,
    browserWalletConnector,
  }: TGlobalDependencies,
  password?: string,
): any {
  if (web3Manager.personalWallet) {
    return;
  }
  const userType: EUserType = yield select(selectUserType);
  const metadata = walletStorage.get(userType);

  if (!metadata) return invariant(metadata, "User has JWT but doesn't have wallet metadata!");

  let wallet: IPersonalWallet;
  switch (metadata.walletType) {
    case EWalletType.LEDGER:
      wallet = yield connectLedger(ledgerWalletConnector, web3Manager, metadata);
      break;
    case EWalletType.BROWSER:
      wallet = yield connectBrowser(browserWalletConnector, web3Manager, metadata);
      break;
    case EWalletType.LIGHT:
      if (!password) return invariant(metadata, "Light Wallet user without a password");
      wallet = yield connectLightWallet(lightWalletConnector, metadata, password);
      break;
    default:
      return invariant(false, "Wallet type unrecognized");
  }

  // verify if newly plugged wallet address is the same as before. Mismatch can happen for multiple reasons:
  //  - user selects different wallet in user interface (metamask)
  //  - user attaches different ledger device
  const isSameAddress = wallet.ethereumAddress.toLowerCase() === metadata.address.toLowerCase();
  if (!isSameAddress) {
    throw new MismatchedWalletAddressError(metadata.address, wallet.ethereumAddress);
  }

  yield web3Manager.plugPersonalWallet(wallet);
}

async function connectLedger(
  ledgerWalletConnector: LedgerWalletConnector,
  web3Manager: Web3Manager,
  metadata: ILedgerWalletMetadata,
): Promise<IPersonalWallet> {
  await ledgerWalletConnector.connect(web3Manager.networkId);
  return await ledgerWalletConnector.finishConnecting(metadata.derivationPath);
}

async function connectBrowser(
  browserWalletConnector: BrowserWalletConnector,
  web3Manager: Web3Manager,
  // tslint:disable-next-line
  metadata: IBrowserWalletMetadata,
): Promise<IPersonalWallet> {
  return await browserWalletConnector.connect(web3Manager.networkId);
}

export function* connectLightWallet(
  lightWalletConnector: LightWalletConnector,
  metadata: ILightWalletMetadata,
  password: string,
): any {
  const walletVault: ILightWalletRetrieveMetadata = yield neuCall(
    retrieveMetadataFromVaultAPI,
    password,
    metadata.salt,
    metadata.email,
  );
  const walletInstance = yield deserializeLightWalletVault(walletVault.vault, metadata.salt);

  return yield lightWalletConnector.connect(
    {
      walletInstance,
      salt: metadata.salt,
    },
    metadata.email,
    password,
  );
}

export function* connectWalletAndRunEffect(effect: Effect | Iterator<Effect>): any {
  while (true) {
    try {
      yield effects.put(actions.accessWallet.clearSigningError());

      const acceptAction: TActionFromCreator<typeof actions.accessWallet.accept> = yield take(
        actions.accessWallet.accept.getType(),
      );

      // Password can be undefined if its Metamask or Ledger
      yield neuCall(ensureWalletConnection, acceptAction.payload.password);

      return yield effect;
    } catch (e) {
      const error = mapSignMessageErrorToErrorMessage(e);
      yield effects.put(actions.accessWallet.signingError(error));

      if (e instanceof SignerError || error.messageType === GenericErrorMessage.GENERIC_ERROR)
        throw e;

      yield delay(500);
    }
  }
}

export function* accessWalletAndRunEffect(
  effect: Effect | Iterator<Effect>,
  title: TMessage,
  message: TMessage,
): any {
  // guard against multiple modals
  const isSigning: boolean = yield select((s: IAppState) => selectIsSigning(s.accessWallet));
  if (isSigning) {
    throw new Error("Signing already in progress");
  }
  yield put(actions.accessWallet.showAccessWalletModal(title, message));

  // do required operation, or finish in case cancel button was hit
  const { result, cancel } = yield race({
    result: call(connectWalletAndRunEffect, effect),
    cancel: take("HIDE_ACCESS_WALLET_MODAL"),
  });

  // always hide the current modal
  yield effects.put(actions.accessWallet.hideAccessWalletModal());

  // if the cancel action was called
  // throw here
  if (cancel) {
    throw new MessageSignCancelledError("Cancelled");
  }

  return result;
}

/**
 * Use only as a part of another saga. This won't trigger modal.
 */
export function* connectWallet(): any {
  yield connectWalletAndRunEffect(call(() => {}));
}
