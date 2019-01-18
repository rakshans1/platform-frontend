import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../config/externalRoutes";
import { CommonHtmlProps } from "../../../types";
import { AccountBalance } from "../../shared/AccountBalance";
import { ECurrency } from "../../shared/Money";
import { WalletBalanceContainer } from "./WalletBalance";

import * as neuroIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./WalletBalance.module.scss";

interface IUnlockedNEURWallet {
  deposit: () => void;
  withdraw: () => void;
  neuroAmount: string;
  neuroEuroAmount: string;
}

export const UnlockedNEURWallet: React.FunctionComponent<IUnlockedNEURWallet & CommonHtmlProps> = ({
  deposit,
  withdraw,
  neuroAmount,
  neuroEuroAmount,
  className,
}) => (
  <WalletBalanceContainer className={className} headerText={<FormattedMessage id="components.wallet.start.neur-wallet" />}>
    <section className={styles.message}>
      <FormattedHTMLMessage tagName="span" id="shared-component.neur-wallet-balance.explanation" values={{
        quintessenseHref: externalRoutes.quintessenseLanding
      }}/>
    </section>

    <section>
      <h4 className={styles.title}>
        <FormattedMessage id="shared-component.wallet-balance.title.account-balance" />
      </h4>

      <AccountBalance
        icon={neuroIcon}
        currency={ECurrency.EUR_TOKEN}
        currencyTotal={ECurrency.EUR}
        largeNumber={neuroAmount}
        value={neuroEuroAmount}
        withdrawDisabled={
          process.env.NEURO_WITHDRAW_ENABLED !== "1" || parseFloat(neuroAmount) === 0
        }
        transferDisabled={process.env.NEURO_WITHDRAW_ENABLED !== "1"}
        dataTestId="wallet-balance.neur"
        onDepositClick={deposit}
        onWithdrawClick={withdraw}
      />
    </section>
  </WalletBalanceContainer>
);
