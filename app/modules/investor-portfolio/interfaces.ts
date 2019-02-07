import {Dictionary, NumericString} from "../../types";
import {ECurrency} from "../../components/shared/Money";
import {IEtoTokenData, TEtoWithCompanyAndContract} from "../public-etos/types";

export interface IInvestorTicketsState {
  investorEtoTickets: Dictionary<IInvestorTicket | undefined>;
  calculatedContributions: Dictionary<ICalculatedContribution | undefined>;
  initialCalculatedContributions: Dictionary<ICalculatedContribution | undefined>;
  tokensDisbursal: ITokenDisbursal[] | undefined;
}

export interface ICalculatedContribution {
  isWhitelisted: boolean;
  isEligible: boolean;
  minTicketEurUlps: NumericString;
  maxTicketEurUlps: NumericString;
  equityTokenInt: NumericString;
  neuRewardUlps: NumericString;
  maxCapExceeded: boolean;
}

export interface IInvestorTicket {
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

export interface ITokenDisbursal {
  currency: ECurrency;
  amountToBeClaimed: string;
  totalDisbursedAmount: string;
  timeToFirstDisbursalRecycle: number;
}

export type TETOWithInvestorTicket = TEtoWithCompanyAndContract & {
  investorTicket: IInvestorTicket;
};

export type TETOWithTokenData = TETOWithInvestorTicket & {
  tokenData: IEtoTokenData;
};
