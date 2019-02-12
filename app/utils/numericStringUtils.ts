import BigNumber from "bignumber.js";

import {NumericString} from "../types";

export const numberToNumericString = () => (x:number):NumericString => x.toString() as NumericString;
export const numericStringToBigNumber = (base:number = 10) => (x:NumericString) => new BigNumber(x, base);
export const bigNumberToNumericString = () => (x:BigNumber) => x.toString() as NumericString;
export const numericStringToNumber = () => (x:NumericString) => parseFloat(x);
export const bigNumberToNumber = () => (x:BigNumber) => x.toNumber();
