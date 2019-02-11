import BigNumber from "bignumber.js";

import {NumericString} from "../../types";
import {numericStringToBigNumber} from "../../utils/numericStringUtils";

export interface IBlTxData {
  to: string;
  value: BigNumber;
  data?: string;
  from: string;
  input?: string;
  gas: BigNumber;
  gasPrice: BigNumber;
}

export interface IStateTxData {
  to: string;
  value: NumericString;
  data?: string;
  from: string;
  input?: string;
  gas: NumericString;
  gasPrice: NumericString;
}

export const stateToBlConversionSpec = {
  value: numericStringToBigNumber(),
  gas: numericStringToBigNumber(),
  gasPrice: numericStringToBigNumber()
}

export interface IRawTxData extends IBlTxData {
  nonce: string;
}

export interface IEthereumNetworkConfig {
  rpcUrl: string;
}
