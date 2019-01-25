import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { MONEY_DECIMALS } from "../../config/constants";
import { formatMoney } from "../../utils/Money.utils";
import { NumberFormat } from "./NumberFormat";

import * as styles from "./Money.module.scss";

enum ECurrencySymbol {
  SYMBOL = "symbol",
  CODE = "code",
  NONE = "none",
}

enum ECurrency {
  NEU = "neu",
  EUR = "eur",
  EUR_TOKEN = "eur_t",
  ETH = "eth",
}

enum EMoneyFormat {
  WEI = "wei",
  FLOAT = "float",
}

type TMoneyTransfer = "income" | "outcome";

type TTheme = "t-green" | "t-orange";

interface IOwnProps extends React.HTMLAttributes<HTMLSpanElement> {
  currency: ECurrency;
  value?: React.ReactElement<any> | string | BigNumber | number | null;
  format?: EMoneyFormat;
  currencySymbol?: ECurrencySymbol;
  currencyClassName?: string;
  transfer?: TMoneyTransfer;
  theme?: TTheme;
}

type IProps = IOwnProps;

const selectDecimalPlaces = (currency: ECurrency): number => {
  switch (currency) {
    case ECurrency.ETH:
      return 4;
    case ECurrency.NEU:
      return 4;
    case ECurrency.EUR:
      return 2;
    case ECurrency.EUR_TOKEN:
      return 2;
  }
};

const selectCurrencyCode = (currency: ECurrency): string => {
  switch (currency) {
    case ECurrency.ETH:
      return "ETH";
    case ECurrency.NEU:
      return "NEU";
    case ECurrency.EUR:
      return "EUR";
    case ECurrency.EUR_TOKEN:
      return "nEUR";
  }
};

const selectCurrencySymbol = (currency: ECurrency): string => {
  switch (currency) {
    case ECurrency.EUR:
      return "€";
    default:
      throw new Error("Only EUR can be displayed as a symbol");
  }
};

function getFormatDecimals(format: EMoneyFormat): number {
  switch (format) {
    case EMoneyFormat.WEI:
      return MONEY_DECIMALS;
    case EMoneyFormat.FLOAT:
      return 0;
    default:
      throw new Error("Unsupported money format");
  }
}

export function getFormattedMoney(
  value: string | number | BigNumber,
  currency: ECurrency,
  format: EMoneyFormat,
): string {
  return formatMoney(value, getFormatDecimals(format), selectDecimalPlaces(currency));
}

const Money: React.FunctionComponent<IProps> = ({
  value,
  format = EMoneyFormat.WEI,
  currency,
  currencyClassName,
  transfer,
  currencySymbol = ECurrencySymbol.CODE,
  theme,
  ...props
}) => {
  if (!value) {
    return <>-</>;
  }

  const money =
    format === EMoneyFormat.WEI && !React.isValidElement(value)
      ? getFormattedMoney(value as BigNumber, currency, EMoneyFormat.WEI)
      : value;

  const formattedMoney = !React.isValidElement(money) ? (
    <NumberFormat value={money as string} />
  ) : (
    money
  );
  return (
    <span {...props} className={cn(styles.money, transfer, props.className, theme)}>
      {currencySymbol === ECurrencySymbol.SYMBOL && (
        <span className={cn(styles.currency, currencyClassName)}>
          {selectCurrencySymbol(currency)}
        </span>
      )}
      {formattedMoney}
      {currencySymbol === ECurrencySymbol.CODE && (
        <span className={cn(styles.currency, currencyClassName)}>
          {" "}
          {selectCurrencyCode(currency)}
        </span>
      )}
    </span>
  );
};

export {
  Money,
  selectCurrencySymbol,
  selectCurrencyCode,
  selectDecimalPlaces,
  TMoneyTransfer,
  EMoneyFormat,
  ECurrency,
  ECurrencySymbol,
};
