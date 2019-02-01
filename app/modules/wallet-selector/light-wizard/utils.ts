import { TGlobalDependencies } from "../../../di/setupBindings";
import { ILightWalletMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import {
  createLightWalletVault,
  deserializeLightWalletVault,
  encryptString,
  getWalletKeyFromSaltAndPassword,
} from "../../../lib/web3/LightWalletUtils";
import { GENERATED_KEY_SIZE, VAULT_MSG } from "./constants";
import { DEFAULT_HD_PATH } from "./sagas";

export async function getVaultKey(salt: string, password: string): Promise<string> {
  const walletKey = await getWalletKeyFromSaltAndPassword(password, salt, GENERATED_KEY_SIZE);
  return encryptString({
    string: VAULT_MSG,
    pwDerivedKey: walletKey,
  });
}

export async function setupLightWalletPromise(
  { vaultApi, lightWalletConnector, web3Manager, logger }: TGlobalDependencies,
  email: string,
  password: string,
  seed: string,
): Promise<ILightWalletMetadata> {
  try {
    const lightWalletVault = await createLightWalletVault({
      password,
      hdPathString: DEFAULT_HD_PATH,
      recoverSeed: seed,
    });
    const walletInstance = await deserializeLightWalletVault(
      lightWalletVault.walletInstance,
      lightWalletVault.salt,
    );

    const vaultKey = await getVaultKey(lightWalletVault.salt, password);
    await vaultApi.store(vaultKey, lightWalletVault.walletInstance);

    const lightWallet = await lightWalletConnector.connect(
      {
        walletInstance,
        salt: lightWalletVault.salt,
      },
      email,
      password,
    );

    await web3Manager.plugPersonalWallet(lightWallet);
    return lightWallet.getMetadata() as ILightWalletMetadata;
  } catch (e) {
    logger.warn("Error while trying to connect with light wallet: ", e);
    throw e;
  }
}
