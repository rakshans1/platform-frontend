import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import {IGenericModalState, IGenericModalObjectState} from './interfaces'

const initialState: IGenericModalState = {
  isOpen: false,
};

export const genericModalReducer: AppReducer<IGenericModalState> = (
  state = initialState,
  action,
): DeepReadonly<IGenericModalState> => {
  switch (action.type) {
    case "GENERIC_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        genericModalObj: action.payload,
      };
    case "MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        component: action.payload.component,
      };
    case "GENERIC_MODAL_HIDE":
      return initialState;
  }

  return state;
};

