import {DeepReadonly} from "../../../types";
import {TMessage} from "../../../components/translatedMessages/utils";

export interface ILightWalletWizardState {
  errorMsg?: DeepReadonly<TMessage>;
  isLoading: boolean;
}
