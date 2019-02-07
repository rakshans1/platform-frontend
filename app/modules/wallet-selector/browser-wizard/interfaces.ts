import {DeepReadonly} from "../../../types";
import {TMessage} from "../../../components/translatedMessages/utils";

export interface IBrowserWalletWizardState {
  errorMsg?: DeepReadonly<TMessage>;
  isLoading: boolean;
  approvalRejected: boolean;
}
