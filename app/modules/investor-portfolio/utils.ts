import BigNumber from "bignumber.js";

import { ECurrency } from "../../components/shared/Money";
import { Q18 } from "../../config/constants";
import { IBlCalculatedContribution, IStateTokenDisbursal } from "./interfaces/interfaces";
import {IBlInvestorTicket} from './interfaces/InvestorTicket'

export const convertToCalculatedContribution = ([
  isWhitelisted,
  isEligible,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded,
]: [
  boolean,
  boolean,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean
]): IBlCalculatedContribution => ({
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
  currency: ECurrency,
  [amountToBeClaimed, totalDisbursedAmount, timeToFirstDisbursalRecycle]: [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ],
): IStateTokenDisbursal => ({
  currency,
  amountToBeClaimed: amountToBeClaimed.toString(),
  totalDisbursedAmount: totalDisbursedAmount.toString(),
  // convert seconds timestamp to milliseconds
  timeToFirstDisbursalRecycle: timeToFirstDisbursalRecycle.mul(1000).toNumber(),
});

export const getNeuReward = (equityTokenInt: BigNumber, equivEurUlps: BigNumber): string => {
  if (equivEurUlps.isZero()) {
    return "0";
  }

  const equityToken = Q18.mul(equityTokenInt);
  return equivEurUlps.div(equityToken).toFixed(8);
};
