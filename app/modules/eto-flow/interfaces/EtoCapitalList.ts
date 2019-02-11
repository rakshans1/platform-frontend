import BigNumber from "bignumber.js";

import {NumericString} from "../../../types";
import {numberToNumericString, numericStringToBigNumber} from "../../../utils/numericStringUtils";

export interface IStateEtoCapitalList {
  description: string;
  percent: NumericString;
}

export interface IApiEtoCapitalList {
  description: string;
  percent: number;
}

export interface IBlEtoCapitalList {
  description: string;
  percent: BigNumber;
}

export const apiToStateConversionSpec = {
  percent: numberToNumericString()
};

export const stateToBlConversionSpec = {
  percent: numericStringToBigNumber()
};
