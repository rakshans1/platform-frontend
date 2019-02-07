import {
  EEtoDocumentLanguage,
  EEtoDocumentType
} from "../../lib/api/eto/EtoFileApi.interfaces";
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

