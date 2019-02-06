import { IAppState } from "../../../store";
import { ETxSenderState, EValidationState } from "./reducer";
import BigNumber from "bignumber.js";
import {ITxData} from "../../../lib/web3/types";
import {ETxSenderType} from "../interfaces";

export const selectTxSenderModalOpened = (state: IAppState) =>
  state.txSender.state !== ETxSenderState.UNINITIALIZED;

export const selectTxDetails = (state: IAppState):ITxData | undefined => state.txSender.txDetails;

export const selectTxType = (state: IAppState): ETxSenderType | undefined => state.txSender.type;

export const selectTxSummaryData = (state: IAppState): Partial<ITxData> | ITxData | undefined =>
  (state.txSender.summaryData && state.txSender.summaryData.txData) || state.txSender.txDetails;

export const selectTxSummaryAdditionalData = (state: IAppState) =>
  state.txSender.summaryData && state.txSender.summaryData.additionalData;

export const selectTxGasCostEthUlps = (state: IAppState): BigNumber => {
  const details = selectTxDetails(state);
  const gasPrice = (details && details.gasPrice) || new BigNumber("0");
  const gasLimit = (details && details.gas) || new BigNumber("0");
  return gasPrice.mul(gasLimit)
};

export const selectTxValidationState = (state: IAppState): EValidationState | undefined =>
  state.txSender.validationState;
