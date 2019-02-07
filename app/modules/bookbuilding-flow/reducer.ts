import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { SET_BOOKBUILDING_FLOW_STATS, SET_PLEDGE } from "./actions";
import { IBookbuildingFLowState } from './interfaces'


export const bookBuildingFlow: IBookbuildingFLowState = {
  bookbuildingStats: {},
  pledges: {},
};

export const bookBuildingFlowReducer: AppReducer<IBookbuildingFLowState> = (
  state = bookBuildingFlow,
  action,
): DeepReadonly<IBookbuildingFLowState> => {
  switch (action.type) {
    case SET_BOOKBUILDING_FLOW_STATS:
      return {
        ...state,
        bookbuildingStats: {
          ...state.bookbuildingStats,
          [action.payload.etoId]: action.payload.stats,
        },
      };
    case SET_PLEDGE:
      return {
        ...state,
        pledges: {
          ...state.pledges,
          [action.payload.etoId]: action.payload.pledge,
        },
      };
  }
  return state;
};
