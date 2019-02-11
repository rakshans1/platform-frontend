import { filter, map } from "lodash/fp";
import { all, fork, put, select } from "redux-saga/effects";
import BigNumber from "bignumber.js";

import { ECurrency } from "../../components/shared/Money";
import { InvestorPortfolioMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EEtoState, TPublicEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { IStateUser } from "../auth/interfaces";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { promisify } from "../../lib/contracts/typechain-runtime";
import { IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { selectUser } from "../auth/selectors";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { IStateTokenDisbursal } from "./interfaces/interfaces";
import {
  convertToCalculatedContribution,
  convertToInvestorTicket,
  convertToTokenDisbursal,
} from "./utils";
import * as calculatedContributionInterfaces from "./interfaces/CalculatedContribution";
import * as investorTicketInterfaces from "./interfaces/InvestorTicket";
import {convert} from "../../components/eto/utils";

export function* loadInvestorTickets({ logger }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "INVESTOR_TICKET_ETOS_LOAD") return;

  try {
    yield all(
      map(
        eto => put(actions.investorEtoTicket.loadEtoInvestorTicket(eto)),
        filter(eto => eto.state === EEtoState.ON_CHAIN, action.payload.etos),
      ),
    );

    yield;
  } catch (e) {
    logger.error("Could not load investor tickets", e);
  }
}

export function* loadInvestorTicket(
  { contractsService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "INVESTOR_TICKET_LOAD") return;

  if (action.payload.eto.state !== EEtoState.ON_CHAIN) {
    throw new Error("Should be called only when eto is on chain");
  }

  const etoId = action.payload.eto.etoId;
  const user: IStateUser = yield select((state: IAppState) => selectUser(state.auth));

  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);

  const investorTickerRaw = yield etoContract.investorTicket(user.userId);
  yield put(
    actions.investorEtoTicket.setEtoInvestorTicket(
      etoId,
      convert(convertToInvestorTicket(investorTickerRaw),investorTicketInterfaces.blToStateConversionSpec),
    ),
  );

  const contribution:calculatedContributionInterfaces.IBlCalculatedContribution = yield neuCall(loadComputedContributionFromContract, action.payload.eto);

  yield put(actions.investorEtoTicket.setInitialCalculatedContribution(etoId, convert(contribution, calculatedContributionInterfaces.blToStateConversionSpec)));
}

export function* loadComputedContributionFromContract(
  { contractsService }: TGlobalDependencies,
  eto: TPublicEtoData,
  amountEuroUlps?: BigNumber,
  isICBM = false,
): any {
  if (eto.state !== EEtoState.ON_CHAIN) return;

  const state: IAppState = yield select();
  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);

  if (etoContract) {
    const newInvestorContributionEurUlps =
      amountEuroUlps || eto.minTicketEur && eto.minTicketEur.toString() || new BigNumber("0"); //fixme <--------------

    const from = selectEthereumAddressWithChecksum(state);

    // TODO: check whether typechain but still is not fixed
    // sorry no typechain, typechain has a bug with boolean casting
    const contribution = yield promisify(etoContract.rawWeb3Contract.calculateContribution, [
      from,
      isICBM,
      newInvestorContributionEurUlps,
    ]);

    return convertToCalculatedContribution(contribution);
  }
}

export function* loadClaimables({
  contractsService,
  logger,
  notificationCenter,
}: TGlobalDependencies): any {
  const user: IStateUser = yield select((state: IAppState) => selectUser(state.auth));

  const { feeDisbursal, euroToken, etherToken, neumark } = contractsService;

  const tokens: [ECurrency, string][] = [
    [ECurrency.EUR_TOKEN, euroToken.address],
    [ECurrency.ETH, etherToken.address],
  ];

  try {
    const tokensDisbursalRaw = yield feeDisbursal.claimableMutipleByToken(
      tokens.map(([, address]) => address),
      neumark.address,
      user.userId,
    );

    const tokensDisbursal: IStateTokenDisbursal[] = tokens.map(([token], i) =>
      // claimableMultipeByToken preserves tokens order so it's safe to get exact response by index
      convertToTokenDisbursal(token, tokensDisbursalRaw[i]),
    );

    yield put(actions.investorEtoTicket.setTokensDisbursal(tokensDisbursal));
  } catch (error) {
    yield put(actions.investorEtoTicket.setTokensDisbursal([]));

    logger.error("Failed to load claimables", error);

    notificationCenter.error(
      createMessage(InvestorPortfolioMessage.INVESTOR_PORTFOLIO_FAILED_TO_LOAD_CLAIMABLES),
    );
  }
}

export function* investorTicketsSagas(): any {
  yield fork(neuTakeEvery, "INVESTOR_TICKET_ETOS_LOAD", loadInvestorTickets);
  yield fork(neuTakeEvery, "INVESTOR_TICKET_LOAD", loadInvestorTicket);
  yield fork(neuTakeEvery, actions.investorEtoTicket.loadClaimables, loadClaimables);
}
