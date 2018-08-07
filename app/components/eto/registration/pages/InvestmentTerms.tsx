import { FormikProps, withFormik } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoTermsType, TPartialEtoSpecData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button } from "../../../shared/Buttons";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { FormField, FormTextArea } from "../../../shared/forms/forms";
import { EtoFormBase } from "../EtoFormBase";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialEtoSpecData;
}

interface IDispatchProps {
  saveData: (values: TPartialEtoSpecData) => void;
}

type IProps = IStateProps & IDispatchProps;


class EtoForm extends React.Component<FormikProps<TPartialEtoSpecData> & IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render (): React.ReactNode {
    const { stateValues } = this.props;
    const fullyDilutedPreMoneyValuationEur = stateValues.fullyDilutedPreMoneyValuationEur || 1;
    const existingCompanyShares = stateValues.existingCompanyShares || 1;
    const newSharesToIssue = stateValues.newSharesToIssue || 1;
    const equityTokensPerShare = stateValues.equityTokensPerShare || 1;
    const minimumNewSharesToIssue = stateValues.minimumNewSharesToIssue || 0;

    const computedNewSharePrice = fullyDilutedPreMoneyValuationEur / existingCompanyShares;
    const computedMinNumberOfTokens = newSharesToIssue * equityTokensPerShare;
    const computedMaxNumberOfTokens = minimumNewSharesToIssue * equityTokensPerShare;
    const computedMinCapEur = computedNewSharePrice * newSharesToIssue;
    const computedMaxCapEur = computedNewSharePrice * minimumNewSharesToIssue;

    return (
      <EtoFormBase
        title={<FormattedMessage id="eto.form.investment-terms.title" />}
        validator={EtoTermsType.toYup()}
      >
        <FormField
          label={
            <FormattedMessage id="eto.form.section.investment-terms.fully-diluted-pre-money-valuation" />
          }
          placeholder=" "
          prefix="€"
          name="fullyDilutedPreMoneyValuationEur"
          type="number"
          min="1"
        />
        <FormField
          label={<FormattedMessage id="eto.form.section.investment-terms.existing-shares" />}
          placeholder="Number of existing shares"
          name="existingCompanyShares"
          type="number"
          min="1"
        />
        <FormField
          label={
            <FormattedMessage id="eto.form.section.investment-terms.minimum-new-shares-to-issue" />
          }
          placeholder="Number of share"
          name="minimumNewSharesToIssue"
          type="number"
          min="0"
        />
        <FormField
          label={
            <FormattedMessage id="eto.form.section.investment-terms.maximum-new-shares-to-issue" />
          }
          placeholder="Number of share"
          name="newSharesToIssue"
          type="number"
          min="1"
        />

        <FormHighlightGroup>
          <FormField
            label={<FormattedMessage id="eto.form.section.investment-terms.new-share-price" />}
            placeholder="1/1000000 of share price auto complete"
            name="newSharePrice"
            value={computedNewSharePrice}
            disabled
          />
          <Row>
            <Col sm={12} md={6} className="mb-4">
              <FormField
                label={<FormattedMessage id="eto.form.section.investment-terms.minimum-amount" />}
                prefix="€"
                placeholder="read only"
                name="minNumberOfTokens"
                value={computedMinNumberOfTokens}
                disabled
              />
            </Col>
            <Col sm={12} md={6} className="mb-4">
              <FormField
                label={<FormattedMessage id="eto.form.section.investment-terms.maximum-amount" />}
                prefix="€"
                placeholder="read only"
                name="maxNumberOfTokens"
                value={computedMaxNumberOfTokens}
                disabled
              />
            </Col>
            <Col sm={12} md={6}>
              <FormField
                label={
                  <FormattedMessage id="eto.form.section.investment-terms.minimum-token-cap" />
                }
                prefix="€"
                placeholder="read only"
                name="minCapEur"
                value={computedMinCapEur}
                disabled
              />
            </Col>
            <Col sm={12} md={6}>
              <FormField
                label={
                  <FormattedMessage id="eto.form.section.investment-terms.maximum-token-cap" />
                }
                prefix="€"
                placeholder="read only"
                name="maxCapEur"
                value={computedMaxCapEur}
                disabled
              />
            </Col>
          </Row>
        </FormHighlightGroup>

        <FormTextArea
          name="discountScheme"
          label={
            <FormattedMessage id="eto.form.section.investment-terms.token-discount-for-whitelisted" />
          }
          placeholder=" "
          charactersLimit={250}
        />
        <FormField
          label={<FormattedMessage id="eto.form.section.investment-terms.share-nominal-value" />}
          placeholder="1"
          prefix="€"
          name="shareNominalValueEur"
          type="number"
          min="1"
        />
        <Col>
          <Row className="justify-content-end">
            <Button
              layout="primary"
              className="mr-4"
              type="submit"
              onClick={() => {
                this.props.saveData(this.props.values);
              }}
              isLoading={this.props.savingData}
            >
              <FormattedMessage id="form.button.save" />
            </Button>
          </Row>
        </Col>
      </EtoFormBase>
    );
  }
}

const EtoEnhancedForm = withFormik<IProps, TPartialEtoSpecData>({
  validationSchema: EtoTermsType.toYup(),
  mapPropsToValues: props => props.stateValues,
  handleSubmit: (values, props) => props.props.saveData(values),
})(EtoForm);

export const EtoRegistrationTermsComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationTerms = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: s.etoFlow.etoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialEtoSpecData) => {
        data.isCrowdfunding = false; // Temporary solution - overrides checked value
        dispatch(
          actions.etoFlow.saveDataStart({
            companyData: {},
            etoData: {
              ...data,
            },
          }),
        );
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => { },
  }),
)(EtoRegistrationTermsComponent);
