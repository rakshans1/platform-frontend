import {ILockedWallet} from "../wallet/reducer";

export type TWalletMigrationSteps = 1 | 2; //todo enum

export interface IWalletMigrationDataState {
  smartContractAddress: string;
  migrationInputData: string;
  gasLimit: string;
  value: string;
}
export interface IIcbmWalletBalanceModalState {
  isOpen: boolean;
  loading: boolean;
  icbmWalletEthAddress?: string;
  icbmLockedEthWallet?: ILockedWallet;
  walletMigrationData?: IWalletMigrationDataState[];
  currentMigrationStep: TWalletMigrationSteps;
  isMigrating: boolean;
  firstTransactionDone: boolean;
  secondTransactionDone: boolean;
}
