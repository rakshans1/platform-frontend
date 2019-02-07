import BigNumber from "bignumber.js";
import { curry } from "lodash/fp";

import { Q18 } from "../config/constants";
import { invariant } from "./invariant";

export function isZero(value: string): boolean {
  const bigNumberValue = new BigNumber(value);

  return bigNumberValue.isZero();
}

/**
 * Assumes dot as decimal separator
 */
export function formatThousands(value?: string): string {
  if (!value) return "";
  const splitByDot = value.split(".");

  invariant(splitByDot.length <= 2, "Can't format this number: " + value);

  const formattedBeforeDot = splitByDot[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  if (splitByDot.length === 2) {
    return formattedBeforeDot + "." + splitByDot[1];
  }
  return formattedBeforeDot;
}
//FIXME find out what it does and rename it to be understandable
export function convertToBigInt(value: BigNumber, currencyDecimals?: number): BigNumber {
  const q = currencyDecimals ? new BigNumber(10).pow(currencyDecimals) : Q18;
  // const moneyInWei = q.mul(value);
  return q.mul(value);
}

export function formatFlexiPrecision(
  value: number | string,
  maxPrecision: number,
  minPrecision = 0,
  useGrouping = false,
): string {
  return parseFloat(value as string).toLocaleString(undefined, {
    maximumFractionDigits: maxPrecision,
    minimumFractionDigits: minPrecision,
    useGrouping,
  });
}

type TNormalizeOptions = { min: number; max: number };

function normalizeValue(options: TNormalizeOptions, value: number): number {
  const minAllowed = 0;
  const maxAllowed = 1;

  return (
    ((maxAllowed - minAllowed) * (value - options.min)) / (options.max - options.min) + minAllowed
  );
}

export const normalize = curry(normalizeValue);
