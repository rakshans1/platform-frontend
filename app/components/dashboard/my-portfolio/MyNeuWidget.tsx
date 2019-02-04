import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { externalRoutes } from "../../../config/externalRoutes";
import { ButtonLink, EButtonLayout } from "../../shared/buttons";
import { ECurrency } from "../../shared/Money";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as icon from "../../../assets/img/neu_icon.svg";
import * as styles from "./MyNeuWidget.module.scss";

interface IProps {
  balanceNeu: string;
  balanceEur: string;
}

export const MyNeuWidget: React.FunctionComponent<IProps> = props => {
  return (
    <section className={cn(styles.background)}>
      <h5 className={cn(styles.title)}>
        <FormattedMessage id="dashboard.my-neu-widget.my-neumark" />
      </h5>
      <Row noGutters className={cn(styles.content)}>
        <Col md={12}>
          <div className={cn(styles.neu)}>
            <MoneySuiteWidget
              currency={ECurrency.NEU}
              largeNumber={props.balanceNeu}
              icon={icon}
              value={props.balanceEur}
              currencyTotal={ECurrency.EUR}
              data-test-id="my-neu-widget-neumark-balance"
              size="large"
            />
          </div>
        </Col>
        <Col md={12} className="text-center align-self-end" data-test-id="arrow-neu">
          <ButtonLink
            to={`${externalRoutes.neufundSupport}/solutions/articles/36000060355-what-is-neumark-`}
            target="_blank"
            layout={EButtonLayout.SECONDARY}
            iconPosition="icon-after"
            svgIcon={arrowRight}
          >
            <FormattedMessage id="dashboard.my-neu-widget.about" />
          </ButtonLink>
        </Col>
      </Row>
    </section>
  );
};
