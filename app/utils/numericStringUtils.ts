import BigNumber from "bignumber.js";

import {NumericString} from "../types";

export const numberToNumericString = () => (x:number):NumericString => x.toString() as NumericString;
export const numericStringToBigNumber = (base:number = 10) => (x:NumericString) => new BigNumber(x, base);
