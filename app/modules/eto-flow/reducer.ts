import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IEtoFlowState {
  etoPreviewCode?: string;
  loading: boolean;
  saving: boolean;
}

export const etoFlowInitialState: IEtoFlowState = {
  etoPreviewCode: undefined,
  loading: false,
  saving: false,
};

export const etoFlowReducer: AppReducer<IEtoFlowState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IEtoFlowState> => {
  switch (action.type) {
    case "ETO_FLOW_LOAD_ISSUER_ETO":
      return {
        ...state,
        loading: true,
      };
    case "ETO_FLOW_SET_ID":
      return {
        ...state,
        etoPreviewCode: action.payload.etoPreviewCode,
        loading: false,
        saving: false,
      };

    case "ETO_FLOW_SAVE_DATA_START":
    case "ETO_FLOW_SUBMIT_DATA_START":
      return {
        ...state,
        saving: true,
      };
  }
  return state;
};
