import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";

export enum EBankTransferFlowState {
  UNINITIALIZED = "uninitialized",
  INIT = "init",
  DETAILS = "details",
  SUMMARY = "summary",
}

export interface IBankTransferState {
  minEuroUlps: string;
  state: EBankTransferFlowState;
  reference: string;
}

export const bankTransferInitialState: IBankTransferState = {
  minEuroUlps: "",
  state: EBankTransferFlowState.UNINITIALIZED,
  reference: "",
};

export const bankTransferFlowReducer: AppReducer<IBankTransferState> = (
  state = bankTransferInitialState,
  action,
): DeepReadonly<IBankTransferState> => {
  switch (action.type) {
    case actions.bankTransferFlow.startBankTransfer.getType():
      return {
        ...state,
        state: EBankTransferFlowState.INIT,
      };

    case actions.bankTransferFlow.continueToDetails.getType():
      return {
        ...state,
        reference: action.payload.reference,
        minEuroUlps: action.payload.minEuroUlps,
        state: EBankTransferFlowState.DETAILS,
      };
    case actions.bankTransferFlow.continueToSummary.getType():
      return {
        ...state,
        state: EBankTransferFlowState.SUMMARY,
      };

    case actions.bankTransferFlow.stopBankTransfer.getType():
      return bankTransferInitialState;
  }

  return state;
};
