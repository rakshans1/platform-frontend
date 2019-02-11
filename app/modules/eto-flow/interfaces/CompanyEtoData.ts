import {NumericString} from "../../../types";
import * as etoCapitalListInterfaces from "./EtoCapitalList";
import * as shareholderDataInterfaces from "./ShareholderData";
import * as keyIndividualInterfaces from "./KeyIndividual";
import * as socialChannelInterfaces from "./SocialChannel";
import {numberToNumericString} from "../../../utils/numericStringUtils";
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

  companyVideo: IStateCompanyVideo;
  companySlideshare: IStateCompanySlideshare;
  socialChannels: socialChannelInterfaces.IStateSocialChannel[];
  companyNews: IStateCompanyNews[];
  marketingLinks:IStateMarketingLinks[]
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

  companyVideo: IApiCompanyVideo,
  companySlideshare:IApiCompanySlideshare,
  socialChannels: socialChannelInterfaces.IApiSocialChannel[],
  companyNews: IApiCompanyNews[],
  marketingLinks: IApiMarketingLinks[],
  disableTwitterFeed: boolean,
}



export const apiToStateConversionSpec= {
  lastFundingSizeEur: numberToNumericString(),
  companyShares: numberToNumericString(),
  shareholders: convertInArray(shareholderDataInterfaces.apiToStateConversionSpec),
  useOfCapitalList:convertInArray(etoCapitalListInterfaces.apiToStateConversionSpec),
};



//companyNews
export interface IStateCompanyNews {
  title:string;
  url: string;
  publication: string;
}

export interface IApiCompanyNews {
  title:string;
  url: string;
  publication: string;
}


//marketingLinks
export interface IStateMarketingLinks {
  title: string;
  url: string;
}

export interface IApiMarketingLinks {
  title: string;
  url: string;
}

//companyVideo
export interface IStateCompanyVideo {
  title: string;
  url: string;
}

export interface IApiCompanyVideo {
  title: string;
  url: string;
}

//companySlideshare
export interface IStateCompanySlideshare {
  title:string;
  url: string;
}

export interface IApiCompanySlideshare {
  title:string;
  url: string;
}

