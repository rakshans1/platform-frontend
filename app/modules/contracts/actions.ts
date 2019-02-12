import { createAction } from "../actionsUtils";
import { IStatePlatformTermsConstants } from "./interfaces";

export const contractsActions = {
  setPlatformTermConstants: (platformTermsConstants: IStatePlatformTermsConstants) =>
    createAction("CONTRACTS_SET_PLATFORM_TERM_CONSTANTS", { platformTermsConstants }),
};
