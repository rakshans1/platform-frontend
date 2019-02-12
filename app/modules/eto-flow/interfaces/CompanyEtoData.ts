import BigNumber from "bignumber.js";

import {NumericString} from "../../../types";
import * as etoCapitalListInterfaces from "./EtoCapitalList";
import * as shareholderDataInterfaces from "./ShareholderData";
import * as keyIndividualInterfaces from "./KeyIndividual";
import * as companySlideshareInterfaces from './CompanySlideshare'
import * as socialChannelInterfaces from "./SocialChannel";
import * as companyVideoInterfaces from "./CompanyVideo";
import * as companyNewsInterfaces from "./CompanyNews";
import * as companyMarketingLinks from "./CompanyMarketingLinks";
import {
  bigNumberToNumber,
  numberToNumericString,
  numericStringToBigNumber,
  numericStringToNumber
} from "../../../utils/numericStringUtils";
import {convertInArray} from "../../../components/eto/utils";

export interface IStateCompanyEtoData {
  companyId: string;

  brandName: string;
  companyWebsite: string;
  companyOneliner: string;
  companyDescription: string;
  keyQuoteFounder: string;
  keyQuoteInvestor: string;
  categories: string; //fixme ??
  companyLogo: string;
  companyBanner: string;

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
  lastFundingSizeEur: NumericString;
  companyShares: NumericString;
  shareholders: shareholderDataInterfaces.IStateShareholderData[]

  problemSolved: string;
  productVision: string;
  inspiration: string;
  roadmap: string;
  useOfCapital: string;
  useOfCapitalList: etoCapitalListInterfaces.IStateEtoCapitalList[]
  customerGroup: string;
  sellingProposition: string;
  marketingApproach: string;
  companyMission: string;
  targetMarketAndIndustry: string;
  keyBenefitsForInvestors: string;
  keyCompetitors: string;
  marketTraction: string;
  businessModel: string;

  riskNotRegulatedBusiness: boolean;
  riskNoThirdPartyDependency: boolean;
  riskNoLoansExist: boolean;
  riskLiquidityDescription: string;
  riskThirdPartyDescription: string;
  riskThirdPartySharesFinancing: string;
  riskBusinessModelDescription: string;
  riskMaxDescription: string;

  team: keyIndividualInterfaces.IStateKeyIndividual[];
  advisors: keyIndividualInterfaces.IStateKeyIndividual[];
  boardMembers: keyIndividualInterfaces.IStateKeyIndividual[];
  notableInvestors: keyIndividualInterfaces.IStateKeyIndividual[];
  keyCustomers: keyIndividualInterfaces.IStateKeyIndividual[];
  partners: keyIndividualInterfaces.IStateKeyIndividual[];
  keyAlliances: keyIndividualInterfaces.IStateKeyIndividual[];

  companyVideo: companyVideoInterfaces.IStateCompanyVideo;
  companySlideshare: companySlideshareInterfaces.IStateCompanySlideshare;
  socialChannels: socialChannelInterfaces.IStateSocialChannel[];
  companyNews: companyNewsInterfaces.IStateCompanyNews[];
  marketingLinks:companyMarketingLinks.IStateMarketingLinks[]
  disableTwitterFeed: boolean;
}

export interface IApiCompanyEtoData {
  companyId: string;

  brandName: string,
  companyWebsite: string,
  companyOneliner: string,
  companyDescription: string,
  keyQuoteFounder: string,
  keyQuoteInvestor: string,
  categories: string[],
  companyLogo: string,
  companyBanner: string,
  name: string,
  legalForm: string,
  street: string,
  country: string,
  vatNumber: string,
  registrationNumber: string,
  foundingDate: string, //utc date

  numberOfEmployees: string,
  companyStage: string,
  numberOfFounders: number,
  lastFundingSizeEur: number,
  companyShares: number,
  shareholders: shareholderDataInterfaces.IApiShareholderData[],

  problemSolved: string,
  productVision: string,
  inspiration: string,
  roadmap: string,
  useOfCapital: string,
  useOfCapitalList: etoCapitalListInterfaces.IApiEtoCapitalList[],
  customerGroup: string,
  sellingProposition: string,
  marketingApproach: string,
  companyMission: string,
  targetMarketAndIndustry: string,
  keyBenefitsForInvestors: string,
  keyCompetitors: string,
  marketTraction: string,
  businessModel: string,

  riskNotRegulatedBusiness: boolean,
  riskNoThirdPartyDependency: boolean,
  riskNoLoansExist: boolean,
  riskLiquidityDescription: string,
  riskThirdPartyDescription: string,
  riskThirdPartySharesFinancing: string,
  riskBusinessModelDescription: string,
  riskMaxDescription: string,

