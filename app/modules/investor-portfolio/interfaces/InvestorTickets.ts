import {Dictionary} from "../../../types";
import * as investorTicketInterfaces from "./InvestorTicket";
import * as calculatedContributionInterfaces from './CalculatedContribution'
import * as tokenDisbursalInterfaces from './TokenDisbursal'
import * as incomingPayoutsInterfaces from "./IncomingPayouts";

export interface IStateInvestorTickets {
  investorEtoTickets: Dictionary<investorTicketInterfaces.IStateInvestorTicket | undefined>;
  calculatedContributions: Dictionary<calculatedContributionInterfaces.IStateCalculatedContribution | undefined>;
  initialCalculatedContributions: Dictionary<calculatedContributionInterfaces.IStateCalculatedContribution | undefined>;
  tokensDisbursal: tokenDisbursalInterfaces.IStateTokenDisbursal[] | undefined;
  incomingPayouts: incomingPayoutsInterfaces.IStateIncomingPayouts
}

export interface IBlInvestorTickets {
  investorEtoTickets: Dictionary<investorTicketInterfaces.IBlInvestorTicket | undefined>;
  calculatedContributions: Dictionary<calculatedContributionInterfaces.IBlCalculatedContribution | undefined>;
  initialCalculatedContributions: Dictionary<calculatedContributionInterfaces.IBlCalculatedContribution | undefined>;
  tokensDisbursal: tokenDisbursalInterfaces.IBlTokenDisbursal[] | undefined;
  incomingPayouts: incomingPayoutsInterfaces.IBlIncomingPayouts
}

export const stateToBlConversionSpec = {
  investorEtoTickets: investorTicketInterfaces.stateToBlConversionSpec,
  calculatedContributions: calculatedContributionInterfaces.stateToBlConversionSpec,
  initialCalculatedContributions: calculatedContributionInterfaces.stateToBlConversionSpec,
  tokensDisbursal: tokenDisbursalInterfaces.stateToBlConversionSpec,
  incomingPayouts: incomingPayoutsInterfaces.stateToBlConversionSpec
};
