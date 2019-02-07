import {NumericString} from "../../types";

export interface IGasState {
  loading: boolean;
  gasPrice?: GasModelState;
  error?: string;
}

export interface GasModelState {
  fast: NumericString;
  fastest: NumericString;
  safeLow: NumericString;
  standard: NumericString;
}
