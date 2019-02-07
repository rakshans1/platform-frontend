import { IAppState } from "../../store";
import {IPlatformTermsConstants} from "./interfaces";

export const selectPlatformTermsConstants = (state: IAppState):IPlatformTermsConstants =>
  state.contracts.platformTermsConstants;
