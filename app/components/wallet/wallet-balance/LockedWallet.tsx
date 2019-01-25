import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { AccountBalance } from "../../shared/AccountBalance";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { ECurrency } from "../../shared/Money";
import { IPanelProps } from "../../shared/Panel";
import { isWalletNotEmpty } from "./utils";
import { IWalletValues, WalletBalanceContainer } from "./WalletBalance";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as neuroIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./WalletBalance.module.scss";

interface ILockedWallet extends IPanelProps {
  data: IWalletValues;
}

export const LockedWallet: React.FunctionComponent<ILockedWallet> = ({
  data,
  className,
  headerText,
}) => {
  return (
    <WalletBalanceContainer {...{ className, headerText }}>
      <section className={styles.message}>
        <FormattedMessage id="shared-component.wallet-icbm.already-upgraded-message" />
      </section>

      <section>
        <h4 className={styles.title}>
          <FormattedMessage id="shared-component.wallet-balance.title.account-balance" />
        </h4>
        {isWalletNotEmpty(data.neuroEuroAmount) && (
          <AccountBalance
            icon={neuroIcon}
            currency={ECurrency.EUR_TOKEN}
            currencyTotal={ECurrency.EUR}
            largeNumber={data.neuroAmount}
            value={data.neuroEuroAmount}
            dataTestId="lockedEuroWallet"
          />
        )}
        {isWalletNotEmpty(data.neuroAmount) &&
          isWalletNotEmpty(data.ethAmount) && <HorizontalLine className="my-3" />}
        {isWalletNotEmpty(data.ethAmount) && (
          <AccountBalance
            icon={ethIcon}
            currency={ECurrency.ETH}
            currencyTotal={ECurrency.EUR}
            largeNumber={data.ethAmount}
            value={data.ethEuroAmount}
            dataTestId="lockedEtherWallet"
          />
        )}
      </section>
    </WalletBalanceContainer>
  );
};
