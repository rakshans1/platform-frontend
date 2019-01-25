import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { BROWSER_WALLET_RECONNECT_INTERVAL } from "../../../config/constants";
import { actions } from "../../../modules/actions";
import { selectIsLoginRoute } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { withActionWatcher } from "../../../utils/withActionWatcher";
import { Button } from "../../shared/buttons";
import { HiResImage } from "../../shared/HiResImage";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { StepCard } from "../../shared/StepCard";
import { WarningAlert } from "../../shared/WarningAlert";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";

import * as browserIcon from "../../../assets/img/wallet_selector/browser_icon.svg";
import * as lockIcon from "../../../assets/img/wallet_selector/lock_icon.svg";
import * as styles from "./WalletBrowser.module.scss";

interface IWalletBrowserProps {
  errorMessage?: TMessage;
  isLoading: boolean;
  isLoginRoute: boolean;
  approvalRejected: boolean;
}

interface IWalletBrowserDispatchProps {
  handleReset: () => void;
}

export const WalletBrowserComponent: React.FunctionComponent<
  IWalletBrowserProps & IWalletBrowserDispatchProps
> = ({ errorMessage, isLoading, isLoginRoute, approvalRejected, handleReset }) => (
  <div>
    <h2 className={styles.title} data-test-id="modals.wallet-selector.wallet-browser.title">
      {isLoginRoute ? (
        <FormattedMessage id="wallet-selector.browser.login-prompt" />
      ) : (
        <FormattedMessage id="wallet-selector.browser.register-prompt" />
      )}
    </h2>

    {isLoading ? (
      <LoadingIndicator />
    ) : (
      <div>
        {errorMessage && (
          <Row className="justify-content-center mb-4">
            <WarningAlert>
              <span data-test-id="browser-wallet-error-msg">
                {getMessageTranslation(errorMessage)}
              </span>
            </WarningAlert>
          </Row>
        )}
        {approvalRejected && (
          <>
            <Row className="justify-content-center mb-4">
              <div>
                <FormattedMessage id="wallet-selector.browser.approval-rejected" />
              </div>
            </Row>
            <Row className="justify-content-center mb-4">
              <Button onClick={handleReset}>
                <FormattedMessage id="wallet-selector.browser.approval-resend" />
              </Button>
            </Row>
          </>
        )}
        <div className={styles.stepCardWrapper}>
          <StepCard
            img={browserIcon}
            text={<FormattedMessage id="wallet-selector.browser.steps.2" />}
          />
          <StepCard
            img={lockIcon}
            text={<FormattedMessage id="wallet-selector.browser.steps.3" />}
          />
        </div>

        <HorizontalLine className="mb-4" />

        <Row className="text-center mb-4">
          <Col>
            <span className="font-weight-bold">
              <FormattedMessage id="wallet-selector.browser.supports" />
            </span>
          </Col>
        </Row>
        <Row className={cn("justify-content-center text-center", styles.walletLogos)}>
          <Col sm="auto">
            <HiResImage partialPath="wallet_selector/logo_parity" alt="Parity" title="Parity" />
          </Col>
          <Col sm="auto">
            <HiResImage partialPath="wallet_selector/logo_mist" alt="Mist" title="Mist" />
          </Col>
        </Row>
      </div>
    )}
  </div>
);

export const WalletBrowser = compose<React.FunctionComponent>(
  appConnect<IWalletBrowserProps, IWalletBrowserDispatchProps>({
    stateToProps: state => ({
      errorMessage: state.browserWalletWizardState.errorMsg as TMessage,
      isLoading: state.browserWalletWizardState.isLoading,
      isLoginRoute: selectIsLoginRoute(state.router),
      approvalRejected: state.browserWalletWizardState.approvalRejected,
    }),
    dispatchToProps: dispatch => ({
      handleReset: () => dispatch(actions.walletSelector.browserWalletResetApprovalRequest()),
    }),
  }),
  withActionWatcher({
    actionCreator: dispatch => dispatch(actions.walletSelector.tryConnectingWithBrowserWallet()),
    interval: BROWSER_WALLET_RECONNECT_INTERVAL,
  }),
)(WalletBrowserComponent);
