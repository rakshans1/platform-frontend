import {IEtoDocument, EEtoDocumentType} from '../eto-documents/interfaces'
import { Dictionary } from "../../types";
import { createActionFactory } from "../actionsUtils";
import { IEtoContractData, IEtoTokenStateData } from "./interfaces";
import {TCompanyEtoDataState, TPublicEtoDataState} from "../eto-flow/interfaces";

export const etoActions = {
  // public actions
  loadEtoPreview: createActionFactory(
    "PUBLIC_ETOS_LOAD_ETO_PREVIEW",
    (previewCode: string, widgetView?: boolean) => ({
      previewCode,
      widgetView,
    }),
  ),
  loadEto: createActionFactory("PUBLIC_ETOS_LOAD_ETO", (etoId: string, widgetView?: boolean) => ({
    etoId,
    widgetView,
  })),
  loadEtos: createActionFactory("PUBLIC_ETOS_LOAD_ETOS"),
  downloadPublicEtoDocument: createActionFactory(
    "PUBLIC_ETOS_DOWNLOAD_DOCUMENT",
    (document: IEtoDocument) => ({ document }),
  ),
  downloadPublicEtoTemplateByType: createActionFactory(
    "PUBLIC_ETOS_DOWNLOAD_TEMPLATE_BY_TYPE",
    (etoId: string, documentType: EEtoDocumentType) => ({ etoId, documentType }),
  ),
  loadTokensData: createActionFactory("PORTFOLIO_LOAD_TOKENS_DATA", (walletAddress: string) => ({
    walletAddress,
  })),
  setTokenData: createActionFactory(
    "PORTFOLIO_SET_TOKEN_DATA",
    (previewCode: string, tokenData: IEtoTokenStateData) => ({
      previewCode,
      tokenData,
    }),
  ),
  // state mutations
  setPublicEtos: createActionFactory(
    "PUBLIC_ETOS_SET_PUBLIC_ETOS",
    ({
      etos,
      companies,
    }: {
      etos: Dictionary<TPublicEtoDataState>;
      companies: Dictionary<TCompanyEtoDataState>;
    }) => ({ etos, companies }),
  ),
  setPublicEto: createActionFactory(
    "PUBLIC_ETOS_SET_PUBLIC_ETO",
    ({ eto, company }: { eto: TPublicEtoDataState; company: TCompanyEtoDataState }) => ({ eto, company }),
  ),
  setEtosDisplayOrder: createActionFactory("PUBLIC_ETOS_SET_DISPLAY_ORDER", (order: string[]) => ({
    order,
  })),
  setEtoDataFromContract: createActionFactory(
    "PUBLIC_ETOS_SET_ETO_DATA_FROM_CONTRACT",
    (previewCode: string, data: IEtoContractData) => ({ previewCode, data }),
  ),
  setEtoWidgetError: createActionFactory("PUBLIC_ETOS_SET_ETO_WIDGET_ERROR"),
};
