import { ITxData } from "../../../lib/web3/types";
import { AppReducer } from "../../../store";
import { ETxSenderType } from "../interfaces";

export enum ETransactionErrorType {
  NOT_ENOUGH_ETHER_FOR_GAS = "not_enough_ether_for_gas",
  FAILED_TO_GENERATE_TX = "failed_to_generate_tx",
  GAS_TOO_LOW = "gas_too_low",
  TOO_MANY_TX_IN_QUEUE = "too_many_tx_in_queue",
  INVALID_RLP_TX = "invalid_rlp_tx",
  INVALID_CHAIN_ID = "invalid_chain_id",
  TX_WAS_REJECTED = "tx_was_rejected",
  NOT_ENOUGH_FUNDS = "not_enough_funds",
  ERROR_WHILE_WATCHING_TX = "error_while_watching_tx",
  OUT_OF_GAS = "out_of_gas",
  REVERTED_TX = "reverted_tx",
  NONCE_TOO_LOW = "nonce_too_low",
  LEDGER_CONTRACTS_DISABLED = "ledger_contracts_disabled",
  UNKNOWN_ERROR = "unknown_error",
}

export enum EValidationState {
  NOT_ENOUGH_ETHER_FOR_GAS = "not_enough_ether_for_gas",
  VALIDATION_OK = "validation_ok",
}

export enum ETxSenderState {
  UNINITIALIZED = "UNINITIALIZED",
  WATCHING_PENDING_TXS = "WATCHING_PENDING_TXS",
  INIT = "INIT",
  SUMMARY = "SUMMARY",
  ACCESSING_WALLET = "ACCESSING_WALLET",
  SIGNING = "SIGNING",
  MINING = "MINING",
  DONE = "DONE",
  ERROR_SIGN = "ERROR_SIGN",
}

export type TSummaryData = { txData: Partial<ITxData>; additionalData?: any };
export interface ITxSenderState {
  state: ETxSenderState;
  type?: ETxSenderType;
  txDetails?: ITxData;
  summaryData?: TSummaryData;
  blockId?: number;
  txHash?: string;
  error?: ETransactionErrorType;
  validationState?: EValidationState;
}

const initialState: ITxSenderState = {
  state: ETxSenderState.UNINITIALIZED,
};

export const txSenderReducer: AppReducer<ITxSenderState> = (
  state = initialState,
  action,
): ITxSenderState => {
  switch (action.type) {
    // Modal related Actions
    case "TX_SENDER_SHOW_MODAL":
    case "TX_SENDER_HIDE_MODAL":
      return {
        ...initialState,
      };

    //Pending Transaction Actions
    case "TX_SENDER_WATCH_PENDING_TXS":
      return {
        ...initialState,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        txHash: action.payload.txHash,
      };

    case "TX_SENDER_WATCH_PENDING_TXS_DONE":
      return {
        ...initialState,
        state: ETxSenderState.INIT,
        type: action.payload.type,
      };
    case "TX_SENDER_ACCEPT":
      return {
        ...state,
        state: ETxSenderState.ACCESSING_WALLET,
      };
    case "TX_SENDER_SET_TRANSACTION_DATA":
      return {
        ...state,
        txDetails: action.payload.txData,
      };
    case "TX_SENDER_WALLET_PLUGGED":
      return {
        ...state,
        state: ETxSenderState.SIGNING,
      };
    case "TX_SENDER_SIGNED":
      return {
        ...state,
        state: ETxSenderState.MINING,
        txHash: action.payload.txHash,
        type: action.payload.type,
      };

    case "TX_SENDER_REPORT_BLOCK":
      return {
        ...state,
        blockId: action.payload,
      };

    case "TX_SENDER_TX_MINED":
      return {
        ...state,
        state: ETxSenderState.DONE,
      };

    case "TX_SENDER_ERROR":
      return {
        ...initialState,
        state: ETxSenderState.ERROR_SIGN,
        error: action.payload.error,
      };
    case "TX_SENDER_SET_VALIDATION_STATE":
      return {
        ...state,
        ...action.payload,
      };
    case "TX_SENDER_VALIDATE_DRAFT":
      return {
        ...state,
        validationState: undefined,
      };
    case "TX_SENDER_CONTINUE_TO_SUMMARY_WITH_DATA":
      return {
        ...state,
        state: ETxSenderState.SUMMARY,
        summaryData: action.payload.summaryData,
      };
    //Change Actions
    case "TX_SENDER_CHANGE":
      return {
        ...state,
        state: ETxSenderState.INIT,
        type: action.payload.type,
      };
  }

  return state;
};
