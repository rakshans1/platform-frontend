import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoEquityTokenInfoType,
  TPartialEtoSpecData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { etoFormIsReadonly } from "../../../../lib/api/eto/EtoApiUtils";
import { actions } from "../../../../modules/actions";
import { selectIssuerEto, selectIssuerEtoState } from "../../../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../../../modules/eto-flow/types";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormField } from "../../../shared/forms";
import { FormFieldLabel } from "../../../shared/forms/fields/FormFieldLabel";
import { FormSingleFileUpload } from "../../../shared/forms/fields/FormSingleFileUpload";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";
import * as styles from "../Shared.module.scss";

interface IExternalProps {
  readonly: boolean;
}

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialEtoSpecData;
}

interface IDispatchProps {
  saveData: (values: TPartialEtoSpecData) => void;
}

type IProps = IExternalProps & IStateProps & IDispatchProps & FormikProps<TPartialEtoSpecData>;

const EtoEquityTokenInfoComponent: React.FunctionComponent<IProps> = ({ readonly, savingData }) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.eto-equity-token-info.title" />}
    validator={EtoEquityTokenInfoType.toYup()}
  >
    <Section>
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.token-name" />}
        placeholder="Token name"
        name="equityTokenName"
        disabled={readonly}
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
        placeholder="3 - 4 characters"
        maxLength="4"
        name="equityTokenSymbol"
        disabled={readonly}
      />
      <div className="form-group">
        <FormFieldLabel name="equityTokenImage">
          <FormattedMessage id="eto.form.section.equity-token-information.token-image" />
        </FormFieldLabel>
        <FormSingleFileUpload
          label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
          name="equityTokenImage"
          acceptedFiles="image/png"
          fileFormatInformation="*200 x 200px png"
          data-test-id="eto-registration-token-logo"
          disabled={readonly}
        />
      </div>
    </Section>

    {!readonly && (
      <Section className={styles.buttonSection}>
        <Button
          layout={EButtonLayout.PRIMARY}
          type="submit"
          isLoading={savingData}
          data-test-id="eto-registration-token-info-submit"
        >
          <FormattedMessage id="form.button.save" />
        </Button>
      </Section>
    )}
  </EtoFormBase>
);

const EtoEquityTokenInfo = compose<React.FunctionComponent<IExternalProps>>(
  setDisplayName(EEtoFormTypes.EtoEquityTokenInfo),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerEto(s) as TPartialEtoSpecData,
      readonly: etoFormIsReadonly(EEtoFormTypes.EtoEquityTokenInfo, selectIssuerEtoState(s)),
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialEtoSpecData) => {
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
  withFormik<IStateProps & IDispatchProps, TPartialEtoSpecData>({
    validationSchema: EtoEquityTokenInfoType.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoEquityTokenInfoComponent);

export { EtoEquityTokenInfoComponent, EtoEquityTokenInfo };
