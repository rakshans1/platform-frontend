import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { MONEY_DECIMALS } from "../../../../config/constants";
import { externalRoutes } from "../../../../config/externalRoutes";
import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import { selectInvestmentActiveTypes } from "../../../../modules/investment-flow/selectors";
import { EValidationState } from "../../../../modules/tx/sender/reducer";
import {
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLockedEtherBalance,
  selectLockedEtherBalanceEuroAmount,
  selectLockedEuroTokenBalance,
} from "../../../../modules/wallet/selectors";
import { IAppState } from "../../../../store";
import { Dictionary } from "../../../../types";
import { divideBigNumbers } from "../../../../utils/BigNumberUtils";
import { formatMoney } from "../../../../utils/Money.utils";
import { formatThousands } from "../../../../utils/Number.utils";
import { WalletSelectionData } from "./InvestmentTypeSelector";

import * as ethIcon from "../../../../assets/img/eth_icon.svg";
import * as euroIcon from "../../../../assets/img/euro_icon.svg";
import * as neuroIcon from "../../../../assets/img/nEUR_icon.svg";

export function createWallets(state: IAppState): WalletSelectionData[] {
  const w = state.wallet;
  const icbmEther = selectLockedEtherBalance(w);
  const icbmNeuro = selectLockedEuroTokenBalance(w);

  const wallets: Dictionary<WalletSelectionData> = {
    [EInvestmentType.InvestmentWallet]: {
      balanceEth: selectLiquidEtherBalance(w),
      balanceEur: selectLiquidEtherBalanceEuroAmount(state),
      type: EInvestmentType.InvestmentWallet,
      name: "Investment Wallet",
      icon: ethIcon,
    },
    [EInvestmentType.BankTransfer]: {
      type: EInvestmentType.BankTransfer,
      name: "Invest with EUR",
      icon: euroIcon,
    },
    [EInvestmentType.ICBMnEuro]: {
      type: EInvestmentType.ICBMnEuro,
      name: "ICBM Wallet",
      balanceNEuro: icbmNeuro,
      balanceEur: icbmNeuro,
      icon: neuroIcon,
    },
    [EInvestmentType.ICBMEth]: {
      type: EInvestmentType.ICBMEth,
      name: "ICBM Wallet",
      balanceEth: icbmEther,
      balanceEur: selectLockedEtherBalanceEuroAmount(state),
      icon: ethIcon,
    },
  };

  return selectInvestmentActiveTypes(state).map(t => wallets[t]);
}

export function getInputErrorMessage(
  type: EInvestmentErrorState | EValidationState | undefined,
  tokenName: string,
  maxTicketEur: string,
  minTicketEur: string,
): React.ReactElement<FormattedMessage.Props> | undefined {
  switch (type) {
    case EInvestmentErrorState.ExceedsTokenAmount:
      return (
        <FormattedMessage
          id="investment-flow.error-message.exceeds-token-amount"
          values={{ tokenName }}
        />
      );
    case EInvestmentErrorState.AboveMaximumTicketSize:
      return (
        <FormattedMessage
          id="investment-flow.error-message.above-maximum-ticket-size"
          values={{ maxAmount: `€${maxTicketEur || 0}` }}
        />
      );
    case EInvestmentErrorState.BelowMinimumTicketSize:
      return (
        <FormattedMessage
          id="investment-flow.error-message.below-minimum-ticket-size"
          values={{ minAmount: `€${minTicketEur || 0}` }}
        />
      );
    case EInvestmentErrorState.ExceedsWalletBalance:
      return <FormattedMessage id="investment-flow.error-message.exceeds-wallet-balance" />;
    case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS:
      return <FormattedMessage id="modal.txsender.error-message.not-enough-ether-for-gas" />;
  }
}

export function getInvestmentTypeMessages(type?: EInvestmentType): React.ReactNode {
  switch (type) {
    case EInvestmentType.BankTransfer:
      return (
        <FormattedHTMLMessage
          id="investment-flow.bank-transfer-info-message"
          tagName="p"
          values={{ href: `${externalRoutes.neufundSupport}/home` }}
        />
      );
  }
}

export function formatEur(val?: string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 2);
}

export function formatEurTsd(val?: string | BigNumber): string | undefined {
  return formatThousands(formatEur(val));
}

export function formatEth(val?: string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 4);
}

export function formatEthTsd(val?: string | BigNumber): string | undefined {
  return formatThousands(formatEth(val));
}

export function formatVaryingDecimals(val?: string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS);
}

export function getActualTokenPriceEur(
  investmentEurUlps: string,
  equityTokenCount: string | number,
): string {
  return formatMoney(divideBigNumbers(investmentEurUlps, equityTokenCount), MONEY_DECIMALS, 8);
}

export const formatSummaryTokenPrice = (fullTokenPrice: string, actualTokenPrice: string) => {
  const discount = new BigNumber(1)
    .sub(new BigNumber(actualTokenPrice).div(new BigNumber(fullTokenPrice)))
    .mul(100)
    .round(0, 4);
  let priceString = formatThousands(actualTokenPrice.toString());
  if (discount.gte(1)) {
    priceString += ` (-${discount}%)`;
  }
  return priceString;
};
