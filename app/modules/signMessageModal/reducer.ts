import { AppReducer } from "../../store";

export interface ISignMessageModalState {
  isOpen: boolean;
  errorMsg?: string;
}

const initialState: ISignMessageModalState = {
  isOpen: false,
};

export const signMessageModalReducer: AppReducer<ISignMessageModalState> = (
  state = initialState,
  action,
): ISignMessageModalState => {
  switch (action.type) {
    case "SIGN_MESSAGE_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        errorMsg: undefined,
      };
    case "SIGN_MESSAGE_MODAL_HIDE":
      return {
        ...state,
        isOpen: false,
      };
    case "SIGN_MESSAGE_MODAL_SHOW_ERROR":
      return {
        ...state,
        errorMsg: action.payload.errorMsg,
      };
    case "SIGN_MESSAGE_ACCEPT":
      return {
        ...state,
        errorMsg: undefined,
      };
  }

  return state;
};

export const selectIsSigning = (state: ISignMessageModalState): boolean => state.isOpen;
