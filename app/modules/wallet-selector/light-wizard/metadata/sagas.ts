import { select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ILightWalletRetrieveMetadata } from "../../../../lib/persistence/WalletMetadataObjectStorage";
import { LightWalletWrongPassword } from "../../../../lib/web3/LightWallet";
import { IAppState } from "../../../../store";
import { neuCall } from "../../../sagasUtils";
import {
  selectLightWalletFromQueryString,
  selectPreviousConnectedWallet,
} from "../../../web3/selectors";
import { EWalletType } from "../../../web3/types";
import { getVaultKey } from "../utils";

export async function retrieveMetadataFromVaultAPI(
  { vaultApi }: TGlobalDependencies,
  password: string,
  salt: string,
  email: string,
): Promise<ILightWalletRetrieveMetadata> {
  const vaultKey = await getVaultKey(salt, password);
  try {
    const vault = await vaultApi.retrieve(vaultKey);

    return {
      walletType: EWalletType.LIGHT,
      salt,
      vault,
      email,
    };
  } catch {
    throw new LightWalletWrongPassword();
  }
}

export function* getWalletMetadataByURL(
  password: string,
): Iterator<any | ILightWalletRetrieveMetadata | undefined> {
  const queryStringWalletInfo: { email: string; salt: string } | undefined = yield select(
    (s: IAppState) => selectLightWalletFromQueryString(s.router),
  );
  if (queryStringWalletInfo) {
    return yield neuCall(
      retrieveMetadataFromVaultAPI,
      password,
      queryStringWalletInfo.salt,
      queryStringWalletInfo.email,
    );
  }
  const savedMetadata = yield select((s: IAppState) => selectPreviousConnectedWallet(s.web3));
  if (savedMetadata && savedMetadata.walletType === EWalletType.LIGHT) {
    return savedMetadata;
  }

  return undefined;
}
