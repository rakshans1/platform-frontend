import {TWalletMetadata} from "../../lib/persistence/WalletMetadataObjectStorage";

export interface IDisconnectedWeb3State {
  connected: false;
  previousConnectedWallet?: TWalletMetadata;
}

export interface IWalletPrivateData {
  seed: string[];
  privateKey: string;
}
export interface IConnectedWeb3State {
  connected: true;
  wallet: TWalletMetadata;
  isUnlocked: boolean; // this is important only for light wallet
  walletPrivateData?: {
    seed: string;
    privateKey: string;
  };
}

export type IWeb3State = IDisconnectedWeb3State | IConnectedWeb3State;

// normalized information about all possible types of personal wallets
export enum EWalletType {
  LEDGER = "LEDGER",
  BROWSER = "BROWSER",
  LIGHT = "LIGHT",
  UNKNOWN = "UNKNOWN",
}
export enum EWalletSubType {
  METAMASK = "METAMASK",
  PARITY = "PARITY",
  UNKNOWN = "UNKNOWN",
}
