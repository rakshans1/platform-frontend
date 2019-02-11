import {NumericString} from "../../../types";
import {numberToNumericString} from "../../../utils/numericStringUtils";

export interface IStateEtoCapitalList {
  description: string;
  percent: NumericString;
}

export interface IApiEtoCapitalList {
  description: string;
  percent: number;
}

export const apiToStateConversionSpec = {
  percent: numberToNumericString()
};
