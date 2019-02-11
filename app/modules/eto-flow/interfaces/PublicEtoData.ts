import {NumericString} from "../../../types";
import {EEtoState} from "../../../lib/api/eto/EtoApi.interfaces";
import {TEtoDocumentTemplates} from "../../eto-documents/interfaces";
import {numberToNumericString, numericStringToBigNumber} from "../../../utils/numericStringUtils";
import BigNumber from "bignumber.js";

export interface IStatePublicEtoData {
  currencies: Array<string>;//fixme should be an enum?
  prospectusLanguage: string,
  minTicketEur:NumericString;
  maxTicketEur: NumericString;
  enableTransferOnSuccess: boolean,
  notUnderCrowdfundingRegulations: boolean;
  allowRetailInvestors: boolean;
  whitelistDurationDays: number;
  publicDurationDays: number;
  signingDurationDays: number;
  additionalTerms?: string;

  equityTokenName: string;
  equityTokenSymbol: string;
  equityTokenImage: string;

  nominee: string;
  liquidationPreferenceMultiplier: NumericString;
  generalVotingRule: string;

  equityTokensPerShare: NumericString;
  shareNominalValueEur: NumericString;
  preMoneyValuationEur: NumericString;
  existingCompanyShares: NumericString;
  authorizedCapitalShares: NumericString;
  newSharesToIssue: NumericString;
  minimumNewSharesToIssue: NumericString;
  newSharesToIssueInWhitelist: NumericString;
  whitelistDiscountFraction: NumericString;
  publicDiscountFraction: NumericString;
  newSharesToIssueInFixedSlots: NumericString;
  fixedSlotsMaximumDiscountFraction: NumericString;
  discountScheme: NumericString;

  etoId: string;
  companyId: string;
  previewCode: string;
  state: EEtoState;
  isBookbuilding: boolean;
  templates: TEtoDocumentTemplates;
  startDate: string;
  documents: TEtoDocumentTemplates;
  maxPledges: number;
  canEnableBookbuilding: boolean;
}



export interface IApiPublicEtoData {
  currencies: Array<string>;//fixme should be an enum?
  prospectusLanguage: string,
  minTicketEur:number;
  maxTicketEur: number;
  enableTransferOnSuccess: boolean,
  notUnderCrowdfundingRegulations: boolean;
  allowRetailInvestors: boolean;
  whitelistDurationDays: number;
  publicDurationDays: number;
  signingDurationDays: number;
  additionalTerms?: string;

  equityTokenName: string;
  equityTokenSymbol:string;
  equityTokenImage: string;

  nominee: string;
  liquidationPreferenceMultiplier: number;
  generalVotingRule: string;

  equityTokensPerShare: number;
  shareNominalValueEur: number;
  preMoneyValuationEur: number;
  existingCompanyShares: number;
  authorizedCapitalShares:number;
  newSharesToIssue: number;
  minimumNewSharesToIssue:number;
  newSharesToIssueInWhitelist: number;
  whitelistDiscountFraction: number;
  publicDiscountFraction: number;
  newSharesToIssueInFixedSlots: number;
  fixedSlotsMaximumDiscountFraction: number;
  discountScheme: number;

  etoId: string;
  companyId: string;
  previewCode: string;
  state: EEtoState;
  isBookbuilding: boolean;
  templates: TEtoDocumentTemplates;
  startDate: string;
  documents: TEtoDocumentTemplates;
  maxPledges: number;
  canEnableBookbuilding: boolean;
}

export interface IBlPublicEtoData {
  currencies: Array<string>;//fixme should be an enum?
  prospectusLanguage: string,
  minTicketEur:BigNumber;
  maxTicketEur: BigNumber;
  enableTransferOnSuccess: boolean,
  notUnderCrowdfundingRegulations: boolean;
  allowRetailInvestors: boolean;
  whitelistDurationDays: number;
  publicDurationDays: number;
  signingDurationDays: number;
  additionalTerms?: string;

  equityTokenName: string;
  equityTokenSymbol: string;
  equityTokenImage: string;

  nominee: string;
  liquidationPreferenceMultiplier: BigNumber;
  generalVotingRule: string;

  equityTokensPerShare: BigNumber;
  shareNominalValueEur: BigNumber;
  preMoneyValuationEur: BigNumber;
  existingCompanyShares: BigNumber;
  authorizedCapitalShares: BigNumber;
  newSharesToIssue: BigNumber;
  minimumNewSharesToIssue: BigNumber;
  newSharesToIssueInWhitelist: BigNumber;
  whitelistDiscountFraction: BigNumber;
  publicDiscountFraction: BigNumber;
  newSharesToIssueInFixedSlots: BigNumber;
  fixedSlotsMaximumDiscountFraction: BigNumber;
  discountScheme: BigNumber;

  etoId: string;
  companyId: string;
  previewCode: string;
  state: EEtoState;
  isBookbuilding: boolean;
  templates: TEtoDocumentTemplates;
  startDate: string;
  documents: TEtoDocumentTemplates;
  maxPledges: number;
  canEnableBookbuilding: boolean;
}


export const apiToStateConversionSpec = {
  minTicketEur:numberToNumericString(),
  maxTicketEur: numberToNumericString(),
  liquidationPreferenceMultiplier:numberToNumericString(),
  equityTokensPerShare: numberToNumericString(),
  shareNominalValueEur: numberToNumericString(),
  preMoneyValuationEur: numberToNumericString(),
  existingCompanyShares: numberToNumericString(),
  authorizedCapitalShares: numberToNumericString(),
  newSharesToIssue: numberToNumericString(),
  minimumNewSharesToIssue: numberToNumericString(),
  newSharesToIssueInWhitelist: numberToNumericString(),
  whitelistDiscountFraction: numberToNumericString(),
  publicDiscountFraction: numberToNumericString(),
  newSharesToIssueInFixedSlots: numberToNumericString(),
  fixedSlotsMaximumDiscountFraction: numberToNumericString(),
  discountScheme: numberToNumericString(),
};

export const stateToBlConversionSpec = {
  minTicketEur:numericStringToBigNumber(),
  maxTicketEur: numericStringToBigNumber(),
  liquidationPreferenceMultiplier:numericStringToBigNumber(),
  equityTokensPerShare: numericStringToBigNumber(),
  shareNominalValueEur: numericStringToBigNumber(),
  preMoneyValuationEur: numericStringToBigNumber(),
  existingCompanyShares: numericStringToBigNumber(),
  authorizedCapitalShares: numericStringToBigNumber(),
  newSharesToIssue: numericStringToBigNumber(),
  minimumNewSharesToIssue: numericStringToBigNumber(),
  newSharesToIssueInWhitelist: numericStringToBigNumber(),
  whitelistDiscountFraction: numericStringToBigNumber(),
  publicDiscountFraction: numericStringToBigNumber(),
  newSharesToIssueInFixedSlots: numericStringToBigNumber(),
  fixedSlotsMaximumDiscountFraction: numericStringToBigNumber(),
  discountScheme: numericStringToBigNumber(),
};
