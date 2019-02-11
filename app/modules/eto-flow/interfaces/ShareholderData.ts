import {NumericString} from "../../../types";
import {numberToNumericString} from "../../../utils/numericStringUtils";

export interface IStateShareholderData {
  fullName: string;
  shares: NumericString;
}

export interface IApiShareholderData {
  fullName: string;
  shares: number;
}

export const apiToStateConversionSpec = {
  shares: numberToNumericString()
};
