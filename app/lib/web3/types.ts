import BigNumber from "bignumber.js";

export interface ITxData {
  to: string;
  value: BigNumber;
  data?: string;
  from: string;
  input?: string;
  gas: BigNumber;
  gasPrice: BigNumber;
}

export interface IRawTxData extends ITxData {
  nonce: string;
}

export interface IEthereumNetworkConfig {
  rpcUrl: string;
}

export type TBigNumberVariant = BigNumber;
