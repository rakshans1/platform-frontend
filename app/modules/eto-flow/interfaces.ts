import {EEtoState} from "../../lib/api/eto/EtoApi.interfaces";
import {TEtoDocumentTemplates} from "../eto-documents/interfaces";
import {NumericString} from "../../types";

export interface IEtoFlowState {
  etoPreviewCode?: string;
  loading: boolean;
  saving: boolean;
  bookbuildingStats: IBookbuildingStatsState[];
  newStartDate?: Date; //todo no Dates in state
}

export interface IBookbuildingStatsState {
  amountEur: NumericString;
  consentToRevealEmail: boolean;
  currency: string;
  email?: string;
  etoId?: string;
  insertedAt: string;
  updatedAt: string;
  userId: string;
}

export type TGeneralEtoData = {
  etoData: TPublicEtoDataState;
  companyData: TCompanyEtoDataState;
};

export type TCompanyEtoDataState =
  IEtoCompanyBaseState &
  IEtoCompanyInformationState &
  IEtoLegalDataState &
  IEtoPitchState &
  IEtoRiskAssessmentState &
  IEtoKeyIndividualsState &
  IEtoMediaState

export type TPublicEtoDataState =
  IEtoTermsState &
  IEtoEquityTokenInfoState &
  IEtoVotingRightsState &
  IEtoInvestmentTermsState &
  IAdditionalEtoState

export interface IEtoTermsState {
  currencies: string[];//fixme should be an enum?
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
}

export interface IEtoEquityTokenInfoState {
  equityTokenName: string;
  equityTokenSymbol: string;
  equityTokenImage: string;
}

export interface IEtoVotingRightsState {
  nominee: string;
  liquidationPreferenceMultiplier: string;
  generalVotingRule: string;
}

export interface IEtoInvestmentTermsState {
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
}

export interface IAdditionalEtoState {
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

//company interfaces
export interface IEtoCompanyBaseState {
  companyId: string;
}

export interface IEtoCompanyInformationState {
  brandName: string;
  companyWebsite: string;
  companyOneliner: string;
  companyDescription: string;
  keyQuoteFounder: string;
  keyQuoteInvestor: string;
  categories: string;
  companyLogo: string;
  companyBanner: string;
}

export interface IShareholderData {
  fullName: string;
  shares: number;
}

export interface IEtoLegalDataState {
  name: string;
  legalForm: string;
  street: string;
  country: string;
  vatNumber: string;
  registrationNumber: string;
  foundingDate: string;
  numberOfEmployees: number;
  companyStage: string;
  numberOfFounders: number;
  lastFundingSizeEur: number;
  companyShares: number;
  shareholders: IShareholderData[]
}

export interface IEtoCapitalListState {
  description: string;
  percent: number;
}

export interface IEtoPitchState {
  problemSolved: string;
  productVision: string;
  inspiration: string;
  roadmap: string;
  useOfCapital: string;
  useOfCapitalList: IEtoCapitalListState[]
  customerGroup: string;
  sellingProposition: string;
  marketingApproach: string;
  companyMission: string;
  targetMarketAndIndustry: string;
  keyBenefitsForInvestors: string;
  keyCompetitors: string;
  marketTraction: string;
  businessModel: string;
}

export interface IEtoRiskAssessmentState {
  riskNotRegulatedBusiness: boolean;
  riskNoThirdPartyDependency: boolean;
  riskNoLoansExist: boolean;
  riskLiquidityDescription: string;
  riskThirdPartyDescription: string;
  riskThirdPartySharesFinancing: string;
  riskBusinessModelDescription: string;
  riskMaxDescription: string;
}

export interface ISocialChannelState {
  type: string;
  url: string;
}

export interface ICompanyNewsState {
  title:string;
  url: string;
  publication: string;
}

export interface IMarketingLinksState {
  title: string;
  url: string;
}

export interface ICompanyVideoState {
  title: string;
  url: string;
}

export interface ICompanySlideshareState {
  title:string;
  url: string;
}

export interface IEtoKeyIndividualState {
  name: string;
  role: string;
  image: string;
  description: string;
  website: string;
  socialChannels: ISocialChannelState[]
}

export interface IEtoKeyIndividualsState {
  team: IEtoKeyIndividualState[];
  advisors: IEtoKeyIndividualState[];
  boardMembers: IEtoKeyIndividualState[];
  notableInvestors: IEtoKeyIndividualState[];
  keyCustomers: IEtoKeyIndividualState[];
  partners: IEtoKeyIndividualState[];
  keyAlliances: IEtoKeyIndividualState[];
}

export interface IEtoMediaState {
  companyVideo: ICompanyVideoState;
  companySlideshare: ICompanySlideshareState;
  socialChannels: ISocialChannelState[];
  companyNews: ICompanyNewsState[];
  marketingLinks:IMarketingLinksState[]
  disableTwitterFeed: boolean;
}

export enum EEtoFormTypes {
  CompanyInformation = "companyInformation",
  LegalInformation = "legalInformation",
  KeyIndividuals = "keyIndividuals",
  ProductVision = "productVision",
  EtoTerms = "etoTerms",
  EtoInvestmentTerms = "etoInvestmentTerms",
  EtoMedia = "etoMedia",
  EtoVotingRights = "etoVotingRights",
  EtoEquityTokenInfo = "etoEquityTokenInfo",
  EtoRiskAssessment = "etoRiskAssessment",
}
