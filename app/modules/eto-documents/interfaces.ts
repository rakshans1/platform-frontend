import {EtoStateToCamelcase} from "../../lib/api/eto/EtoApi.interfaces";

export interface IEtoDocumentsState {
  loading: boolean;
  saving: boolean;
  showIpfsModal: boolean;
  etoFileData: IEtoFilesState;
  uploadAction?: () => void; //fixme no functions in state!!
}

export interface IEtoFilesState {
  allTemplates: TEtoDocumentTemplates;
  stateInfo?: TStateInfo;
}

export type TStateInfo = { [key in TSimpleFileInfo]: EEtoDocumentType[] } &
  { [key in TComplextFileInfo]: { [key in EtoStateToCamelcase]: EEtoDocumentType[] } };

export interface IEtoFiles {
  allTemplates: TEtoDocumentTemplates;
  stateInfo?: TStateInfo;
}

type TComplextFileInfo = "canDeleteInStates" | "canUploadInStates"; //todo enum

type TSimpleFileInfo = "requiredTemplates" | "uploadableDocuments"; //todo enum

export type TEtoFormType = "document" | "template"; //todo enum

export type TEtoDocumentTemplates = { [key: string]: IEtoDocument };

export enum EEtoDocumentType {
  COMPANY_TOKEN_HOLDER_AGREEMENT = "company_token_holder_agreement",
  RESERVATION_AND_ACQUISITION_AGREEMENT = "reservation_and_acquisition_agreement",
  INVESTMENT_AND_SHAREHOLDER_AGREEMENT_TEMPLATE = "investment_and_shareholder_agreement_template",
  PROSPECTUS_TEMPLATE = "prospectus_template",
  PAMPHLET_TEMPLATE = "pamphlet_template",
  TERMSHEET_TEMPLATE = "termsheet_template",
  INVESTMENT_MEMORANDUM_TEMPLATE = "investment_memorandum_template",
  // in documents collection
  SIGNED_TERMSHEET = "signed_termsheet",
  APPROVED_INVESTOR_OFFERING_DOCUMENT = "approved_investor_offering_document",
  INVESTMENT_AND_SHAREHOLDER_AGREEMENT = "investment_and_shareholder_agreement",
  SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT = "signed_investment_and_shareholder_agreement",
}

export enum EEtoDocumentLanguage {
  EN = "en",
  DE = "de",
}

export interface IEtoDocument {
  documentType: EEtoDocumentType;
  form: TEtoFormType;
  ipfsHash: string;
  mimeType: string;
  name: string;
  placeholders?: { [key: string]: string };
  language?: EEtoDocumentLanguage;
  asPdf?: boolean;
}

