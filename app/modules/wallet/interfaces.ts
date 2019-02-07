import {NumericString} from "../../types";

export interface IWalletState {
  loading: boolean;
  error?: string;
  data?: IWalletDataState;
}

export interface ILockedWalletState {
  LockedBalance: NumericString;
  neumarksDue: NumericString;
  unlockDate: string;
}

export interface IWalletDataState {
  euroTokenLockedWallet: ILockedWalletState;
  etherTokenLockedWallet: ILockedWalletState;

  etherTokenBalance: NumericString;
  euroTokenBalance: NumericString;
  etherBalance: NumericString;
  neuBalance: NumericString;

  euroTokenICBMLockedWallet: ILockedWalletState;
  etherTokenICBMLockedWallet: ILockedWalletState;
  etherTokenUpgradeTarget?: string;
  euroTokenUpgradeTarget?: string;
}
