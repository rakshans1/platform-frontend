import { promisify } from "bluebird";
import * as LightWalletProvider from "eth-lightwallet";
import * as nacl from "tweetnacl";
import * as naclUtil from "tweetnacl-util";

import { ICreateVault, ILightWallet, IVault } from "./LightWallet";

export class LightWalletUtilError extends Error {}
export class LightWrongPasswordSaltError extends LightWalletUtilError {}
export class LightCreationError extends LightWalletUtilError {}
export class LightKeyEncryptError extends LightWalletUtilError {}
export class LightDeserializeError extends LightWalletUtilError {}
export class LightWalletWrongMnemonic extends LightWalletUtilError {}

export const deserializeLightWalletVault = async (
  serializedWallet: string,
  salt: string,
): Promise<ILightWallet> => {
  try {
    return await LightWalletProvider.keystore.deserialize(serializedWallet, salt);
  } catch (e) {
    throw new LightDeserializeError();
  }
};

export const createLightWalletVault = async ({
  password,
  hdPathString,
  recoverSeed,
  customSalt,
}: ICreateVault): Promise<IVault> => {
  try {
    const create = promisify<any, object>(LightWalletProvider.keystore.createVault);
    //256bit strength generates a 24 word mnemonic
    const entropyStrength = 256;
    const seed = recoverSeed
      ? recoverSeed
      : LightWalletProvider.keystore.generateRandomSeed(undefined, entropyStrength);
    //salt strength should be 32 bit. see https://github.com/ConsenSys/eth-lightwallet/blob/master/lib/keystore.js#L107
    const salt = customSalt ? customSalt : LightWalletProvider.keystore.generateSalt(32);
    const lightWalletInstance = await create({
      password,
      seedPhrase: seed,
      hdPathString,
      salt,
    }).catch(() => {
      throw new LightWalletWrongMnemonic();
    });
    const unlockedWallet = await getWalletKey(lightWalletInstance, password);
    lightWalletInstance.generateNewAddress(unlockedWallet, 1);
    return { walletInstance: await lightWalletInstance.serialize(), salt };
  } catch (e) {
    if (e instanceof LightWalletWrongMnemonic) throw new LightWalletWrongMnemonic();
    throw new LightCreationError();
  }
};

export const encryptString = ({
  string,
  pwDerivedKey,
}: {
  string: string;
  pwDerivedKey: Uint8Array;
}): string => {
  try {
    // nacl.secretbox nonce must be 24 bytes @see https://github.com/dchest/tweetnacl-js#naclsecretboxnoncelength--24
    const encObj = nacl.secretbox(
      naclUtil.decodeUTF8(string),
      pwDerivedKey.slice(32, 56),
      pwDerivedKey.slice(0, 32),
    );
    const encString = Buffer.from(encObj).toString("hex");
    return encString;
  } catch (e) {
    throw new LightKeyEncryptError();
  }
};

export const getWalletKeyFromSaltAndPassword = async (
  salt: string,
  password: string,
  keySize: number = 32,
): Promise<Uint8Array> => {
  try {
    const keyFromSaltAndPassword = promisify<any, string, string, number>(
      LightWalletProvider.keystore.deriveKeyFromPasswordAndSalt,
    );
    return await keyFromSaltAndPassword(password, salt, keySize);
  } catch (e) {
    throw new LightWrongPasswordSaltError();
  }
};

export const getWalletKey = async (lightWalletInstance: any, password: string): Promise<object> => {
  try {
    const keyFromPassword = promisify<ILightWallet, string>(
      lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
    );
    return await keyFromPassword(password);
  } catch (e) {
    throw new LightWrongPasswordSaltError();
  }
};

export const getWalletSeed = async (
  lightWalletInstance: any,
  password: string,
): Promise<string> => {
  try {
    const keyFromPassword = promisify<ILightWallet, string>(
      lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
    );
    return await lightWalletInstance.getSeed(await keyFromPassword(password));
  } catch (e) {
    throw new LightWrongPasswordSaltError();
  }
};

export const testWalletPassword = async (
  lightWalletInstance: any,
  password: string,
): Promise<boolean> => {
  const key = await getWalletKey(lightWalletInstance, password);
  return lightWalletInstance.isDerivedKeyCorrect(key);
};

export const getWalletPrivKey = async (
  lightWalletInstance: any,
  password: string,
): Promise<string> => {
  try {
    const keyFromPassword = promisify<ILightWallet, string>(
      lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
    );

    // Take first address only
    return await lightWalletInstance.exportPrivateKey(
      lightWalletInstance.addresses[0],
      await keyFromPassword(password),
    );
  } catch (e) {
    throw new LightWrongPasswordSaltError();
  }
};
