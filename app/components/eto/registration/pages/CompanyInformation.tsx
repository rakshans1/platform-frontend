import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoCompanyInformationType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectIssuerCompany } from "../../../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../../../modules/eto-flow/types";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormField, FormTextArea } from "../../../shared/forms";
import { FormSingleFileUpload } from "../../../shared/forms/fields/FormSingleFileUpload";
import { EtoTagWidget, generateTagOptions } from "../../shared/EtoTagWidget";
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

const tagList = ["Science", "Technology", "Blockchain", "Medical", "Research"];

type IProps = IStateProps & IDispatchProps;

const EtoRegistrationCompanyInformationComponent = (
  props: FormikProps<TPartialCompanyEtoData> & IProps,
) => (
  <EtoFormBase
    data-test-id="eto.form.company-information"
    title="Company Information"
    validator={EtoCompanyInformationType.toYup()}
  >
    <Section>
      <FormField
        label={<FormattedMessage id="eto.form.company-information.brand-name" />}
        name="brandName"
      />
      <FormField
        label={<FormattedMessage id="eto.form.company-information.website" />}
        name="companyWebsite"
      />
      <FormField
        label={<FormattedMessage id="eto.form.company-information.company-tagline" />}
        name="companyOneliner"
      />

      <FormTextArea
        label={<FormattedMessage id="eto.form.company-information.company-description" />}
        placeholder="Describe your company 250 Characters"
        name="companyDescription"
        charactersLimit={750}
      />
      <FormTextArea
        label={<FormattedMessage id="eto.form.company-information.founders-quote" />}
        placeholder="Key Quote from Founder"
        name="keyQuoteFounder"
        charactersLimit={250}
      />
      <FormTextArea
        label={<FormattedMessage id="eto.form.company-information.investor-quote" />}
        placeholder="Key Quote from Investor"
        name="keyQuoteInvestor"
        charactersLimit={250}
      />

      <EtoTagWidget
        selectedTagsLimit={5}
        options={generateTagOptions(tagList)}
        name="categories"
        className="mb-4"
      />
      <Row>
        <Col>
          <FormSingleFileUpload
            name="companyLogo"
            label={<FormattedMessage id="eto.form.company-information.logo" />}
            acceptedFiles="image/*"
            fileFormatInformation="*150 x 150 png"
            className="mb-3"
            data-test-id="eto-registration-company-logo"
          />
        </Col>
        <Col>
          <FormSingleFileUpload
            name="companyBanner"
            label={<FormattedMessage id="eto.form.company-information.banner" />}
            acceptedFiles="image/*"
            fileFormatInformation="*1250 x 400 png"
            className="mb-3"
            data-test-id="eto-registration-company-banner"
          />
        </Col>
      </Row>
    </Section>
    <Section className={styles.buttonSection}>
      <Button
        layout={EButtonLayout.PRIMARY}
        type="submit"
        isLoading={props.savingData}
        data-test-id="eto-registration-company-information-submit"
      >
        <FormattedMessage id="form.button.save" />
      </Button>
    </Section>
  </EtoFormBase>
);

const EtoRegistrationCompanyInformation = compose<React.FunctionComponent>(
  setDisplayName(EEtoFormTypes.CompanyInformation),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerCompany(s) as TPartialCompanyEtoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialCompanyEtoData) => {
        dispatch(actions.etoFlow.saveDataStart({ companyData: data, etoData: {} }));
      },
    }),
  }),
  withFormik<IProps, TPartialCompanyEtoData>({
    validationSchema: EtoCompanyInformationType.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoRegistrationCompanyInformationComponent);

export { EtoRegistrationCompanyInformation, EtoRegistrationCompanyInformationComponent };
