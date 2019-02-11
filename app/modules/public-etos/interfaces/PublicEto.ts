import {IBlPublicEtoData, IStatePublicEtoData} from "../../eto-flow/interfaces/PublicEtoData";
import {IBlCompanyEtoData, IStateCompanyEtoData} from "../../eto-flow/interfaces/CompanyEtoData";
import {IBlEtoContractData, IStateEtoContractData} from "./EtoContractData";
import {IBlEtoTokenData, IStateEtoTokenData} from "./EtoTokenData";

export interface IStatePublicEto {
  publicEtos: { [previewCode: string]: IStatePublicEtoData | undefined };
  companies: { [companyId: string]: IStateCompanyEtoData | undefined };
  contracts: { [previewCode: string]: IStateEtoContractData };
  displayOrder: string[] | undefined;
  maxCapExceeded: { [previewCode: string]: boolean | undefined };
  etoWidgetError: boolean | undefined;
  tokenData: { [previewCode: string]: IStateEtoTokenData | undefined };
}

export interface IBlPublicEto {
  publicEtos: { [previewCode: string]: IBlPublicEtoData | undefined };
  companies: { [companyId: string]: IBlCompanyEtoData | undefined };
  contracts: { [previewCode: string]: IBlEtoContractData };
  displayOrder: string[] | undefined;
  maxCapExceeded: { [previewCode: string]: boolean | undefined };
  etoWidgetError: boolean | undefined;
  tokenData: { [previewCode: string]: IBlEtoTokenData | undefined };
}

export const stateToBlConversionSpec = { //TODO
  publicEtos: { [previewCode: string]: IStatePublicEtoData | undefined },
  companies: { [companyId: string]: IStateCompanyEtoData | undefined },
  contracts: { [previewCode: string]: IStateEtoContractData },
  tokenData: { [previewCode: string]: IStateEtoTokenData | undefined }
}
