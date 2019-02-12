import {Dictionary} from "../../../types";
import * as investorTicketInterfaces from "./InvestorTicket";
import * as calculatedContributionInterfaces from './CalculatedContribution'
import * as tokenDisbursalInterfaces from './TokenDisbursal'

export interface IStateInvestorTickets {
  investorEtoTickets: Dictionary<investorTicketInterfaces.IStateInvestorTicket | undefined>;
  calculatedContributions: Dictionary<calculatedContributionInterfaces.IStateCalculatedContribution | undefined>;
  initialCalculatedContributions: Dictionary<calculatedContributionInterfaces.IStateCalculatedContribution | undefined>;
  tokensDisbursal: tokenDisbursalInterfaces.IStateTokenDisbursal[] | undefined;
}

export interface IBlInvestorTickets {
  investorEtoTickets: Dictionary<investorTicketInterfaces.IBlInvestorTicket | undefined>;
  calculatedContributions: Dictionary<calculatedContributionInterfaces.IBlCalculatedContribution | undefined>;
  initialCalculatedContributions: Dictionary<calculatedContributionInterfaces.IBlCalculatedContribution | undefined>;
  tokensDisbursal: tokenDisbursalInterfaces.IBlTokenDisbursal[] | undefined;
}

export const stateToBlConversionSpec = {
  investorEtoTickets: investorTicketInterfaces.stateToBlConversionSpec,
  calculatedContributions: calculatedContributionInterfaces.stateToBlConversionSpec,
  initialCalculatedContributions: calculatedContributionInterfaces.stateToBlConversionSpec,
  tokensDisbursal: tokenDisbursalInterfaces.stateToBlConversionSpec
};
