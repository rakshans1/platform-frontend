import BigNumber from "bignumber.js";

import { calculateGasPriceWithOverhead } from "../tx/utils";
import { IAppState } from "../../store";
import {IBlGasModel} from "./interfaces";

export const selectIsGasPriceAlreadyLoaded = (state: IAppState): boolean =>
  !state.gas.loading && !!state.gas.gasPrice;

export const selectGasPrice = (state: IAppState): IBlGasModel | undefined => {
  return state.gas.gasPrice
    ? {
      fast: new BigNumber(state.gas.gasPrice.fast),
      fastest: new BigNumber(state.gas.gasPrice.fastest),
      safeLow: new BigNumber(state.gas.gasPrice.safeLow),
      standard: new BigNumber(state.gas.gasPrice.standard),
    }
    : undefined;
};

export const selectStandardGasPrice = (state: IAppState): BigNumber => {
  return state.gas.gasPrice && state.gas.gasPrice.standard
    ? new BigNumber(state.gas.gasPrice.standard)
    : new BigNumber( "0");
};

export const selectStandardGasPriceWithOverHead = (state: IAppState): BigNumber =>
  state.gas.gasPrice && calculateGasPriceWithOverhead(new BigNumber(state.gas.gasPrice.standard)) || new BigNumber("0");
