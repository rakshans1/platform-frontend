export enum EInitType {
  APP_INIT = "appInit",
  START_CONTRACTS_INIT = "smartcontractsInit",
  WALLET_INIT = "walletInit",
}

interface IAsyncActionState {
  inProgress: boolean;
  done: boolean;
  error?: string;
}

export interface IInitState {
  appInit: IAsyncActionState;
  smartcontractsInit: IAsyncActionState;
}
