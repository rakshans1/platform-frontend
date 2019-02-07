import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import {IVideoModalState, IVideoModalDataState} from './interfaces'

const initialState: IVideoModalState = {
  isOpen: false,
};

export const videoModalReducer: AppReducer<IVideoModalState> = (
  state = initialState,
  action,
): DeepReadonly<IVideoModalState> => {
  switch (action.type) {
    case "VIDEO_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        videoModalObj: action.payload,
      };
    case "VIDEO_MODAL_HIDE":
      return {
        ...state,
        videoModalObj: undefined,
        isOpen: false,
      };
  }

  return state;
};

export const selectVideoModalIsOpen = (state: IVideoModalState): boolean => state.isOpen;
export const selectVideoModalObj = (state: IVideoModalState): IVideoModalDataState | undefined =>
  state.videoModalObj;
