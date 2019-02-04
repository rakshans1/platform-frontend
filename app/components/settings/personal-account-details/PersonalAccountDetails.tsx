import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { externalRoutes } from "../../../config/externalRoutes";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button, EButtonLayout } from "../../shared/buttons";
import { Panel } from "../../shared/Panel";
import { ResponsiveImage } from "../../shared/ResponsiveImage";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as personImage from "../../../assets/img/person@3x.png";
import * as styles from "./PersonalAccountDetails.module.scss";

interface IStateProps {
  personalData: {
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    birthDate?: string;
    zipCode?: string;
    country?: string;
    isHighIncome?: boolean;
  };
}

interface IOwnState {
  isDataHidden: boolean;
}

interface IRecordProps {
  label: TTranslatedString;
  value: TTranslatedString;
}

const Record: React.FunctionComponent<IRecordProps> = ({ value, label }) => {
  return (
    <div className={styles.record}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
};

class AccountDetailsComponent extends React.Component<IStateProps, IOwnState> {
  state = {
    isDataHidden: true,
  };

  private toggleDataVisibility = (): void => {
    this.setState(state => ({ isDataHidden: !state.isDataHidden }));
  };

  render(): React.ReactNode {
    const { isDataHidden } = this.state;
    const { personalData } = this.props;

    return (
      <Panel
        className="h-100"
        headerText={<FormattedMessage id="settings.account-details.title" />}
        rightComponent={
          <ResponsiveImage
            theme="transparent"
            srcSet={{ "1x": personImage }}
            alt="person image"
            className={styles.image}
          />
        }
      >
        <div className={styles.content}>
          <div>
            {personalData.firstName &&
              personalData.lastName && (
                <Record
                  label={<FormattedMessage id="settings.account-details.full-name" />}
                  value={`${personalData.firstName} ${personalData.lastName}`}
                />
              )}
            {!isDataHidden && (
              <>
                {personalData.birthDate && (
                  <Record
                    label={<FormattedMessage id="settings.account-details.date-of-birth" />}
                    value={personalData.birthDate}
                  />
                )}
                {personalData.street &&
                  personalData.city &&
                  personalData.zipCode &&
                  personalData.country && (
                    <Record
                      label={<FormattedMessage id="settings.account-details.address" />}
                      value={`${personalData.street}, ${personalData.city} ${
                        personalData.zipCode
                      }, ${personalData.country}`}
                    />
                  )}
                <Record
                  label={<FormattedMessage id="settings.account-details.income" />}
                  value={personalData.isHighIncome ? "yes" : "no"}
                />
              </>
            )}
            <div className={styles.explanation}>
              <FormattedHTMLMessage
                tagName="span"
                id="settings.account-details.explanation"
                values={{ href: `${externalRoutes.neufundSupport}/home` }}
              />
            </div>
          </div>
          <div className="text-center">
            <Button
              iconPosition="icon-after"
              svgIcon={arrowRight}
              layout={EButtonLayout.SECONDARY}
              onClick={this.toggleDataVisibility}
            >
              {isDataHidden ? (
                <FormattedMessage id="settings.account-details.button-show" />
              ) : (
                <FormattedMessage id="settings.account-details.button-hide" />
              )}
            </Button>
          </div>
        </div>
      </Panel>
    );
  }
}

export const PersonalAccountDetails = compose<React.FunctionComponent>(
  appConnect<IStateProps>({
    stateToProps: s => ({
      personalData: s.kyc.individualData || {},
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualData()),
  }),
)(AccountDetailsComponent);
