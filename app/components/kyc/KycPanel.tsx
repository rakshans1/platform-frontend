import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ButtonLink, EButtonLayout } from "../shared/buttons";
import { Panel } from "../shared/Panel";
import { IVerificationProgressStep, VerificationStatus } from "../shared/VerificationStatus";

import * as arrowLeft from "../../assets/img/inline_icons/arrow_left.svg";
import * as styles from "./KycPanel.module.scss";

interface IPropsKycPanel {
  backLink?: string;
  isMaxWidth?: boolean;
  fullHeightContent?: boolean;
  description?: string | React.ReactNode;
  steps: IVerificationProgressStep[];
  title?: string | React.ReactNode;
  testId?: string;
}

export const KycPanel: React.FunctionComponent<IPropsKycPanel> = ({
  title,
  steps,
  children,
  description,
  backLink,
  isMaxWidth,
  fullHeightContent,
  testId,
}) => (
  <Panel data-test-id={testId} className={cn("mt-4", styles.kycPanel)}>
    <header className={styles.header}>
      <h2 className={styles.title}>{title || <FormattedMessage id="kyc.panel.verification" />}</h2>
      <VerificationStatus steps={steps} />
      {description && (
        <div className={styles.description} data-test-id="kyc-panel-description">
          {description}
        </div>
      )}
    </header>
    <div
      className={cn(
        isMaxWidth ? styles.content : styles.contentNarrow,
        fullHeightContent ? styles.noTopPadding : null,
      )}
    >
      {children}
    </div>
    <footer className={styles.footer}>
      {backLink && (
        <ButtonLink
          to={backLink}
          layout={EButtonLayout.SECONDARY}
          iconPosition="icon-before"
          svgIcon={arrowLeft}
        >
          <FormattedMessage id="kyc.panel.go-back" />
        </ButtonLink>
      )}
    </footer>
  </Panel>
);
