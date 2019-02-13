import BigNumber from "bignumber.js";

import { ECurrency } from "../../components/shared/Money";
import { Q18 } from "../../config/constants";
import {  IStateTokenDisbursal } from "./interfaces/TokenDisbursal";
import { IBlCalculatedContribution, } from "./interfaces/CalculatedContribution";
import {IBlInvestorTicket} from './interfaces/InvestorTicket'
import {TContribution} from "../contracts/interfaces";
import {NumericString} from "../../types";

export const convertToCalculatedContribution = ([
  isWhitelisted,
  isEligible,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded,
]: TContribution): IBlCalculatedContribution => ({
  isWhitelisted,
  isEligible,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded,
});

export const convertToInvestorTicket = ([
  equivEurUlps,
  rewardNmkUlps,
  equityTokenInt,
  sharesInt,
  tokenPrice,
  neuRate,
  amountEth,
  amountEurUlps,
  claimedOrRefunded,
  usedLockedAccount,
]: [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean,
  boolean
]): IBlInvestorTicket => ({
  equivEurUlps,
  rewardNmkUlps,
  equityTokenInt,
  sharesInt,
  tokenPrice,
  neuRate,
  amountEth,
  amountEurUlps,
  claimedOrRefunded,
  usedLockedAccount,
});

export const convertToTokenDisbursal = (
  token: ECurrency,
  [amountToBeClaimed, totalDisbursedAmount, timeToFirstDisbursalRecycle]: [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ],
): IStateTokenDisbursal => ({
  token,
  amountToBeClaimed: amountToBeClaimed.toString() as NumericString,
  totalDisbursedAmount: totalDisbursedAmount.toString() as NumericString,
  // convert seconds timestamp to milliseconds
  timeToFirstDisbursalRecycle: timeToFirstDisbursalRecycle.mul(1000).toNumber(),
});

export const getNeuReward = (equityTokenInt: BigNumber, equivEurUlps: BigNumber): string => {
  if (equivEurUlps.isZero()) {
    return "0";
  }

  const equityToken = Q18.mul(equityTokenInt);
  return equivEurUlps.div(equityToken).toFixed(8); //fixme string???
};
