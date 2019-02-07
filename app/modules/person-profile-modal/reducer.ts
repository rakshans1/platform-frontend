import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import {IPersonProfileModalState, IPersonProfileModal} from './interfaces'


const initialState: IPersonProfileModalState = {
  isOpen: false,
};

export const personProfileModalReducer: AppReducer<IPersonProfileModalState> = (
  state = initialState,
  action,
): DeepReadonly<IPersonProfileModalState> => {
  switch (action.type) {
    case "PERSON_PROFILE_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        personProfileModalObj: action.payload,
      };
    case "PERSON_PROFILE_MODAL_HIDE":
      return {
        ...state,
        personProfileModalObj: undefined,
        isOpen: false,
      };
  }

  return state;
};

export const selectIsOpen = (state: DeepReadonly<IPersonProfileModalState>): boolean =>
  state.isOpen;
export const selectPersonProfileModalObj = (
  state: DeepReadonly<IPersonProfileModalState>,
): DeepReadonly<IPersonProfileModal> | undefined => state.personProfileModalObj;
