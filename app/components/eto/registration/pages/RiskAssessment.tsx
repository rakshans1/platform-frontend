import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoRiskAssessmentType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectIssuerCompany } from "../../../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../../../modules/eto-flow/types";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormFieldBoolean, FormTextArea } from "../../../shared/forms";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";
import * as styles from "../Shared.module.scss";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps & FormikProps<TPartialCompanyEtoData>;

const EtoRegistrationRiskAssessmentComponent = (props: IProps) => {
  return (
    <EtoFormBase title="Risk Assessment" validator={EtoRiskAssessmentType.toYup()}>
      <Section>
        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.risk-assessment.liquidity-description" />}
          placeholder="Describe"
          name="riskLiquidityDescription"
        />

        <div className="form-group">
          <FormFieldBoolean
            name="riskNoThirdPartyDependency"
            label={<FormattedMessage id="eto.form.risk-assessment.no-third-parties" />}
            disabled={true}
          />
        </div>

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.risk-assessment.third-parties-description" />}
          placeholder="Describe"
          name="riskThirdPartyDescription"
        />

        <FormTextArea
          className="my-2"
          label={
            <FormattedMessage id="eto.form.risk-assessment.third-party-financing-description" />
          }
          placeholder="Describe"
          name="riskThirdPartySharesFinancing"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.risk-assessment.business-model" />}
          placeholder="Describe"
          name="riskBusinessModelDescription"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.risk-assessment.max-risk-description" />}
          placeholder="Describe"
          name="riskMaxDescription"
        />

        <div className="form-group">
          <FormFieldBoolean
            name="riskNotRegulatedBusiness"
            label={<FormattedMessage id="eto.form.risk-assessment.no-regulation" />}
            disabled={true}
          />
        </div>

        <div className="form-group">
          <FormFieldBoolean
            name="riskNoLoansExist"
            label={<FormattedMessage id="eto.form.risk-assessment.no-loans" />}
            disabled={true}
          />
        </div>
      </Section>
      <Section className={styles.buttonSection}>
        <Button
          layout={EButtonLayout.PRIMARY}
          type="submit"
          isLoading={props.savingData}
          data-test-id="eto-registration-risk-submit"
        >
          <FormattedMessage id="form.button.save" />
        </Button>
      </Section>
    </EtoFormBase>
  );
};

const EtoRegistrationRiskAssessment = compose<React.FunctionComponent>(
  setDisplayName(EEtoFormTypes.EtoRiskAssessment),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerCompany(s) as TPartialCompanyEtoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialCompanyEtoData) => {
        dispatch(
          actions.etoFlow.saveDataStart({
            companyData: data,
            etoData: {},
          }),
        );
      },
    }),
  }),
  withFormik<IStateProps & IDispatchProps, TPartialCompanyEtoData>({
    validationSchema: EtoRiskAssessmentType.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoRegistrationRiskAssessmentComponent);

export { EtoRegistrationRiskAssessmentComponent, EtoRegistrationRiskAssessment };
