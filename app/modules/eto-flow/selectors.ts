import {
  EEtoState,
} from "../../lib/api/eto/EtoApi.interfaces";
import { TEtoDocumentTemplates } from "../../lib/api/eto/EtoFileApi.interfaces";
import { ERequestStatus } from "../../lib/api/KycApi.interfaces";
import { IAppState } from "../../store";
import { selectIsUserEmailVerified } from "../auth/selectors";
import { selectPlatformTermsConstants } from "../contracts/selectors";
import { selectEtoDocumentLoading } from "../eto-documents/selectors";
import { selectKycRequestStatus } from "../kyc/selectors";
import { selectEtoWithCompanyAndContract, selectPublicEto } from "../public-etos/selectors";
import {EETOStateOnChain} from "../public-etos/interfaces/interfaces";
import { isValidEtoStartDate } from "./utils";
import {DeepPartial, DeepReadonly} from "../../types";
import {IStateCompanyEtoData} from "./interfaces/CompanyEtoData";
import {TStateEtoWithCompanyAndContract} from "../public-etos/interfaces/interfaces";
import {IStatePublicEtoData} from "./interfaces/PublicEtoData";

export const selectIssuerEtoPreviewCode = (state: IAppState):string | undefined => state.etoFlow.etoPreviewCode;

export const selectIssuerEto = (state: IAppState): DeepReadonly<IStatePublicEtoData> | undefined => {
  const issuerEtoPreviewCode = selectIssuerEtoPreviewCode(state);

  if (issuerEtoPreviewCode) {
    return selectPublicEto(state, issuerEtoPreviewCode);
  }

  return undefined;
};

export const selectIssuerEtoWithCompanyAndContract = (state: IAppState):TStateEtoWithCompanyAndContract | undefined => {
  const issuerEtoPreviewCode = selectIssuerEtoPreviewCode(state);

  if (issuerEtoPreviewCode) {
    return selectEtoWithCompanyAndContract(state, issuerEtoPreviewCode);
  }

  return undefined;
};

export const selectIsBookBuilding = (state: IAppState): boolean => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.isBookbuilding;
  }

  return false;
};

export const selectMaxPledges = (state: IAppState):number|null => {
  const eto = selectIssuerEto(state);

  return eto !== undefined ? eto.maxPledges : null;
};

export const selectEtoId = (state: IAppState):string | undefined => {
  const eto = selectIssuerEto(state);
  if (eto) {
    return eto.etoId;
  }
  return undefined;
};

export const selectCanEnableBookBuilding = (state: IAppState): boolean => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.canEnableBookbuilding;
  }

  return false;
};

export const selectIssuerEtoState = (state: IAppState): EEtoState | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.state;
  }

  return undefined;
};

export const selectIssuerEtoIsRetail = (state: IAppState): boolean => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.allowRetailInvestors;
  }

  return false;
};

export const selectIssuerCompany = (state: IAppState): DeepReadonly<IStateCompanyEtoData> | undefined => {
  const eto = selectIssuerEtoWithCompanyAndContract(state);

  if (eto) {
    return eto.company;
  }

  return undefined;
};

export const selectIssuerEtoLoading = (state: IAppState): boolean => state.etoFlow.loading;

export const selectCombinedEtoCompanyData = (
  state: IAppState,
): DeepPartial<DeepReadonly<IStatePublicEtoData> & DeepReadonly<IStateCompanyEtoData>> => ({
  ...selectIssuerCompany(state),
  ...selectIssuerEto(state),
});

export const selectIssuerEtoTemplates = (state: IAppState): TEtoDocumentTemplates | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.templates;
  }

  return undefined;
};

export const selectIssuerEtoDocuments = (state: IAppState): TEtoDocumentTemplates | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.documents;
  }

  return undefined;
};

export const selectIsTermSheetSubmitted = (state: IAppState): boolean | undefined => {
  const documents = selectIssuerEtoDocuments(state);

  if (documents) {
    return Object.keys(documents).some(key => documents[key].documentType === "signed_termsheet");
  }
  return undefined;
};

export const selectIsOfferingDocumentSubmitted = (state: IAppState): boolean | undefined => {
  const documents = selectIssuerEtoDocuments(state);

  if (documents) {
    return Object.keys(documents).some(
      key => documents[key].documentType === "approved_investor_offering_document",
    );
  }
  return undefined;
};

export const selectShouldEtoDataLoad = (state: IAppState):boolean =>
  selectKycRequestStatus(state) === ERequestStatus.ACCEPTED &&
  selectIsUserEmailVerified(state.auth);

export const selectIsGeneralEtoLoading = (state: IAppState):boolean =>
  selectIssuerEtoLoading(state) && selectEtoDocumentLoading(state.etoDocuments);

export const selectNewPreEtoStartDate = (state: IAppState):Date | undefined => state.etoFlow.newStartDate;

export const selectPreEtoStartDateFromContract = (state: IAppState):Date | undefined => {
  const code = selectIssuerEtoPreviewCode(state);
  if (code) {
    const eto = selectEtoWithCompanyAndContract(state, code);
    return eto && eto.contract && eto.contract.startOfStates[EETOStateOnChain.Whitelist];
  }
};

export const selectPreEtoStartDate = (state: IAppState): Date | undefined =>
  selectNewPreEtoStartDate(state) || selectPreEtoStartDateFromContract(state);

export const selectCanChangePreEtoStartDate = (state: IAppState):boolean => {
  const constants = selectPlatformTermsConstants(state);
  const date = selectPreEtoStartDateFromContract(state);
  return !date || isValidEtoStartDate(date, constants.DATE_TO_WHITELIST_MIN_DURATION);
};

export const selectIsNewPreEtoStartDateValid = (state: IAppState):boolean => {
  const constants = selectPlatformTermsConstants(state);
  const date = selectNewPreEtoStartDate(state);
  return !!date && isValidEtoStartDate(date, constants.DATE_TO_WHITELIST_MIN_DURATION);
};