  team: keyIndividualInterfaces.IApiKeyIndividual[],
  advisors: keyIndividualInterfaces.IApiKeyIndividual[],
  boardMembers: keyIndividualInterfaces.IApiKeyIndividual[],
  notableInvestors: keyIndividualInterfaces.IApiKeyIndividual[],
  keyCustomers: keyIndividualInterfaces.IApiKeyIndividual[],
  partners: keyIndividualInterfaces.IApiKeyIndividual[],
  keyAlliances: keyIndividualInterfaces.IApiKeyIndividual[],

  companyVideo: companyVideoInterfaces.IApiCompanyVideo,
  companySlideshare:companySlideshareInterfaces.IApiCompanySlideshare,
  socialChannels: socialChannelInterfaces.IApiSocialChannel[],
  companyNews: companyNewsInterfaces.IApiCompanyNews[],
  marketingLinks: companyMarketingLinks.IApiMarketingLinks[],
  disableTwitterFeed: boolean,
}

export interface IBlCompanyEtoData {
  companyId: string;

  brandName: string;
  companyWebsite: string;
  companyOneliner: string;
  companyDescription: string;
  keyQuoteFounder: string;
  keyQuoteInvestor: string;
  categories: string; //fixme ??
  companyLogo: string;
  companyBanner: string;

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
  lastFundingSizeEur: BigNumber;
  companyShares: BigNumber;
  shareholders: shareholderDataInterfaces.IBlShareholderData[]

  problemSolved: string;
  productVision: string;
  inspiration: string;
  roadmap: string;
  useOfCapital: string;
  useOfCapitalList: etoCapitalListInterfaces.IBlEtoCapitalList[]
  customerGroup: string;
  sellingProposition: string;
  marketingApproach: string;
  companyMission: string;
  targetMarketAndIndustry: string;
  keyBenefitsForInvestors: string;
  keyCompetitors: string;
  marketTraction: string;
  businessModel: string;

  riskNotRegulatedBusiness: boolean;
  riskNoThirdPartyDependency: boolean;
  riskNoLoansExist: boolean;
  riskLiquidityDescription: string;
  riskThirdPartyDescription: string;
  riskThirdPartySharesFinancing: string;
  riskBusinessModelDescription: string;
  riskMaxDescription: string;

  team: keyIndividualInterfaces.IBlKeyIndividual[];
  advisors: keyIndividualInterfaces.IBlKeyIndividual[];
  boardMembers: keyIndividualInterfaces.IBlKeyIndividual[];
  notableInvestors: keyIndividualInterfaces.IBlKeyIndividual[];
  keyCustomers: keyIndividualInterfaces.IBlKeyIndividual[];
  partners: keyIndividualInterfaces.IBlKeyIndividual[];
  keyAlliances: keyIndividualInterfaces.IBlKeyIndividual[];

  companyVideo: companyVideoInterfaces.IBlCompanyVideo;
  companySlideshare: companySlideshareInterfaces.IBlCompanySlideshare;
  socialChannels: socialChannelInterfaces.IBlSocialChannel[];
  companyNews: companyNewsInterfaces.IBlCompanyNews[];
  marketingLinks:companyMarketingLinks.IBlMarketingLinks[]
  disableTwitterFeed: boolean;
}

export const apiToStateConversionSpec= {
  lastFundingSizeEur: numberToNumericString(),
  companyShares: numberToNumericString(),
  shareholders: convertInArray(shareholderDataInterfaces.apiToStateConversionSpec),
  useOfCapitalList:convertInArray(etoCapitalListInterfaces.apiToStateConversionSpec),
};

export const stateToBlConversionSpec= {
  lastFundingSizeEur: numericStringToBigNumber(),
  companyShares: numericStringToBigNumber(),
  shareholders: convertInArray(shareholderDataInterfaces.stateToBlConversionSpec),
  useOfCapitalList:convertInArray(etoCapitalListInterfaces.stateToBlConversionSpec),
};

export const blToApiConversionSpec = {
  lastFundingSizeEur: bigNumberToNumber(),
  companyShares: bigNumberToNumber(),
  shareholders: convertInArray(shareholderDataInterfaces.blToApiConversionSpec),
  useOfCapitalList:convertInArray(etoCapitalListInterfaces.blToApiConversionSpec),
};

export const stateToApiConversionSpec = {
  lastFundingSizeEur: numericStringToNumber(),
  companyShares: numericStringToNumber(),
  shareholders: convertInArray(shareholderDataInterfaces.stateToApiConversionSpec),
  useOfCapitalList:convertInArray(etoCapitalListInterfaces.stateToApiConversionSpec),
};


