import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { AccountAddress } from "../../shared/AccountAddress";
import { AccountBalance } from "../../shared/AccountBalance";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { ECurrency } from "../../shared/Money";
import { IPanelProps } from "../../shared/Panel";
import { IWalletValues, WalletBalanceContainer } from "./WalletBalance";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as neuroIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./WalletBalance.module.scss";

interface IUnlockedWallet extends IPanelProps {
  depositEth: () => void;
  withdrawEth: () => void;
  data: IWalletValues;
  address: string;
}

export const UnlockedWallet: React.FunctionComponent<IUnlockedWallet> = ({
  address,
  data,
  depositEth,
  withdrawEth,
  className,
  headerText,
}) => {
  return (
    <WalletBalanceContainer {...{ className, headerText }}>
      <section className={styles.message}>
        <FormattedMessage id={"shared-component.wallet-balance.explanation"} />
      </section>
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
          icon={neuroIcon}
          currency={ECurrency.EUR_TOKEN}
          currencyTotal={ECurrency.EUR}
          largeNumber={data.neuroAmount}
          value={data.neuroEuroAmount}
          withdrawDisabled={
            process.env.NEURO_WITHDRAW_ENABLED !== "1" || parseFloat(data.ethAmount) === 0
          }
          transferDisabled={process.env.NEURO_WITHDRAW_ENABLED !== "1"}
          dataTestId="unlockedEuroWallet"
          // TODO: add nEuro withdraw
          // TODO: add on depositClick when euro token flow exists
        />

        <HorizontalLine className="my-3" />

        <AccountBalance
          icon={ethIcon}
          currency={ECurrency.ETH}
          currencyTotal={ECurrency.EUR}
          largeNumber={data.ethAmount}
          value={data.ethEuroAmount}
          onWithdrawClick={withdrawEth}
          dataTestId="wallet-balance.ether"
          onDepositClick={depositEth}
          withdrawDisabled={
            process.env.NF_WITHDRAW_ENABLED !== "1" || parseFloat(data.ethAmount) === 0
          }
          transferDisabled={process.env.NF_WITHDRAW_ENABLED !== "1"}
        />
      </section>
    </WalletBalanceContainer>
  );
};
