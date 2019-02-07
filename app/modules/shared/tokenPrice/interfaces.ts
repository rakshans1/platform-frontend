import {NumericString} from "../../../types";

export interface ITokenPriceState {
  loading: boolean;
  error?: string;
  tokenPriceData?: ITokenPriceDataState;
}

export interface ITokenPriceDataState {
  etherPriceEur: NumericString;
  neuPriceEur: NumericString;
  eurPriceEther: NumericString;
  priceOutdated: boolean;
}
