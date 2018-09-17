import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps } from "../../../../types";
import { ProjectStatus, TStatus } from "../../../shared/ProjectStatus";
import { Tag } from "../../../shared/Tag";

import { Button } from "../../../shared/Buttons";
import { Counter } from "../../../shared/Counter";
import { PercentageIndicatorBar } from "../../../shared/PercentageIndicatorBar";
import { IResponsiveImage, ResponsiveImage } from "../../../shared/ResponsiveImage";
import { SuccessTick } from "../../../shared/SuccessTick";
import { CampaigningWidget, ICampaigningWidget } from "./CampaigningWidget/CampaigningWidget";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IPublicWidget {
  endInDays: number;
  investorsBacked: number;
  tokensGoal: number;
  raisedTokens: number;
  raisedETH: number | string;
  raisedNEUR: number | string;
}

interface IProps {
  etoId: string;
  prospectusApproved: boolean;
  preMoneyValuation: string;
  investmentAmount: string;
  newSharesGenerated: string;
  equityTokenPrice: string;
  publicWidget?: IPublicWidget;
  campaigningWidget?: ICampaigningWidget;
}

interface IClaimWidget {
  tokenName: string;
  numberOfInvestors: number;
  raisedAmount: string | number;
  timeToClaim: number;
}

const ClaimWidget: React.SFC<IClaimWidget> = ({
  tokenName,
  numberOfInvestors,
  raisedAmount,
  timeToClaim,
}) => (
  <div className={styles.widgetClaim}>
    <SuccessTick />
    <div className={styles.message}>
      <FormattedMessage id="shared-component.eto-overview.success" />
      <div>
        <FormattedMessage id="shared-component.eto-overview.success.equivalent-to" />
        {` €${raisedAmount} `}
        <FormattedMessage id="shared-component.eto-overview.success.raised-by" />
        {` ${numberOfInvestors} `}
        <FormattedMessage id="shared-component.eto-overview.success.investors" />
      </div>
    </div>
    {timeToClaim === 0 ? (
      <Button>
        <FormattedMessage id="shared-component.eto-overview.claim-your-token" /> {tokenName}
      </Button>
    ) : (
      <p>
        <FormattedMessage
          id="shared-component.eto-overview.claim-your-token-sign-in"
          values={{ timeToClaim, tokenName }}
        />
      </p>
    )}
  </div>
);

const RefundWidget: React.SFC = () => (
  <div className={styles.widgetClaim}>
    <div className={styles.message}>
      <FormattedMessage id="shared-component.eto-overview.refund" />
    </div>
    <Button>
      <FormattedMessage id="shared-component.eto-overview.claim-your-eth-neur" />
    </Button>
  </div>
);

const PreEtoWidget: React.SFC = () => (
  <div className={styles.widgetPreEto}>
    <div className={styles.title}>
      <FormattedMessage id="shared-component.eto-overview.count-down-to-eto" />
    </div>
    <div className={styles.zone}>UTC 22/07/2019</div>
    <Counter endDate={Date.now() + 86400000} />
  </div>
);

const PublicEtoWidget: React.SFC<IPublicWidget> = ({
  endInDays,
  investorsBacked,
  tokensGoal,
  raisedTokens,
  raisedETH,
  raisedNEUR,
}) => {
  return (
    <div className={styles.widgetPublicEto}>
      <div className={styles.header}>
        <div>
          <div>{raisedETH} ETH</div>
          <div>{raisedNEUR} nEUR</div>
        </div>
        <div>
          {`${investorsBacked} `}
          <FormattedMessage id="shared-component.eto-overview.investors" />
        </div>
      </div>
      <PercentageIndicatorBar
        theme="green"
        layout="narrow"
        className="my-2"
        fraction={raisedTokens / tokensGoal}
      />
      <div>
        {raisedTokens} / {tokensGoal} nEUR
      </div>
      <div className={styles.investNowButton}>
        <Button onClick={() => {}}>
          <FormattedMessage id="shared-component.eto-overview.invest-now" />
        </Button>
      </div>
      <div className={styles.endsIn}>
        <FormattedMessage id="shared-component.eto-overview.ends-in" values={{ endInDays }} />
      </div>
    </div>
  );
};

interface ITokenSymbolWidgetProps {
  tokenImage: IResponsiveImage;
  tokenName: string;
  tokenSymbol: string;
}

const WidgetTokenSymbol: React.SFC<ITokenSymbolWidgetProps> = ({
  tokenSymbol,
  tokenName,
  tokenImage,
}) => {
  return (
    <div className={styles.widgetTokenSymbol}>
      <div className={styles.tokenImageWrapper}>
        <ResponsiveImage {...tokenImage} className={styles.tokenImage} />
      </div>
      <div>
        <h3 className={styles.tokenName}>{tokenName}</h3>
        <h4 className={styles.tokenSymbol}>{tokenSymbol}</h4>
      </div>
    </div>
  );
};

