import {NumericString} from "../../../types";
import {bigNumberToNumericString} from "../../../utils/numericStringUtils";
import BigNumber from "bignumber.js";

export interface IStateInvestorTicket {
  equivEurUlps: NumericString;
  rewardNmkUlps: NumericString;
  equityTokenInt: NumericString;
  sharesInt: NumericString;
  tokenPrice: NumericString;
  neuRate: NumericString;
  amountEth: NumericString;
  amountEurUlps: NumericString;
  claimedOrRefunded: boolean;
  usedLockedAccount: boolean;
}

export interface IBlInvestorTicket {
  equivEurUlps: BigNumber;
  rewardNmkUlps: BigNumber;
  equityTokenInt: BigNumber;
  sharesInt: BigNumber;
  tokenPrice: BigNumber;
  neuRate: BigNumber;
  amountEth: BigNumber;
  amountEurUlps: BigNumber;
  claimedOrRefunded: boolean;
  usedLockedAccount: boolean;
}

export const blToStateConversionSpec = {
  equivEurUlps: bigNumberToNumericString(),
  rewardNmkUlps: bigNumberToNumericString(),
  equityTokenInt: bigNumberToNumericString(),
  sharesInt: bigNumberToNumericString(),
  tokenPrice: bigNumberToNumericString(),
  neuRate: bigNumberToNumericString(),
  amountEth: bigNumberToNumericString(),
  amountEurUlps: bigNumberToNumericString(),
}
