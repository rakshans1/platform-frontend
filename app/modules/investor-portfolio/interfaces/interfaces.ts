import BigNumber from "bignumber.js";

import {Dictionary, NumericString} from "../../../types";
import {ECurrency} from "../../../components/shared/Money";
// import {IStateEtoTokenData, TStateEtoWithCompanyAndContract} from "../../public-etos/interfaces";
import {IStateInvestorTicket} from './InvestorTicket'

export interface IStateInvestorTickets {
  investorEtoTickets: Dictionary<IStateInvestorTicket | undefined>;
  calculatedContributions: Dictionary<IStateCalculatedContribution | undefined>;
  initialCalculatedContributions: Dictionary<IStateCalculatedContribution | undefined>;
  tokensDisbursal: IStateTokenDisbursal[] | undefined;
}

export interface IStateCalculatedContribution {
  isWhitelisted: boolean;
  isEligible: boolean;
  minTicketEurUlps: NumericString;
  maxTicketEurUlps: NumericString;
  equityTokenInt: NumericString;
  neuRewardUlps: NumericString;
  maxCapExceeded: boolean;
}

export interface IBlCalculatedContribution {
  isWhitelisted: boolean;
  isEligible: boolean;
  minTicketEurUlps: BigNumber;
  maxTicketEurUlps: BigNumber;
  equityTokenInt: BigNumber;
  neuRewardUlps: BigNumber;
  maxCapExceeded: boolean;
}

export interface IStateTokenDisbursal {
  currency: ECurrency;
  amountToBeClaimed: string;
  totalDisbursedAmount: string;
  timeToFirstDisbursalRecycle: number;
}

export type TETOWithInvestorTicket = TEtoWithCompanyAndContract & {
  investorTicket: IStateInvestorTicket;
};

export type TETOWithTokenData = TETOWithInvestorTicket & {
  tokenData: IEtoTokenData;
};
