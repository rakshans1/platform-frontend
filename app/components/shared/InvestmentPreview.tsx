import * as React from "react";
import { FormattedPlural } from "react-intl";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { Button, ButtonLink, EButtonLayout } from "./buttons";
import { ECurrency, Money } from "./Money";
import { PercentageIndicatorBar } from "./PercentageIndicatorBar";
import { ITag, Tag } from "./Tag";

import * as styles from "./InvestmentPreview.module.scss";

interface IPreFoundingStatus {
  money: string;
  investorsNum: number;
  leadInvestors: string[];
}

interface IProps {
  neuInvestorsNum: number;
  company: string;
  endInDays: number;
  tags: ITag[];
  detailsLink: string;
  preFoundingStatus: IPreFoundingStatus;
  hasStarted: boolean;
  startingOn: string;
  moneyGoal: string;
  currentValuation: string;
  tokenPrice: string;
  linkToDetails: string;
  className?: string;
  handleEmailSend: () => void;
}

export const InvestmentPreview: React.FunctionComponent<IProps> = ({
  company,
  tags,
  preFoundingStatus,
  hasStarted,
  handleEmailSend,
  endInDays,
  startingOn,
  neuInvestorsNum,
  moneyGoal,
  currentValuation,
  tokenPrice,
  linkToDetails,
  className,
}) => {
  return (
    <article
      className={`${styles.investmentPreview} ${hasStarted ? "has-started" : ""} ${className}`}
    >
      <div className={styles.logoWrapper}>
        <img src="" srcSet="" alt="" />
      </div>
      <div className={styles.companyDetails}>
        <h4 className={styles.companyName}>{company}</h4>
        <div>
          {tags.map((tag, i) => (
            <Tag key={i} {...tag} />
          ))}
        </div>
      </div>
      <div className={styles.preFundingStatus}>
        <h5 className={styles.label}>
          <FormattedMessage id="shared-component.investment-preview.pre-funding-status" />
        </h5>
        <div className={styles.preFundingWrapper}>
          <p>
            <FormattedMessage id="shared-component.investment-preview.pre-money" />
            <strong className={styles.hilight}> {preFoundingStatus.money}</strong>
          </p>
          <p>
            <FormattedMessage id="shared-component.investment-preview.investors" />
            <strong className={styles.hilight}> {preFoundingStatus.investorsNum}</strong>
          </p>
          <p>
            <FormattedMessage id="shared-component.investment-preview.lead-investors" />
          </p>
          {preFoundingStatus.leadInvestors.map((investor, i) => (
            <strong key={i} className={styles.lead}>
              {investor}
            </strong>
          ))}
        </div>
      </div>
      <div className={styles.termsAndEto}>
        <div className={styles.labels}>
          <h5 className={styles.label}>
            {hasStarted && <FormattedMessage id="shared-component.investment-preview.terms" />}
          </h5>
          <h5 className={styles.label}>
            {hasStarted && <FormattedMessage id="shared-component.investment-preview.status" />}
          </h5>
        </div>
        <div className={styles.background}>
          {hasStarted ? (
            <>
              <div className={styles.terms}>
                <p>
                  <FormattedMessage id="shared-component.investment-preview.goal" />
                  <strong className={styles.hilight}> {moneyGoal}</strong>
                </p>
                <p>
                  <FormattedMessage id="shared-component.investment-preview.current-valuation" />
                  <strong className={styles.hilight}> {currentValuation}</strong>
                </p>
                <p>
                  <FormattedMessage id="shared-component.investment-preview.token-price" />
                  <strong className={styles.hilight}> {tokenPrice}</strong>
                </p>
              </div>
              <div className={styles.eto}>
                <div>
                  <FormattedHTMLMessage
                    tagName="span"
                    id="shared-component.investment-preview.investment-timeline"
                    values={{
                      endInDays: endInDays,
                      neuInvestors: neuInvestorsNum,
                    }}
                  />{" "}
                  <FormattedPlural
                    value={endInDays}
                    one={<FormattedMessage id="general.word.day" />}
                    other={<FormattedMessage id="general.word.days" />}
                  />
                </div>
                <PercentageIndicatorBar percent={25} className="my-2" />
                <strong>
                  <Money
                    currency={ECurrency.EUR_TOKEN}
                    value="123456000000000000000000"
                    theme="t-green"
                  />
                </strong>
              </div>
            </>
          ) : (
            <>
              <span>
                <FormattedMessage
                  id="shared-component.investment-preview.starting-date"
                  values={{
                    startingOn: startingOn,
                  }}
                />
              </span>
              <Button layout={EButtonLayout.SECONDARY} onClick={() => handleEmailSend}>
                <FormattedMessage id="shared-component.investment-preview.get-notification" />
              </Button>
            </>
          )}
        </div>
      </div>
      <ButtonLink to={linkToDetails} layout={EButtonLayout.SECONDARY}>
        <FormattedMessage id="shared-component.investment-preview.details" />
      </ButtonLink>
    </article>
  );
};
