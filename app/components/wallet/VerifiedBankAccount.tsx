import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { IKycIndividualData } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import { selectIsBankAccountVerified } from "../../modules/auth/selectors";
import { selectBankAccount } from "../../modules/kyc/selectors";
import { TBankAccount } from "../../modules/kyc/types";
import { appConnect } from "../../store";
import { DeepReadonly } from "../../types";
import { onEnterAction } from "../../utils/OnEnterAction";
import { Button, ButtonSize, ButtonTextPosition, EButtonLayout } from "../shared/buttons";
import { InlineIcon } from "../shared/InlineIcon";

import * as bankIcon from "../../assets/img/inline_icons/plus.svg";
import * as styles from "./VerifiedBankAccount.module.scss";

interface IStateProps {
  personalData?: IKycIndividualData;
  bankAccount?: DeepReadonly<TBankAccount>;
  isVerified: boolean;
}

interface IBankNumber {
  last4: string;
  bank: string;
}

type IComponentProps = IStateProps;

const BankNumber: React.FunctionComponent<IBankNumber> = ({ last4, bank }) => (
  <>
    {bank} ({"*".repeat(16)}
    {last4})
  </>
);

const VerifiedBankAccountComponent: React.FunctionComponent<IComponentProps> = ({
  isVerified,
  personalData,
  bankAccount,
}) => (
  <section>
    <div className={styles.header}>
      <h4 className={styles.title}>
        <FormattedMessage id="shared-component.wallet-verified-bank-account.title" />
      </h4>
      <Button
        className={styles.linkButton}
        onClick={() => {}}
        data-test-id="wallet-verified-bank-account.link-account"
        theme={"blue"}
        textPosition={ButtonTextPosition.RIGHT}
        layout={EButtonLayout.INLINE}
        size={ButtonSize.SMALL}
      >
        <FormattedMessage id="shared-component.wallet-verified-bank-account.link-account" />
      </Button>
    </div>

    {isVerified && bankAccount && bankAccount.hasBankAccount ? (
      <div className={styles.bankDetails}>
        <div className={styles.icon}>
          <InlineIcon svgIcon={bankIcon} />
        </div>
        {personalData &&
          personalData.firstName &&
          personalData.lastName && (
            <div>
              <p className={"m-0"}>
                <span className={styles.kycData}>
                  {personalData.firstName} {personalData.lastName}
                </span>{" "}
                <span className={styles.bankVerified}>
                  <FormattedMessage id="shared-component.wallet-verified-bank-account.bank-account.verified" />
                </span>
              </p>
              <p className={"m-0"}>
                <BankNumber last4={bankAccount.details.bankAccountNumberLast4} bank={""} />
              </p>
            </div>
          )}
      </div>
    ) : (
      <>
        <p className={cn("m-0", styles.bankNotVerified)}>
          <FormattedMessage id="shared-component.wallet-verified-bank-account.bank-account" />
        </p>
        <p className={cn("m-0", styles.bankNotVerified)}>
          <FormattedMessage id="shared-component.wallet-verified-bank-account.bank-account.not-verified" />
        </p>
      </>
    )}
  </section>
);

const VerifiedBankAccount = compose<IComponentProps, {}>(
  appConnect<IStateProps, {}, {}>({
    stateToProps: state => ({
      personalData: state.kyc.individualData || {},
      bankAccount: selectBankAccount(state),
      isVerified: selectIsBankAccountVerified(state),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualData()),
  }),
)(VerifiedBankAccountComponent);

export { VerifiedBankAccount, VerifiedBankAccountComponent };
