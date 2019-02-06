import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { ITokenDisbursal } from "../../modules/investor-portfolio/types";
import { appConnect } from "../../store";
import { CommonHtmlProps } from "../../types";
import { Button, ButtonSize, EButtonLayout } from "../shared/buttons";
import { LoadingIndicator } from "../shared/loading-indicator";
import { ECurrency, ETheme, Money, selectCurrencyCode } from "../shared/Money";
import { NewTable, NewTableRow } from "../shared/NewTable";
import { Panel } from "../shared/Panel";
import { SectionHeader } from "../shared/SectionHeader";

import * as ethIcon from "../../assets/img/eth_icon.svg";
import * as nEurIcon from "../../assets/img/nEUR_icon.svg";

interface IExternalProps {
  tokensDisbursal: ReadonlyArray<ITokenDisbursal> | undefined;
}

interface ILayoutProps {
  tokensDisbursal: ReadonlyArray<ITokenDisbursal>;
}

interface IDispatchToProps {
  redistributePayout: (tokenDisbursal: ITokenDisbursal) => void;
  acceptPayout: (tokenDisbursal: ITokenDisbursal) => void;
  acceptCombinedPayout: (tokensDisbursal: ReadonlyArray<ITokenDisbursal>) => void;
}

// TODO: move as a reusable component
const CurrencyIcon: React.FunctionComponent<{ currency: ECurrency } & CommonHtmlProps> = ({
  currency,
  className,
}) => {
  switch (currency) {
    case ECurrency.EUR_TOKEN:
      return (
        <img src={nEurIcon} alt={`${selectCurrencyCode(currency)} token`} className={className} />
      );
    case ECurrency.ETH:
      return (
        <img src={ethIcon} alt={`${selectCurrencyCode(currency)} token`} className={className} />
      );
    default:
      throw new Error(`Icon for currency ${currency} not found`);
  }
};

const AssetPortfolioLayoutNoPayouts: React.FunctionComponent = () => (
  <SectionHeader
    layoutHasDecorator={false}
    className="mb-4"
    description={<FormattedMessage id="portfolio.asset.payouts-from-neu.no-payouts" />}
  >
    <FormattedMessage id="portfolio.section.asset-portfolio.title" />
  </SectionHeader>
);

const AssetPortfolioLayout: React.FunctionComponent<ILayoutProps & IDispatchToProps> = ({
  tokensDisbursal,
  redistributePayout,
  acceptPayout,
  acceptCombinedPayout,
}) => (
  <Row className="mb-4">
    <Col md={5} lg={4} sm={12}>
      <SectionHeader layoutHasDecorator={false} className="mb-4">
        <FormattedMessage id="portfolio.section.asset-portfolio.title" />
      </SectionHeader>

      <Panel>
        <p>
          <FormattedMessage
            id="portfolio.asset.amounts-to-claim"
            values={{
              amounts: (
                <>
                  {tokensDisbursal
                    .map(t => (
                      <Money
                        key={t.token}
                        value={t.amountToBeClaimed}
                        currency={t.token}
                        theme={ETheme.GREEN_BIG}
                      />
                    ))
                    // add + between nodes
                    .reduce<React.ReactNode[]>(
                      (p, c) => (p.length === 0 ? p.concat(c) : p.concat(" + ", c)),
                      [],
                    )}
                </>
              ),
            }}
          />
        </p>
        <p className="mb-0">
          <FormattedMessage id="portfolio.asset.amounts-to-claim-description" />
        </p>
      </Panel>
    </Col>
    <Col md={7} lg={8} sm={12} className="mt-4 mt-md-0">
      <SectionHeader layoutHasDecorator={false} className="mb-4">
        <FormattedMessage id="portfolio.asset.payouts-from-neu.title" />
      </SectionHeader>

      <NewTable
        titles={[
          "", // token icon
          <FormattedMessage id="portfolio.asset.payouts-from-neu.your-share" />,
          <FormattedMessage id="portfolio.asset.payouts-from-neu.total-payout" />,
          <FormattedMessage id="portfolio.asset.payouts-from-neu.claim-by" />,
          "", // reject payout
          "", // accept payout
        ]}
      >
        {tokensDisbursal.map(tokenDisbursal => (
          <NewTableRow key={tokenDisbursal.token}>
            <>
              <CurrencyIcon currency={tokenDisbursal.token} className="mr-2" />
              {selectCurrencyCode(tokenDisbursal.token)}
            </>
            <Money
              value={tokenDisbursal.amountToBeClaimed}
              currency={tokenDisbursal.token}
              theme={ETheme.GREEN}
            />
            <Money value={tokenDisbursal.totalDisbursedAmount} currency={tokenDisbursal.token} />
            <FormattedDate value={tokenDisbursal.timeToFirstDisbursalRecycle} />
            <Button
              size={ButtonSize.SMALL}
              onClick={() => redistributePayout(tokenDisbursal)}
              layout={EButtonLayout.SECONDARY}
            >
              <FormattedMessage id="portfolio.asset.payouts-from-neu.redistribute-payout" />
            </Button>
            <Button
              theme="green"
              size={ButtonSize.SMALL}
              onClick={() => acceptPayout(tokenDisbursal)}
              layout={EButtonLayout.SECONDARY}
            >
              <FormattedMessage id="portfolio.asset.payouts-from-neu.accept-payout" />
            </Button>
          </NewTableRow>
        ))}
        <NewTableRow>
          <></>
          <></>
          <></>
          <></>
          <></>
          <Button
            theme="green"
            size={ButtonSize.SMALL}
            onClick={() => acceptCombinedPayout(tokensDisbursal)}
            layout={EButtonLayout.SECONDARY}
          >
            <FormattedMessage id="portfolio.asset.payouts-from-neu.accept-all-payout" />
          </Button>
        </NewTableRow>
      </NewTable>
    </Col>
  </Row>
);

const AssetPortfolio = compose<ILayoutProps & IDispatchToProps, IExternalProps>(
  appConnect<{}, IDispatchToProps>({
    dispatchToProps: dispatch => ({
      redistributePayout: (tokenDisbursal: ITokenDisbursal) =>
        dispatch(actions.txTransactions.startInvestorPayoutRedistribute(tokenDisbursal)),
      acceptPayout: (tokenDisbursal: ITokenDisbursal) =>
        dispatch(actions.txTransactions.startInvestorPayoutAccept([tokenDisbursal])),
      acceptCombinedPayout: (tokensDisbursal: ReadonlyArray<ITokenDisbursal>) =>
        dispatch(actions.txTransactions.startInvestorPayoutAccept(tokensDisbursal)),
    }),
  }),
  // Loading
  branch<IExternalProps>(
    ({ tokensDisbursal }) => tokensDisbursal === undefined,
    renderComponent(LoadingIndicator),
  ),
  // No payouts
  branch<ILayoutProps>(
    ({ tokensDisbursal }) => tokensDisbursal.length === 0,
    renderComponent(AssetPortfolioLayoutNoPayouts),
  ),
)(AssetPortfolioLayout);

export { AssetPortfolio };
