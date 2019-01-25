import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName, withProps } from "recompose";
import { compose } from "redux";

import { IPledge } from "../../../../../lib/api/eto/EtoPledgeApi.interfaces";
import { actions } from "../../../../../modules/actions";
import { selectIsInvestor, selectIsVerifiedInvestor } from "../../../../../modules/auth/selectors";
import {
  selectBookbuildingStats,
  selectMyPledge,
} from "../../../../../modules/bookbuilding-flow/selectors";
import { EETOStateOnChain } from "../../../../../modules/public-etos/types";
import { appConnect } from "../../../../../store";
import { onEnterAction } from "../../../../../utils/OnEnterAction";
import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "../../../../shared/Money";
import { CounterWidget } from "../index";
import { Message } from "../Message";
import { CampaigningActivatedInvestorApprovedWidget } from "./CampaigningActivatedInvestorApprovedWidget";

import { appRoutes } from "../../../../appRoutes";
import { ButtonLink } from "../../../../shared/buttons";
import { Tooltip } from "../../../../shared/Tooltip";
import * as styles from "../EtoOverviewStatus.module.scss";

export interface IExternalProps {
  etoId: string;
  investorsLimit: number;
  minPledge: number;
  maxPledge?: number;
  nextState: EETOStateOnChain;
  nextStateStartDate?: Date;
  isActive: boolean;
  keyQuoteFounder: string;
}

interface IStateProps {
  pledgedAmount: number | null;
  investorsCount: number;
  isInvestor: boolean;
  pledge?: IPledge;
  isVerifiedInvestor: boolean;
}

interface IWithProps {
  isInvestorsLimitReached: boolean;
  isWaitingForNextStateToStart: boolean;
}

type IProps = IWithProps & IExternalProps & IStateProps;

const CampaigningActivatedWidgetComponent: React.FunctionComponent<IProps> = ({
  investorsLimit,
  pledgedAmount,
  investorsCount,
  isInvestor,
  etoId,
  minPledge,
  maxPledge,
  isInvestorsLimitReached,
  nextState,
  nextStateStartDate,
  isWaitingForNextStateToStart,
  isActive,
  keyQuoteFounder,
  pledge,
  isVerifiedInvestor,
}) => {
  if (isActive && !isInvestorsLimitReached) {
    return (
      <>
        <div className={styles.groupWrapper}>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="eto-overview.campaigning.whitelist-status" />
            </span>
            <span className={styles.value}>
              {pledge ? (
                <FormattedMessage id="eto-overview.campaigning.whitelist-status.label-subscribed" />
              ) : (
                <>
                  <FormattedMessage id="eto-overview.campaigning.whitelist-status.label-not-subscribed" />
                  <Tooltip
                    content={
                      <FormattedHTMLMessage
                        tagName="div"
                        id="eto-overview.campaigning.whitelist-status.label-not-subscribed-description-text"
                      />
                    }
                  />
                </>
              )}
            </span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview.amount-backed" />
            </span>
            <span className={styles.value} data-test-id="eto-bookbuilding-amount-backed">
              <Money
                value={pledgedAmount}
                currency={ECurrency.EUR}
                format={EMoneyFormat.FLOAT}
                currencySymbol={ECurrencySymbol.SYMBOL}
              />
            </span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview.investors-backed" />
            </span>
            <span className={styles.value}>
              <span data-test-id="eto-bookbuilding-remaining-slots">
                {investorsCount !== null ? investorsLimit - investorsCount : investorsLimit}
              </span>{" "}
              out of {investorsLimit} slots remaining
              {/* TODO: Move to translations once the format is stable */}
            </span>
          </div>
          {isInvestor &&
            isVerifiedInvestor && (
              <CampaigningActivatedInvestorApprovedWidget
                etoId={etoId}
                minPledge={minPledge}
                maxPledge={maxPledge}
                pledge={pledge}
              />
            )}
        </div>
        {isInvestor &&
          !isVerifiedInvestor && (
            <ButtonLink
              innerClassName="mb-3"
              to={appRoutes.profile}
              data-test-id="eto-overview-settings-update-required-to-invest"
            >
              <FormattedMessage id="shared-component.eto-overview.verify-to-whitelist" />
            </ButtonLink>
          )}
      </>
    );
  }

  if (isWaitingForNextStateToStart) {
    return (
      <>
        {isInvestorsLimitReached && (
          <Message
            showTick={false}
            title={<FormattedMessage id="shared-component.eto-overview.whitelist.success" />}
            summary={
              <FormattedMessage
                id="shared-component.eto-overview.whitelist.success.summary"
                values={{
                  totalAmount: (
                    <Money
                      value={pledgedAmount}
                      currency={ECurrency.EUR}
                      currencySymbol={ECurrencySymbol.SYMBOL}
                      format={EMoneyFormat.FLOAT}
                    />
                  ),
                  totalInvestors: investorsCount,
                }}
              />
            }
          />
        )}
        <CounterWidget endDate={nextStateStartDate!} state={nextState} />
      </>
    );
  }

  return (
    <div data-test-id="eto-overview-status-founders-quote" className={styles.quote}>
      {keyQuoteFounder}
    </div>
  );
};

const CampaigningActivatedWidget = compose<React.FunctionComponent<IExternalProps>>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: (state, props) => {
      const stats = selectBookbuildingStats(state, props.etoId);

      return {
        isInvestor: selectIsInvestor(state),
        isVerifiedInvestor: selectIsVerifiedInvestor(state),
        pledgedAmount: stats ? stats.pledgedAmount : null,
        investorsCount: stats ? stats.investorsCount : 0,
        pledge: selectMyPledge(state, props.etoId),
      };
    },
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.bookBuilding.loadBookBuildingStats(props.etoId));

      if (props.isInvestor && props.isVerifiedInvestor) {
        dispatch(actions.bookBuilding.loadPledge(props.etoId));
      }
    },
  }),
  withProps<IWithProps, IStateProps & IExternalProps>(
    ({ pledge, isInvestor, investorsLimit, investorsCount, nextStateStartDate }) => {
      const count =
        isInvestor && pledge && investorsCount !== 0 ? investorsCount - 1 : investorsCount;

      return {
        isInvestorsLimitReached: count >= investorsLimit,
        isWaitingForNextStateToStart: !!nextStateStartDate && nextStateStartDate > new Date(),
      };
    },
  ),
  setDisplayName("CampaigningActivatedWidget"),
)(CampaigningActivatedWidgetComponent);

export { CampaigningActivatedWidget, CampaigningActivatedWidgetComponent };
