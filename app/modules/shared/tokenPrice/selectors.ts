import BigNumber from "bignumber.js";

import { IAppState } from "../../../store";
import { IStateTokenPriceData } from "./interfaces";

const selectTokenPriceData = (state: IAppState): IStateTokenPriceData | undefined =>
  state.tokenPrice.tokenPriceData;

export const selectEtherPriceEur = (state: IAppState): BigNumber => {
  const data = selectTokenPriceData(state);
  return new BigNumber((data && data.etherPriceEur) || "0");
};

export const selectNeuPriceEur = (state: IAppState): BigNumber => {
  const data = selectTokenPriceData(state);
  return new BigNumber((data && data.neuPriceEur) || "0");
};

export const selectEurPriceEther = (state: IAppState): BigNumber => {
  const data = selectTokenPriceData(state);
  return new BigNumber((data && data.eurPriceEther) || "0");
};
