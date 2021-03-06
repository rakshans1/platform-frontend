import { BigNumber } from "bignumber.js";

import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

/**
 * Constants from Platform Terms.
 * Mind the units. Durations are in seconds.
 */
export interface IPlatformTermsConstants {
  IS_ICBM_INVESTOR_WHITELISTED: boolean;
  MIN_TICKET_EUR_ULPS: BigNumber;
  PLATFORM_NEUMARK_SHARE: BigNumber;
  TOKEN_PARTICIPATION_FEE_FRACTION: BigNumber;
  PLATFORM_FEE_FRACTION: BigNumber;
  DATE_TO_WHITELIST_MIN_DURATION: BigNumber;
  TOKEN_RATE_EXPIRES_AFTER: BigNumber;

  MIN_WHITELIST_DURATION: BigNumber;
  MAX_WHITELIST_DURATION: BigNumber;

  MIN_OFFER_DURATION: BigNumber;
  MAX_OFFER_DURATION: BigNumber;

  MIN_PUBLIC_DURATION: BigNumber;
  MAX_PUBLIC_DURATION: BigNumber;

  MIN_SIGNING_DURATION: BigNumber;
  MAX_SIGNING_DURATION: BigNumber;

  MIN_CLAIM_DURATION: BigNumber;
  MAX_CLAIM_DURATION: BigNumber;
}

interface IContractState {
  platformTermsConstants: IPlatformTermsConstants;
}

const contractsInitialState: IContractState = {
  platformTermsConstants: {} as any,
  // initially empty. But contract should be initialized first on application start,
  // and values are set throughout the app lifetime
};

export const contractsReducer: AppReducer<IContractState> = (
  state = contractsInitialState,
  action,
): DeepReadonly<IContractState> => {
  switch (action.type) {
    case "CONTRACTS_SET_PLATFORM_TERM_CONSTANTS":
      return {
        ...state,
        ...action.payload,
      };
  }
  return state;
};
