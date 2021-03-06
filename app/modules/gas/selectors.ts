import { GasModelShape } from "../../lib/api/GasApi";
import { calculateGasPriceWithOverhead } from "../tx/utils";
import { IAppState } from "./../../store";

export const selectIsGasPriceAlreadyLoaded = (state: IAppState): boolean =>
  !state.gas.loading && !!state.gas.gasPrice;

export const selectGasPrice = (state: IAppState): GasModelShape | undefined => state.gas.gasPrice;

export const selectStandardGasPrice = (state: IAppState): string =>
  (state.gas.gasPrice && state.gas.gasPrice.standard) || "0";

export const selectStandardGasPriceWithOverHead = (state: IAppState): string =>
  (state.gas.gasPrice && calculateGasPriceWithOverhead(state.gas.gasPrice.standard)) || "0";
