import * as React from "react";
import * as styles from "./DepositEuroToken.module.scss";
import { DepositFunds } from "./DepositFunds";

import { FormattedMessage } from "react-intl-phraseapp";
import * as icon from "../../../../assets/img/nEUR_icon.svg";

interface IProps {
  path: string;
}

export const DepositEuroToken: React.FunctionComponent<IProps> = ({ path }) => {
  return (
    <DepositFunds path={path}>
      <div className={styles.methodEuroToken}>
        <h2 className={styles.title}>
          <FormattedMessage
            id="wallet.deposit-funds.eur.header"
            values={{ icon: <img src={icon} className={styles.icon} alt="nEUR icon" /> }}
          />
        </h2>
        <p className={styles.description}>
          <FormattedMessage id="wallet.deposit-funds.eur.description" />
          <br />
          <FormattedMessage id="wallet.deposit-funds.eur.email-notification" />
        </p>
        <div className={styles.background}>
          <div className={styles.details}>
            <div className={styles.label}>
              <FormattedMessage id="wallet.deposit-funds.eur.beneficiary" />
            </div>
            <div className={styles.value}>-</div>
            <div className={styles.label}>
              <FormattedMessage id="wallet.deposit-funds.eur.iban" />
            </div>
            <div className={styles.value}>-</div>
            <div className={styles.label}>
              <FormattedMessage id="wallet.deposit-funds.eur.bic" />
            </div>
            <div className={styles.value}>-</div>
            <div className={styles.label}>
              <FormattedMessage id="wallet.deposit-funds.eur.reference" />
            </div>
            <div className={styles.value}>-</div>
          </div>
          <div className={styles.currencyDetails}>
            <div className={styles.label}>
              <FormattedMessage id="wallet.deposit-funds.eur.eur-value" />
            </div>
            <div className={styles.exchangeRate}>1nEUR = 1€</div>
          </div>
        </div>
      </div>
    </DepositFunds>
  );
};