interface IStatusOfEto {
  status: TStatus;
}

const StatusOfEto: React.SFC<IStatusOfEto> = ({ status }) => {
  return (
    <div className={styles.statusOfEto}>
      <span className={styles.title}>
        <FormattedMessage id="shared-component.eto-overview.status-of-eto" />
      </span>
      <ProjectStatus status={status} />
    </div>
  );
};

const PoweredByNeufund = () => {
  return (
    <div className={styles.poweredByNeufund}>
      <div className={styles.powered}>Powered by</div>
      <div className={styles.neufund}>NEUFUND</div>
    </div>
  );
};

interface IWidgetTags {
  termSheet: boolean;
  prospectusApproved: boolean;
  smartContractOnchain: boolean;
}

const WidgetTags: React.SFC<IWidgetTags> = ({
  termSheet,
  prospectusApproved,
  smartContractOnchain,
}) => {
  return (
    <>
      {termSheet && (
        <Tag
          size="small"
          theme="green"
          layout="ghost"
          text={<FormattedMessage id="shared-component.eto-overview.term-sheet" />}
        />
      )}
      {prospectusApproved && (
        <Tag
          size="small"
          theme="green"
          layout="ghost"
          text={<FormattedMessage id="shared-component.eto-overview.prospectus-approved" />}
        />
      )}
      {smartContractOnchain && (
        <Tag
          size="small"
          theme="green"
          layout="ghost"
          text={<FormattedMessage id="shared-component.eto-overview.smart-contract-on-chain" />}
        />
      )}
    </>
  );
};

const EtoOverviewStatus: React.SFC<
  IProps & ITokenSymbolWidgetProps & IStatusOfEto & IWidgetTags & IClaimWidget & CommonHtmlProps
> = props => {
  const hasTags = props.termSheet || props.prospectusApproved || props.smartContractOnchain;

  return (
    <div className={cn(styles.etoOverviewStatus, props.className)}>
      <div className={styles.overviewWrapper}>
        <div className={styles.statusWrapper}>
          <StatusOfEto status={props.status} />

          <WidgetTokenSymbol
            tokenImage={props.tokenImage}
            tokenName={props.tokenName}
            tokenSymbol={props.tokenSymbol}
          />

          <PoweredByNeufund />
        </div>

        <div className={styles.divider} />

        {hasTags && (
          <div className={styles.tagsWrapper}>
            <WidgetTags
              termSheet={props.termSheet}
              prospectusApproved={props.prospectusApproved}
              smartContractOnchain={props.smartContractOnchain}
            />
          </div>
        )}

        <div className={styles.divider} />

        <div className={styles.detailsWrapper}>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.pre-money-valuation" />
            </span>
            <span className={styles.value}>{props.preMoneyValuation}</span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.investment-amount" />
            </span>
            <span className={styles.value}>{props.investmentAmount}</span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.new-shares-generated" />
            </span>
            <span className={styles.value}>{props.newSharesGenerated}</span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.equity-token-price" />
            </span>
            <span className={styles.value}>{props.equityTokenPrice}</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.stageContentWrapper}>
          {props.status === "campaigning" &&
            props.campaigningWidget && (
              <CampaigningWidget
                etoId={props.etoId}
                minPledge={props.campaigningWidget.minPledge}
                maxPledge={props.campaigningWidget.maxPledge}
                isActivated={props.campaigningWidget.isActivated}
                quote={props.campaigningWidget.quote}
                investorsLimit={props.campaigningWidget.investorsLimit}
              />
            )}
          {props.status === "pre-eto" && <PreEtoWidget />}
          {props.status === "public-eto" && (
            <PublicEtoWidget
              raisedETH={props.publicWidget!.raisedETH}
              raisedNEUR={props.publicWidget!.raisedNEUR}
              endInDays={props.publicWidget!.endInDays}
              investorsBacked={props.publicWidget!.investorsBacked}
              tokensGoal={props.publicWidget!.tokensGoal}
              raisedTokens={props.publicWidget!.raisedTokens}
            />
          )}
          {props.status === "in-signing" && (
            <ClaimWidget
              tokenName={props.tokenName}
              numberOfInvestors={props.numberOfInvestors}
              raisedAmount={props.raisedAmount}
              timeToClaim={props.timeToClaim}
            />
          )}
          {props.status === "claim" && (
            <ClaimWidget
              tokenName={props.tokenName}
              numberOfInvestors={props.numberOfInvestors}
              raisedAmount={props.raisedAmount}
              timeToClaim={props.timeToClaim}
            />
          )}
          {props.status === "refund" && <RefundWidget />}
        </div>
      </div>
    </div>
  );
};

export { EtoOverviewStatus };