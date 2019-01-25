import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button, EButtonLayout } from "./buttons";
import { IMoneySuiteWidgetProps, MoneySuiteWidget } from "./MoneySuiteWidget";

import * as arrowRightIcon from "../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./AccountBalance.module.scss";

interface IProps {
  onWithdrawClick?: () => void;
  onDepositClick?: () => void;
  onUpgradeClick?: () => void;
  dataTestId?: string;
  disabled?: boolean;
  withdrawDisabled?: boolean;
  transferDisabled?: boolean;
}

export const AccountBalance: React.FunctionComponent<IProps & IMoneySuiteWidgetProps> = ({
  icon,
  currency,
  currencyTotal,
  largeNumber,
  disabled,
  value,
  onWithdrawClick,
  onDepositClick,
  onUpgradeClick,
  dataTestId,
  withdrawDisabled,
  transferDisabled,
}) => {
  return (
    <div className={styles.accountBalance}>
      <MoneySuiteWidget
        icon={icon}
        currency={currency}
        currencyTotal={currencyTotal}
        largeNumber={largeNumber}
        value={value}
        data-test-id={dataTestId && dataTestId + ".balance-values"}
      />
      <div className={styles.buttons}>
        {onUpgradeClick && (
          <Button
            layout={EButtonLayout.SIMPLE}
            innerClassName={styles.button}
            iconPosition="icon-after"
            theme="graphite"
            svgIcon={arrowRightIcon}
            onClick={onUpgradeClick}
            data-test-id={dataTestId && dataTestId + ".shared-component.upgrade.button"}
            disabled={disabled}
          >
            <FormattedMessage id="shared-component.account-balance.upgrade" />
          </Button>
        )}
        {onWithdrawClick && (
          <Button
            layout={EButtonLayout.SIMPLE}
            innerClassName={styles.button}
            iconPosition="icon-after"
            theme="graphite"
            svgIcon={arrowRightIcon}
            onClick={onWithdrawClick}
            data-test-id={dataTestId && dataTestId + ".shared-component.withdraw.button"}
            disabled={withdrawDisabled}
          >
            <FormattedMessage id="shared-component.account-balance.withdraw" />
          </Button>
        )}
        {onDepositClick && (
          <Button
            layout={EButtonLayout.SIMPLE}
            innerClassName={styles.button}
            iconPosition="icon-after"
            theme="graphite"
            data-test-id={dataTestId && dataTestId + ".shared-component.deposit.button"}
            disabled={transferDisabled}
            svgIcon={arrowRightIcon}
            onClick={onDepositClick}
          >
            <FormattedMessage id="shared-component.account-balance.deposit" />
          </Button>
        )}
      </div>
    </div>
  );
};
