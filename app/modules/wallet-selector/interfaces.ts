import {DeepReadonly} from "../../types";
import {TMessage} from "../../components/translatedMessages/utils";

export interface IWalletSelectorState {
  isMessageSigning: boolean;
  messageSigningError?: DeepReadonly<TMessage>;
}
