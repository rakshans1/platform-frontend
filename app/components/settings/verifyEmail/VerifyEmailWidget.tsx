import * as cn from "classnames";
import * as React from "react";
import * as styles from "./VerifyEmailWidget.module.scss";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notfications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notfications/warning.svg";

import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import { compose } from "redux";
import { IUser } from "../../../lib/api/users/interfaces";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";
import { PanelDark } from "../../shared/PanelDark";

export const VerifyEmailWidgetComponent: React.SFC<IUser> = ({ verifiedEmail }) => {
  return (
    <PanelDark
      headerText="EMAIL VERIFICATION"
      rightComponent={
        verifiedEmail ? (
          <img src={successIcon} className={styles.icon} aria-hidden="true" />
        ) : (
          <img src={warningIcon} className={styles.icon} aria-hidden="true" />
        )
      }
    >
      {verifiedEmail ? (
        <div
          data-test-id="verified-section"
          className={cn(styles.content, "d-flex flex-wrap align-content-around")}
        >
          <p className={cn(styles.text, "pt-2")}>Your email is verified. </p>
          <Col xs={12} className="d-flex justify-content-center">
            <Link to="#">
              <Button layout="secondary" iconPosition="icon-after" svgIcon={arrowRight}>
                Resend Link
              </Button>
            </Link>
          </Col>
        </div>
      ) : (
        <div
          data-test-id="unverified-section"
          className={cn(styles.content, "d-flex flex-wrap align-content-around")}
        >
          <p className={cn(styles.text, "pt-2")}>
            You need to verify your email address, which will be used for your wallet link we send
            you
          </p>
          <Col xs={12} className="d-flex justify-content-center">
            <Link to="#">
              <Button layout="secondary" iconPosition="icon-after" svgIcon={arrowRight}>
                Verify
              </Button>
            </Link>
          </Col>
        </div>
      )}
    </PanelDark>
  );
};
export const VerifyEmailWidget = compose<React.ComponentClass>(
  appConnect<any>({
    stateToProps: s => ({
      user: s.auth.user,
    }),
  }),
)(VerifyEmailWidgetComponent);
