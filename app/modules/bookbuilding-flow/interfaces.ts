import {Dictionary, NumericString} from "../../types";
import {ECurrency} from "../../components/shared/Money";

export interface IBookbuildingFLowState { //FIXME change all from number to BN
  bookbuildingStats: Dictionary<IBookBuildingStatsState>;
  pledges: Dictionary<IPledgeState | undefined>;
}

export interface IBookBuildingStatsState {
  investorsCount: number;
  pledgedAmount: NumericString;
}

export interface IPledgeState {
  amountEur: NumericString;
  currency: ECurrency.EUR_TOKEN;
  consentToRevealEmail: boolean;
}
