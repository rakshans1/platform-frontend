import {ECurrency} from "../../../components/shared/Money";
import {NumericString} from "../../../types";
import BigNumber from "bignumber.js";
import {bigNumberToNumericString, numericStringToBigNumber} from "../../../utils/numericStringUtils";

export interface IStateTokenDisbursal {
  currency: ECurrency;
  amountToBeClaimed: NumericString;
  totalDisbursedAmount: NumericString;
  timeToFirstDisbursalRecycle: number;
}

export interface IBlTokenDisbursal {
  currency: ECurrency;
  amountToBeClaimed: BigNumber;
  totalDisbursedAmount: BigNumber;
  timeToFirstDisbursalRecycle: number;
}

export const stateToBlConversionSpec = {
  amountToBeClaimed: numericStringToBigNumber(),
  totalDisbursedAmount: numericStringToBigNumber()
};

export const blToStateConversionSpec = {
  amountToBeClaimed: bigNumberToNumericString(),
  totalDisbursedAmount: bigNumberToNumericString()
};
