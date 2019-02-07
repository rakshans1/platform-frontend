export interface IKycState {
  // individual
  individualRequestState?: IKycRequestState;
  individualRequestStateLoading?: boolean;
  individualRequestError?: string;

  individualData?: IKycIndividualData;
  individualDataLoading?: boolean;

  individualFilesLoading?: boolean;
  individualFileUploading?: boolean;
  individualFiles: IKycFileInfo[];

  // business
  businessRequestState?: IKycRequestState;
  businessRequestStateLoading?: boolean;
  businessRequestError?: string;

  businessData?: IKycBusinessData;
  businessDataLoading?: boolean;

  businessFilesLoading?: boolean;
  businessFileUploading?: boolean;
  businessFiles: IKycFileInfo[];

  // legal representatives
  legalRepresentative?: IKycLegalRepresentative;
  legalRepresentativeLoading?: boolean;
  legalRepresentativeFilesLoading?: boolean;
  legalRepresentativeFileUploading?: boolean;
  legalRepresentativeFiles: IKycFileInfo[];

  // beneficial owners
  loadingBeneficialOwners?: boolean;
  loadingBeneficialOwner?: boolean;
  beneficialOwners: IKycBeneficialOwner[];
  beneficialOwnerFilesLoading: { [id: string]: boolean };
  beneficialOwnerFileUploading: { [id: string]: boolean };
  beneficialOwnerFiles: { [id: string]: IKycFileInfo[] };

  // contract claims
  claims: TClaims | undefined;
}

export interface IKycRequestState {
  status: ERequestStatus;
  outsourcedStatus?: ERequestOutsourcedStatus;
  redirectUrl?: string;
}

export interface IKycLegalRepresentative extends IKycPerson {}

export interface IKycPerson {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  birthDate?: string;
  placeOfBirth?: string;
  nationality?: string;
  isPoliticallyExposed?: boolean;
}

export interface IKycIndividualData extends IKycPerson {
  isUsCitizen?: boolean;
  isHighIncome?: boolean;
}

export interface IKycFileInfo {
  id: string;
  fileName: string;
  preview?: string;
}

export interface IKycBusinessData {
  name?: string;
  registrationNumber?: string;
  legalForm?: string;
  legalFormType?: EKycBusinessType;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  jurisdiction?: string;
}

export interface IKycBeneficialOwner extends IKycPerson {
  ownership?: number;
  id?: string;
}

export enum ERequestStatus {
  DRAFT = "Draft",
  PENDING = "Pending",
  OUTSOURCED = "Outsourced",
  REJECTED = "Rejected",
  ACCEPTED = "Accepted",
  IGNORED = "Ignored",
}

export enum ERequestOutsourcedStatus {
  STARTED = "started",
  SUCCESS = "success",
  SUCCESS_DATA_CHANGED = "success_data_changed",
  REVIEW_PENDING = "review_pending",
  ABORTED = "aborted",
  CANCELED = "canceled",
  OTHER = "other",
}

export enum EKycBusinessType {
  CORPORATE = "corporate",
  SMALL = "small",
  PARTNERSHIP = "partnership",
}

export enum EKycRequestType {
  BUSINESS = "business",
  INDIVIDUAL = "individual",
}

export interface IKycRequestState {
  status: ERequestStatus;
  outsourcedStatus?: ERequestOutsourcedStatus;
  redirectUrl?: string;
}

export type TClaims = {
  isVerified: boolean;
  isSophisticatedInvestor: boolean;
  hasBankAccount: boolean;
  isAccountFrozen: boolean;
};
