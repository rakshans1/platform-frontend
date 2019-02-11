import { find } from "lodash/fp";
import BigNumber from "bignumber.js";

import { IAppState } from "../../store";
import {
  IStatePublicEto,
  EETOStateOnChain,
  TStateEtoWithCompanyAndContract,
  ICalcEtoTokenData
} from "./interfaces";
import {IStatePublicEtoData} from "../eto-flow/interfaces/PublicEtoData";
import {DeepReadonly} from "../../types";

const selectPublicEtosState = (state: IAppState) => state.publicEtos;

const selectEtoPreviewCode = (state: IAppState, etoId: string):string | undefined => {
  const eto = find(eto => eto!.etoId === etoId, state.publicEtos.publicEtos);

  if (eto) {
    return eto.previewCode;
  }

  return undefined;
};

export const selectEtoTokenName = (state: IAppState, etoId: string) => {
  const eto = find(eto => eto!.etoId === etoId, state.publicEtos.publicEtos);

  if (eto) {
    return eto.equityTokenName;
  }

  return undefined;
};

export const selectPublicEto = (state: IAppState, previewCode: string):IStatePublicEtoData | undefined =>
  state.publicEtos.publicEtos[previewCode];

export const selectPublicEtoById = (state: IAppState, etoId: string):DeepReadonly<IStatePublicEtoData> | undefined => {
  const previewId = selectEtoPreviewCode(state, etoId);
  return previewId ? state.publicEtos.publicEtos[previewId] : undefined; //previewId may be an empty string too
};

export const selectEtoWithCompanyAndContract = (
  state: IAppState,
  previewCode: string,
): TStateEtoWithCompanyAndContract | undefined => {
  const publicEtosState = selectPublicEtosState(state);
  const eto = publicEtosState.publicEtos[previewCode];

  if (eto) {
    return {
      ...eto,
      company: publicEtosState.companies[eto.companyId]!,
      contract: publicEtosState.contracts[previewCode],
    };
  }

  return undefined;
};

export const selectEtoWithCompanyAndContractById = (
  state: IAppState,
  etoId: string,
): TStateEtoWithCompanyAndContract | undefined => {
  const previewCode = selectEtoPreviewCode(state, etoId);

  if (previewCode) {
    return selectEtoWithCompanyAndContract(state, previewCode);
  }

  return undefined;
};

export const selectPublicEtos = (state: IAppState): TStateEtoWithCompanyAndContract[] | undefined => {
  const publicEtosState = selectPublicEtosState(state);

  if (publicEtosState.displayOrder) {
    return publicEtosState.displayOrder
      .map(id => selectEtoWithCompanyAndContract(state, id)!)
      .filter(Boolean);
  }

  return undefined;
};

export const selectEtoOnChainState = (
  state: IAppState,
  previewCode: string,
): EETOStateOnChain | undefined => {
  const contracts = state.publicEtos.contracts[previewCode];
  return contracts && contracts.timedState;
};

export const selectEtoOnChainNextStateStartDate = (
  state: IAppState,
  previewCode: string,
): Date | undefined => {
  const eto = selectEtoWithCompanyAndContract(state, previewCode);

  if (eto) {
    const nextState: EETOStateOnChain | undefined = eto.contract!.timedState + 1;

    if (nextState) {
      return eto.contract!.startOfStates[nextState];
    }
  }

  return undefined;
};

export const selectEtoWidgetError = (state: IStatePublicEto): boolean | undefined => {
  return state.etoWidgetError;
};

export const selectEtoOnChainStateById = (
  state: IAppState,
  etoId: string,
): EETOStateOnChain | undefined => {
  const code = selectEtoPreviewCode(state, etoId);
  if (code) return selectEtoOnChainState(state, code);
};

export const selectTokenData = (
  state: IStatePublicEto,
  previewCode: string,
): ICalcEtoTokenData | undefined => {
  const tokenData = state.tokenData[previewCode];
    return tokenData
    ? {
      balance: new BigNumber(tokenData.balance),
      tokensPerShare: new BigNumber(tokenData.tokensPerShare),
      totalCompanyShares: new BigNumber(tokenData.totalCompanyShares),
      companyValuationEurUlps: new BigNumber(tokenData.companyValuationEurUlps),
      tokenPrice: new BigNumber(tokenData.tokenPrice),
    }
    : undefined
};
