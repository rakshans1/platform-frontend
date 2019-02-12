import {DeepReadonly} from "../../types";
import {TMessage} from "../../components/translatedMessages/utils";

export interface IStateSignMessageModal {
  isModalOpen: boolean;
  errorMessage?: DeepReadonly<TMessage>;
  modalTitle?: DeepReadonly<TMessage>;
  modalMessage?: DeepReadonly<TMessage>;
}
