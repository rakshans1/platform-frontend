import { IAppState } from "../../store";
import * as platformTermsConstantsInterfaces from "./interfaces";
import {convert} from "../../components/eto/utils";

export const selectPlatformTermsConstants = (state: IAppState):platformTermsConstantsInterfaces.IBlPlatformTermsConstants =>
  convert(state.contracts.platformTermsConstants, platformTermsConstantsInterfaces.stateToBlConversionSpec);
