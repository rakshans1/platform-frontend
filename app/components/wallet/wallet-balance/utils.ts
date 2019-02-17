import BigNumber from "bignumber.js";

export const isWalletNotEmpty = (amount: BigNumber): boolean => !!(amount && !amount.isZero());
