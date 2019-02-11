import BigNumber from "bignumber.js";

import {NumericString} from "../../types";

export interface IGasState {
  loading: boolean;
  gasPrice?: IStateGasModel;
  error?: string;
}

export interface IStateGasModel {
  fast: NumericString;
  fastest: NumericString;
  safeLow: NumericString;
  standard: NumericString;
}

export interface IBlGasModel {
  fast: BigNumber;
  fastest: BigNumber;
  safeLow: BigNumber;
  standard: BigNumber;
}
