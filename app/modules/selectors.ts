import { IAppState } from "../store";
import { selectBackupCodesVerified, selectIsUserEmailVerified } from "./auth/selectors";
import { selectKycRequestStatus } from "./kyc/selectors";

export const SelectIsVerificationFullyDone = (state: IAppState) =>
  !!(
    selectIsUserEmailVerified(state.auth) &&
    selectBackupCodesVerified(state) &&
    selectKycRequestStatus(state) === "Accepted"
  );
