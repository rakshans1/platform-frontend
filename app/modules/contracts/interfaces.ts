import {NumericString} from '../../types'
/**
 * Constants from Platform Terms.
 * Mind the units. Durations are in seconds.
 */
export interface IPlatformTermsConstantsState {
  IS_ICBM_INVESTOR_WHITELISTED: boolean;
  MIN_TICKET_EUR_ULPS: NumericString;
  PLATFORM_NEUMARK_SHARE: NumericString;
  TOKEN_PARTICIPATION_FEE_FRACTION: NumericString;
  PLATFORM_FEE_FRACTION: NumericString;
  DATE_TO_WHITELIST_MIN_DURATION: NumericString;
  TOKEN_RATE_EXPIRES_AFTER: NumericString;

  MIN_WHITELIST_DURATION: NumericString;
  MAX_WHITELIST_DURATION: NumericString;

  MIN_OFFER_DURATION: NumericString;
  MAX_OFFER_DURATION: NumericString;

  MIN_PUBLIC_DURATION: NumericString;
  MAX_PUBLIC_DURATION: NumericString;

  MIN_SIGNING_DURATION: NumericString;
  MAX_SIGNING_DURATION: NumericString;

  MIN_CLAIM_DURATION: NumericString;
  MAX_CLAIM_DURATION: NumericString;
}

export interface IContractState {
  platformTermsConstants: IPlatformTermsConstantsState;
}

// export interface IPlatformTermsConstants {
//   IS_ICBM_INVESTOR_WHITELISTED: boolean;
//   MIN_TICKET_EUR_ULPS: BigNumber;
//   PLATFORM_NEUMARK_SHARE: BigNumber;
//   TOKEN_PARTICIPATION_FEE_FRACTION: BigNumber;
//   PLATFORM_FEE_FRACTION: BigNumber;
//   DATE_TO_WHITELIST_MIN_DURATION: BigNumber;
//   TOKEN_RATE_EXPIRES_AFTER: BigNumber;
//
//   MIN_WHITELIST_DURATION: BigNumber;
//   MAX_WHITELIST_DURATION: BigNumber;
//
//   MIN_OFFER_DURATION: BigNumber;
//   MAX_OFFER_DURATION: BigNumber;
//
//   MIN_PUBLIC_DURATION: BigNumber;
//   MAX_PUBLIC_DURATION: BigNumber;
//
//   MIN_SIGNING_DURATION: BigNumber;
//   MAX_SIGNING_DURATION: BigNumber;
//
//   MIN_CLAIM_DURATION: BigNumber;
//   MAX_CLAIM_DURATION: BigNumber;
// }
