import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Container, Row } from "reactstrap";

import { ChartBars, IChartBarsData } from "../../shared/charts/ChartBars";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { PanelWhite } from "../../shared/PanelWhite";

import * as stylesCommon from "../EtoOverviewCommon.module.scss";

interface IProps {
  tokenCreatedBeforeIco: number;
  tokenCreatedDuringIco: number;
  chartDataTokensOverTime: IChartBarsData;
  chartDataTransactionsOverTime: IChartBarsData;
}

export const EtoTokenIssuance: React.SFC<IProps> = ({
  chartDataTokensOverTime,
  chartDataTransactionsOverTime,
  tokenCreatedBeforeIco,
  tokenCreatedDuringIco,
}) => (
  <PanelWhite>
    <div className={stylesCommon.container}>
      <Row>
        <Col>
          <div>
            <strong className={stylesCommon.label}>
              <FormattedMessage id="eto.overview.token-issuance.number-of-created-token.during-ico" />
            </strong>
            {tokenCreatedDuringIco}
          </div>
          <div>
            <strong className={stylesCommon.label}>
              <FormattedMessage id="eto.overview.token-issuance.number-of-created-token.before-ico" />
            </strong>
            {tokenCreatedBeforeIco}
          </div>
          <HorizontalLine className="my-3" />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <div className={stylesCommon.chartNarrow}>
            <h3 className={stylesCommon.header}>
              <FormattedMessage id="eto.overview.token-issuance.chart-token-raised-over-time" />
            </h3>
            <small>
              <FormattedMessage id="eto.overview.token-issuance.number-of-investors" />
            </small>
            <ChartBars data={chartDataTokensOverTime} />
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className={stylesCommon.chartNarrow}>
            <h3 className={stylesCommon.header}>
              <FormattedMessage id="eto.overview.token-issuance.chart-transactions-over-time" />
            </h3>
            <small>
              <FormattedMessage id="eto.overview.token-issuance.number-of-investors" />
            </small>
            <ChartBars data={chartDataTransactionsOverTime} />
          </div>
        </Col>
      </Row>
    </div>
  </PanelWhite>
);
