import { fork, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions, TAction, TActionFromCreator } from "../../actions";
import { onInvestmentTxModalHide } from "../../investment-flow/sagas";
import { neuTakeLatest } from "../../sagasUtils";
import { ETxSenderType } from "../interfaces";
import { ITxSendParams, txSendSaga } from "../sender/sagas";
import { startClaimGenerator } from "./claim/saga";
import { etoSetDateGenerator } from "./eto-flow/saga";
import { investmentFlowGenerator } from "./investment/sagas";
import { startInvestorPayoutAcceptGenerator } from "./payout/accept/saga";
import { startInvestorPayoutRedistributionGenerator } from "./payout/redistribute/saga";
import { upgradeTransactionFlow } from "./upgrade/sagas";
import { ethWithdrawFlow } from "./withdraw/sagas";

export function* withdrawSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga({
      type: ETxSenderType.WITHDRAW,
      transactionFlowGenerator: ethWithdrawFlow,
    });
    logger.info("Withdrawing successful");
  } catch (e) {
    logger.info("Withdrawing cancelled", e);
  }
}

export function* upgradeSaga({ logger }: TGlobalDependencies, action: TAction): any {
  try {
    if (action.type !== "TRANSACTIONS_START_UPGRADE") return;

    const tokenType = action.payload;
    const params: ITxSendParams = {
      type: ETxSenderType.UPGRADE,
      transactionFlowGenerator: upgradeTransactionFlow,
      extraParam: tokenType,
    };
    yield txSendSaga(params);

    logger.info("Upgrading successful");
  } catch (e) {
    logger.info("Upgrading cancelled", e);
  }
}

export function* investSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga({
      type: ETxSenderType.INVEST,
      transactionFlowGenerator: investmentFlowGenerator,
    });
    logger.info("Investment successful");
  } catch (e) {
    // Add clean up functions here ...
    yield onInvestmentTxModalHide();
    logger.info("Investment cancelled", e);
  }
}

export function* userClaimSaga({ logger }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "TRANSACTIONS_START_CLAIM") return;
  const etoId = action.payload;
  try {
    yield txSendSaga({
      type: ETxSenderType.USER_CLAIM,
      transactionFlowGenerator: startClaimGenerator,
      extraParam: etoId,
    });
    logger.info("User claim successful");
  } catch (e) {
    logger.info("User claim cancelled", e);
  } finally {
    yield put(actions.publicEtos.loadEto(etoId));
  }
}

export function* investorPayoutAcceptSaga(
  { logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.txTransactions.startInvestorPayoutAccept>,
): any {
  const tokensDisbursals = action.payload.tokensDisbursals;

  try {
    yield txSendSaga({
      type: ETxSenderType.INVESTOR_ACCEPT_PAYOUT,
      transactionFlowGenerator: startInvestorPayoutAcceptGenerator,
      extraParam: tokensDisbursals,
    });

    logger.info("Investor payout accept successful");
  } catch (e) {
    logger.info("Investor payout accept cancelled", e);
  } finally {
    yield put(actions.investorEtoTicket.loadClaimables());
  }
}

export function* investorPayoutRedistributeSaga(
  { logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.txTransactions.startInvestorPayoutRedistribute>,
): any {
  const tokenDisbursals = action.payload.tokenDisbursals;

  try {
    yield txSendSaga({
      type: ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT,
      transactionFlowGenerator: startInvestorPayoutRedistributionGenerator,
      extraParam: tokenDisbursals,
    });

    logger.info("Investor payout redistribution successful");
  } catch (e) {
    logger.info("Investor payout redistribution cancelled", e);
  } finally {
    yield put(actions.investorEtoTicket.loadClaimables());
  }
}

export function* etoSetDateSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga({
      type: ETxSenderType.ETO_SET_DATE,
      transactionFlowGenerator: etoSetDateGenerator,
    });
    logger.info("Setting ETO date successful");
    // cleanup & refresh eto data
    yield put(actions.etoFlow.cleanupStartDate());
  } catch (e) {
    logger.info("Setting ETO date cancelled", e);
  }
}

export const txTransactionsSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeLatest, "TRANSACTIONS_START_WITHDRAW_ETH", withdrawSaga);
  yield fork(neuTakeLatest, "TRANSACTIONS_START_UPGRADE", upgradeSaga);
  yield fork(neuTakeLatest, "TRANSACTIONS_START_INVESTMENT", investSaga);
  yield fork(neuTakeLatest, "TRANSACTIONS_START_ETO_SET_DATE", etoSetDateSaga);
  yield fork(neuTakeLatest, "TRANSACTIONS_START_CLAIM", userClaimSaga);
  yield fork(
    neuTakeLatest,
    actions.txTransactions.startInvestorPayoutAccept,
    investorPayoutAcceptSaga,
  );
  yield fork(
    neuTakeLatest,
    actions.txTransactions.startInvestorPayoutRedistribute,
    investorPayoutRedistributeSaga,
  );
  // Add new transaction types here...
};
