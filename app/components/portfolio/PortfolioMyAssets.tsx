import * as cn from "classnames";
import { isEqual } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose, lifecycle, withState } from "recompose";

import { externalRoutes } from "../../config/externalRoutes";
import { actions } from "../../modules/actions";
import { selectMyAssetsWithTokenData } from "../../modules/investor-tickets/selectors";
import { TETOWithTokenData } from "../../modules/investor-tickets/types";
import { selectNeuPriceEur } from "../../modules/shared/tokenPrice/selectors";
import { selectNeuBalance } from "../../modules/wallet/selectors";
import { appConnect } from "../../store";
import { multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { withParams } from "../../utils/withParams";
import { Button, ButtonLink, EButtonLayout } from "../shared/buttons";
import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "../shared/Money";
import { ENewTableCellLayout, NewTable, NewTableRow } from "../shared/NewTable";
import { NumberFormat } from "../shared/NumberFormat";
import { SectionHeader } from "../shared/SectionHeader";

import * as arrowRight from "../../assets/img/inline_icons/arrow_right.svg";
import * as neuIcon from "../../assets/img/neu_icon.svg";
import * as styles from "./PortfolioLayout.module.scss";

interface IExternalProps {
  isRetailEto: boolean;
  walletAddress: string;
}

interface IStateProps {
  myNeuBalance: string;
  neuPrice: string;
  neuValue: string;
  myAssets: TETOWithTokenData[];
}

interface IDispatchProps {
  showDownloadAgreementModal: (etoId: string, isRetailEto: boolean) => void;
  loadTokensData: (walletAddress: string) => void;
}

interface IAdditionalProps {
  tokenLoaded: boolean;
  setTokenLoaded: (value: boolean) => void;
}

type TComponentProps = IExternalProps & IStateProps & IDispatchProps & IAdditionalProps;

const PortfolioMyAssetsComponent: React.FunctionComponent<TComponentProps> = ({
  myNeuBalance,
  myAssets,
  neuPrice,
  neuValue,
  showDownloadAgreementModal,
  isRetailEto,
  walletAddress,
}) => (
  <>
    <SectionHeader
      layoutHasDecorator={false}
      className="mb-4"
      description={<FormattedMessage id="portfolio.section.your-assets.description" />}
    >
      <FormattedMessage id="portfolio.section.your-assets.title" />
    </SectionHeader>

    <Row>
      <Col>
        <NewTable
          placeholder={<FormattedMessage id="portfolio.section.your-assets.table.placeholder" />}
          titles={[
            <FormattedMessage id="portfolio.section.my-assets.table.header.token" />,
            <FormattedMessage id="portfolio.section.my-assets.table.header.quantity" />,
            <FormattedMessage id="portfolio.section.my-assets.table.header.current-value" />,
            <FormattedMessage id="portfolio.section.my-assets.table.header.current-price" />,
            "",
          ]}
        >
          {myNeuBalance !== "0" ? (
            <NewTableRow cellLayout={ENewTableCellLayout.MIDDLE}>
              <>
                <img src={neuIcon} alt="" className={cn("mr-2", styles.token)} />
                <span>{"NEU"}</span>
              </>
              <Money
                value={myNeuBalance}
                currency={ECurrency.NEU}
                currencySymbol={ECurrencySymbol.NONE}
              />
              <Money
                value={neuValue}
                currency={ECurrency.EUR}
                currencySymbol={ECurrencySymbol.SYMBOL}
              />
              <Money
                value={neuPrice}
                currency={ECurrency.EUR}
                format={EMoneyFormat.FLOAT}
                currencySymbol={ECurrencySymbol.SYMBOL}
                isPrice={true}
              />
              <ButtonLink
                to={withParams(externalRoutes.commitmentStatus, { walletAddress })}
                layout={EButtonLayout.SECONDARY}
                iconPosition="icon-after"
                svgIcon={arrowRight}
                innerClassName={cn(styles.actionButton, "p-0")}
              >
                <FormattedMessage id="portfolio.section.my-assets.download-agreements" />
              </ButtonLink>
            </NewTableRow>
          ) : null}

          {myAssets &&
            myAssets
              .filter(v => v.tokenData)
              .filter(v => v.tokenData.balance !== "0")
              .map(({ equityTokenImage, equityTokenName, etoId, tokenData, equityTokenSymbol }) => {
                return (
                  <NewTableRow key={etoId} cellLayout={ENewTableCellLayout.MIDDLE}>
                    <>
                      <img src={equityTokenImage} alt="" className={cn("mr-2", styles.token)} />
                      <span className={styles.tokenName}>
                        {equityTokenName} ({equityTokenSymbol})
                      </span>
                    </>
                    <NumberFormat value={tokenData.balance} />
                    <Money
                      value={multiplyBigNumbers([tokenData.tokenPrice, tokenData.balance])}
                      currency={ECurrency.EUR}
                      currencySymbol={ECurrencySymbol.SYMBOL}
                    />
                    <Money
                      value={tokenData.tokenPrice}
                      currency={ECurrency.EUR}
                      isPrice={true}
                      currencySymbol={ECurrencySymbol.SYMBOL}
                    />
                    <Button
                      onClick={() => showDownloadAgreementModal(etoId, isRetailEto)}
                      layout={EButtonLayout.SECONDARY}
                      iconPosition="icon-after"
                      svgIcon={arrowRight}
                      innerClassName={cn(styles.actionButton, "p-0")}
                    >
                      <FormattedMessage id="portfolio.section.my-assets.download-agreements" />
                    </Button>
                  </NewTableRow>
                );
              })}
        </NewTable>
      </Col>
    </Row>
  </>
);

const PortfolioMyAssets = compose<TComponentProps, IExternalProps>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const neuPrice = selectNeuPriceEur(state);
      const myNeuBalance = selectNeuBalance(state.wallet);

      return {
        myNeuBalance,
        neuPrice,
        neuValue: multiplyBigNumbers([myNeuBalance, neuPrice]),
        myAssets: selectMyAssetsWithTokenData(state)!,
      };
    },
    dispatchToProps: dispatch => ({
      showDownloadAgreementModal: (etoId: string, isRetailEto: boolean) => {
        dispatch(actions.portfolio.showDownloadAgreementModal(etoId, isRetailEto));
      },
      loadTokensData: (walletAddress: string) => {
        dispatch(actions.publicEtos.loadTokensData(walletAddress));
      },
    }),
  }),
  withState("tokenLoaded", "setTokenLoaded", false),
  lifecycle<TComponentProps, IStateProps>({
    componentDidUpdate(prevProps): void {
      const prevAssets = prevProps.myAssets;
      const actualAssets = this.props.myAssets;

      if (this.props.myAssets.length === 0 && prevProps.myAssets.length > 0) {
        this.props.setTokenLoaded(false);
        return;
      }

      if (
        (!this.props.tokenLoaded &&
          this.props.myAssets.length > 0 &&
          isEqual(prevAssets, actualAssets)) ||
        (this.props.myAssets.length > 0 && !isEqual(prevAssets, actualAssets))
      ) {
        this.props.loadTokensData(this.props.walletAddress);
        this.props.setTokenLoaded(true);
      }
    },
  }),
)(PortfolioMyAssetsComponent);

export { PortfolioMyAssets };
