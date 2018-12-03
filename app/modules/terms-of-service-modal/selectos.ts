import { IAppState } from "../../store";

export const selectCurrentAgreementHash = (state: IAppState): string | undefined =>
  state.auth.currentAgreementHash;

export const selectIsLatestAgreementAccepted = (state: IAppState): boolean =>
  !!(
    state.auth.user &&
    state.auth.currentAgreementHash &&
    state.auth.user.latestAcceptedTosIpfs === state.auth.currentAgreementHash
  );

export const selectIsLatestAgreementLoaded = (state: IAppState) =>
  !!state.auth.currentAgreementHash;
