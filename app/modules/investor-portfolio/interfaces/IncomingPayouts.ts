import {NumericString} from "../../../types";
import {numericStringToBigNumber} from "../../../utils/numericStringUtils";

export interface IStateIncomingPayoutsData {
  euroTokenIncomingPayoutValue: NumericString;
  etherTokenIncomingPayoutValue: NumericString;
}

export interface IStateIncomingPayouts {
  loading: boolean;
  data?: IStateIncomingPayoutsData;
  payoutDone: boolean;
}

export interface IBlIncomingPayoutsData {
  euroTokenIncomingPayoutValue: NumericString;
  etherTokenIncomingPayoutValue: NumericString;
}

export interface IBlIncomingPayouts {
  loading: boolean;
  data?: IBlIncomingPayoutsData;
  payoutDone: boolean;
}


export const stateToBlConversionSpec = {
  data: {
    euroTokenIncomingPayoutValue: numericStringToBigNumber(),
    etherTokenIncomingPayoutValue: numericStringToBigNumber()
  }
}
