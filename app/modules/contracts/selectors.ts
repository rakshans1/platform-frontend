import { IAppState } from "../../store";
import {IPlatformTermsConstants} from "./reducer";

export const selectPlatformTermsConstants = (state: IAppState):IPlatformTermsConstants =>
  state.contracts.platformTermsConstants;
