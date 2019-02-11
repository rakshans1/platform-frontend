import BigNumber from "bignumber.js";

import {NumericString} from "../../../types";
import {numberToNumericString, numericStringToBigNumber} from "../../../utils/numericStringUtils";

export interface IStateShareholderData {
  fullName: string;
  shares: NumericString;
}

export interface IApiShareholderData {
  fullName: string;
  shares: number;
}

export interface IBlShareholderData {
  fullName: string;
  shares: BigNumber;
}

export const apiToStateConversionSpec = {
  shares: numberToNumericString()
};

export const stateToBlConversionSpec = {
  shares: numericStringToBigNumber()
};
