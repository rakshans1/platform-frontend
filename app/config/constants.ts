import BigNumber from "bignumber.js";

export const LIGHT_WALLET_PASSWORD_CACHE_TIME = 1000 * 3;
export const LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME = 1000 * 60 * 3;

/**
 * We assume common digits for all currencies on our platform.
 */
export const MONEY_DECIMALS = 18;

/**
 * Constants for permissions
 */
export const SUBMIT_KYC_PERMISSION = "submit-kyc";
export const CHANGE_EMAIL_PERMISSION = "change-email";
export const SUBMIT_ETO_PERMISSION = "submit-eto-listing";
export const UPLOAD_IMMUTABLE_DOCUMENT = "upload-issuer-immutable-document";
export const DO_BOOK_BUILDING = "do-bookbuilding";
export const SIGN_TOS = "sign-tos";

/**
 *  Constants for JWT tokens
 */
export const MAX_EXPIRATION_DIFF_MINUTES = 10;

/**
 * Useful for money related calculations
 */
export const Q18 = new BigNumber(10).pow(MONEY_DECIMALS);

/**
 * Represesnt zero address on Etherum - non existing address used by ERC20 to mark minting and burning
 */
export const ETHEREUM_ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// TODO: Replace by loading terms from universe (smart contract)
export const PlatformTerms = {
  MIN_TICKET_EUR_ULPS: Q18.mul(100),
};

/*
 * ETO REGISTRATION CONSTANTS
 */

export const MIN_COMPANY_SHARES = 100;
export const WHITELIST_DURATION_DAYS = {
  min: 1,
  max: 14,
};
export const PUBLIC_DURATION_DAYS = {
  min: 0,
  max: 60,
};
export const SIGNING_DURATION_DAYS = {
  min: 14,
  max: 60,
};
export const MIN_SHARE_NOMINAL_VALUE_EUR = 1;
export const MIN_PRE_MONEY_VALUATION_EUR = 100000;
export const MIN_EXISTING_COMPANY_SHARES = 1;
export const MIN_NEW_SHARES_TO_ISSUE = 1;
export const NEW_SHARES_TO_ISSUE_IN_WHITELIST = 1;
export const NEW_SHARES_TO_ISSUE_IN_FIXED_SLOTS = 1;
export const BOOKBUILDING_WATCHER_DELAY = 6000;

/**
 * Constants for react components
 */
export const TOAST_COMPONENT_DELAY = 4000;

export const BROWSER_WALLET_RECONNECT_INTERVAL = 1000;

/*
 * General constants•
 */
export const IS_CYPRESS = !!process.env.IS_CYPRESS;
export const IS_DEV = process.env.NODE_ENV === "development";

/*
 * Storage Listener Constants
 */

export const REDIRECT_CHANNEL_WATCH_DELAY = 5000;
