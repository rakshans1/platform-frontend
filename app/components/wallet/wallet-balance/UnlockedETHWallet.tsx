import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps } from "../../../types";
import { AccountAddress } from "../../shared/AccountAddress";
import { AccountBalance } from "../../shared/AccountBalance";
import { ECurrency } from "../../shared/Money";
import { WalletBalanceContainer } from "./WalletBalance";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as styles from "./WalletBalance.module.scss";

interface IUnlockedETHWallet {
  depositEth: () => void;
  withdrawEth: () => void;
  address: string;
  ethAmount: string;
  ethEuroAmount: string;
  totalEuroAmount: string;
}

export const UnlockedETHWallet: React.SFC<IUnlockedETHWallet & CommonHtmlProps> = ({
  address,
  depositEth,
  withdrawEth,
  className,
  ethAmount,
  ethEuroAmount,
}) => {
  return (
    <WalletBalanceContainer
      className={className}
      headerText={<FormattedMessage id="components.wallet.start.my-wallet" />}
    >
      <p className={styles.message}>
        <FormattedMessage id={"shared-component.wallet-balance.explanation"} />
      </p>

      <section>
        <h4 className={styles.title}>
          <FormattedMessage id="shared-component.wallet-balance.title.account-address" />
        </h4>
        <AccountAddress address={address} />
      </section>

      <section>
        <h4 className={styles.title}>
          <FormattedMessage id="shared-component.wallet-balance.title.account-balance" />
        </h4>

        <AccountBalance
          icon={ethIcon}
          currency={ECurrency.ETH}
          currencyTotal={ECurrency.EUR}
          largeNumber={ethAmount}
          value={ethEuroAmount}
          actions={[
            {
              name: <FormattedMessage id="shared-component.account-balance.withdraw" />,
              onClick: withdrawEth,
              disabled: process.env.NF_WITHDRAW_ENABLED !== "1" || parseFloat(ethAmount) === 0,
              "data-test-id": "wallet.eth.withdraw.button",
            },
            {
              name: <FormattedMessage id="shared-component.account-balance.deposit" />,
              onClick: depositEth,
              disabled: process.env.NF_WITHDRAW_ENABLED !== "1",
              "data-test-id": "wallet.eth.transfer.button",
            },
          ]}
        />
      </section>
    </WalletBalanceContainer>
  );
};
