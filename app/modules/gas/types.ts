import BigNumber from "bignumber.js";

export interface GasModelData {
  fast: BigNumber;
  fastest: BigNumber;
  safeLow: BigNumber;
  standard: BigNumber;
}
