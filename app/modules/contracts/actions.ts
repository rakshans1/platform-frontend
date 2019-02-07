import { createAction } from "../actionsUtils";
import { IPlatformTermsConstantsState } from "./interfaces";

export const contractsActions = {
  setPlatformTermConstants: (platformTermsConstants: IPlatformTermsConstantsState) =>
    createAction("CONTRACTS_SET_PLATFORM_TERM_CONSTANTS", { platformTermsConstants }),
};
