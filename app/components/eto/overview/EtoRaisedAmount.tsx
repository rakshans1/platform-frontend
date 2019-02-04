import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { ChartBars, IChartBarsData } from "../../shared/charts/ChartBars";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { ECurrency, ETheme, Money } from "../../shared/Money";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget";
import { Panel } from "../../shared/Panel";
import { PercentageIndicatorBar } from "../../shared/PercentageIndicatorBar";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as moneyIcon from "../../../assets/img/nEUR_icon.svg";
import * as stylesCommon from "../EtoOverviewCommon.module.scss";
import * as styles from "./EtoRaisedAmount.module.scss";

interface IProps {
  chartData: IChartBarsData;
  firstTransactionTime: string;
  lastTransactionTime: string;
}

export const EtoRaisedAmount: React.FunctionComponent<IProps> = ({
  chartData,
  firstTransactionTime,
  lastTransactionTime,
}) => (
  <Panel>
    <div className={stylesCommon.container}>
      <Row>
        <Col>
          <div>
            <strong className={stylesCommon.label}>
              <FormattedMessage id="eto.overview.raised-amount.transaction-time.first" />
            </strong>
            {firstTransactionTime}
          </div>
          <div>
            <strong className={stylesCommon.label}>
              <FormattedMessage id="eto.overview.raised-amount.transaction-time.last" />
            </strong>
            {lastTransactionTime}
          </div>
        </Col>
      </Row>
      <HorizontalLine className="my-3" />
      <Row>
        <Col>
          <div className={styles.overview}>
            <div className={styles.overviewMoney}>
              <div className={stylesCommon.header}>
                <FormattedMessage id="eto.overview.raised-amount.total" />{" "}
                <Money
                  theme={ETheme.GREEN}
                  value={"1234567" + "0".repeat(16)}
                  currency={ECurrency.EUR}
                />
              </div>
              <MoneySuiteWidget
                currency={ECurrency.EUR_TOKEN}
                largeNumber={"1234567" + "0".repeat(16)}
                value={"1234567" + "0".repeat(16)}
                currencyTotal={ECurrency.EUR}
                icon={moneyIcon}
              />
              <MoneySuiteWidget
                currency={ECurrency.ETH}
                largeNumber={"1234567" + "0".repeat(16)}
                value={"1234567" + "0".repeat(16)}
                currencyTotal={ECurrency.EUR}
                icon={ethIcon}
              />
            </div>

            <div className={styles.overviewProgress}>
              <PercentageIndicatorBar percent={76} />
              <Money
                className={styles.total}
                value={"1234567" + "0".repeat(14)}
                currency={ECurrency.EUR}
              />
            </div>
          </div>
          <HorizontalLine className="my-3" />
          <div>
            <h4 className={stylesCommon.header}>
              <FormattedMessage id="eto.overview.raised-amount.raised-over-time" />
            </h4>
            <ChartBars className={styles.chart} data={chartData} width={1419} height={320} />
          </div>
        </Col>
      </Row>
    </div>
  </Panel>
);
