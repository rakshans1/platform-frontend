import {NumericString} from "../../../types";
import {IStatePublicEtoData} from './PublicEtoData';
import {IStateCompanyEtoData} from "./CompanyEtoData";

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
  etoData: IStatePublicEtoData;
  companyData: IStateCompanyEtoData;
};







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
