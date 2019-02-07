import { ITxMonitorState } from "../interfaces";

export const selectAmountOfPendingTxs = (state: ITxMonitorState): number => {
  return state.txs.oooTransactions.length + (state.txs.pendingTransaction ? 1 : 0);
};
