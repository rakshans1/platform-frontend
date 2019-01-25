import * as cn from "classnames";
import { connect, FieldArray, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoKeyIndividualsType,
  TEtoKeyIndividualType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectIssuerCompany } from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { TFormikConnect, TTranslatedString } from "../../../../types";
import { getFieldSchema, isRequired } from "../../../../utils/yupUtils";
import { Button, ButtonIcon, EButtonLayout } from "../../../shared/buttons";
import { FormField, FormTextArea } from "../../../shared/forms";
import { FormSingleFileUpload } from "../../../shared/forms/fields/FormSingleFileUpload";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { FormSection } from "../../../shared/forms/FormSection";
import { SOCIAL_PROFILES_PERSON, SocialProfilesEditor } from "../../../shared/SocialProfilesEditor";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

import * as closeIcon from "../../../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../../../assets/img/inline_icons/round_plus.svg";
import { EEtoFormTypes } from "../../../../modules/eto-flow/types";
import * as styles from "../Shared.module.scss";
import * as localStyles from "./KeyIndividuals.module.scss";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps & FormikProps<TPartialCompanyEtoData>;

interface IIndividual {
  onRemoveClick: () => void;
  canRemove: boolean;
  index: number;
  groupFieldName: string;
}

interface IKeyIndividualsGroup {
  name: string;
  title: TTranslatedString;
}

const getBlankMember = () => ({
  name: "",
  role: "",
  description: "",
  image: "",
});

const Individual: React.FunctionComponent<IIndividual> = ({
  onRemoveClick,
  canRemove,
  index,
  groupFieldName,
}) => {
  const group = `${groupFieldName}.members.${index}`;

  return (
    <FormHighlightGroup>
      {canRemove && (
        <ButtonIcon
          svgIcon={closeIcon}
          onClick={onRemoveClick}
          className={localStyles.removeButton}
        />
      )}
      <FormField
        name={`${group}.name`}
        label={<FormattedMessage id="eto.form.key-individuals.name" />}
        placeholder="name"
      />
      <FormField
        name={`${group}.role`}
        label={<FormattedMessage id="eto.form.key-individuals.role" />}
        placeholder="role"
      />
      <FormTextArea
        name={`${group}.description`}
        label={<FormattedMessage id="eto.form.key-individuals.short-bio" />}
        placeholder=" "
        charactersLimit={1200}
      />
      <FormSingleFileUpload
        label={<FormattedMessage id="eto.form.key-individuals.image" />}
        name={`${group}.image`}
        acceptedFiles="image/*"
        fileFormatInformation="*150 x 150px png"
        data-test-id={`${group}.image`}
      />
      <FormField className="mt-4" name={`${group}.website`} placeholder="website" />
      <fieldset>
        <legend className={cn(localStyles.individualSocialChannelsLegend, "mt-4 mb-2")}>
          <FormattedMessage id="eto.form.key-individuals.add-social-channels" />
        </legend>
        <SocialProfilesEditor profiles={SOCIAL_PROFILES_PERSON} name={`${group}.socialChannels`} />
      </fieldset>
    </FormHighlightGroup>
  );
};

class KeyIndividualsGroupLayout extends React.Component<IKeyIndividualsGroup & TFormikConnect> {
  isEmpty(): boolean {
    const { name, formik } = this.props;
    const { values } = formik;

    const individuals = values[name];

    return !individuals || (individuals.members && individuals.members.length === 0);
  }

  isRequired(): boolean {
    const { formik, name } = this.props;
    const { validationSchema } = formik;

    const fieldSchema = getFieldSchema(name, validationSchema());
    return isRequired(fieldSchema);
  }

  componentDidMount(): void {
    const { name, formik } = this.props;
    const { setFieldValue } = formik;

    if (this.isRequired() && this.isEmpty()) {
      setFieldValue(`${name}.members.0`, getBlankMember());
    }
  }

  render(): React.ReactNode {
    const { title, name, formik } = this.props;
    const { values } = formik;
    const individuals = this.isEmpty() ? [] : values[name].members;

    return (
      <FormSection title={title}>
        <FieldArray
          name={`${name}.members`}
          render={arrayHelpers => (
            <>
              {individuals.map((_: {}, index: number) => {
                const canRemove = !(index === 0 && this.isRequired());

                return (
                  <Individual
                    key={index}
                    onRemoveClick={() => arrayHelpers.remove(index)}
                    index={index}
                    canRemove={canRemove}
                    groupFieldName={name}
                  />
                );
              })}
              <Button
                data-test-id={`key-individuals-group-button-${name}`}
                iconPosition="icon-before"
                layout={EButtonLayout.SECONDARY}
                svgIcon={plusIcon}
                onClick={() => arrayHelpers.push(getBlankMember())}
                innerClassName={localStyles.addButton}
              >
                <FormattedMessage id="eto.form.key-individuals.add" />
              </Button>
            </>
          )}
        />
      </FormSection>
    );
  }
}

const KeyIndividualsGroup = connect<IKeyIndividualsGroup, TEtoKeyIndividualType>(
  KeyIndividualsGroupLayout,
);

const EtoRegistrationKeyIndividualsComponent = (props: IProps) => {
  const validator = EtoKeyIndividualsType.toYup();

  return (
    <EtoFormBase
      title={<FormattedMessage id="eto.form.key-individuals.title" />}
      validator={validator}
    >
      <Section>
        <KeyIndividualsGroup
          title={<FormattedMessage id="eto.form.key-individuals.section.team.title" />}
          name="team"
        />
        <KeyIndividualsGroup
          title={<FormattedMessage id="eto.form.key-individuals.section.advisors.title" />}
          name="advisors"
        />
        <KeyIndividualsGroup
          title={<FormattedMessage id="eto.form.key-individuals.section.key-alliances.title" />}
          name="keyAlliances"
        />
        <KeyIndividualsGroup
          title={<FormattedMessage id="eto.form.key-individuals.section.board-members.title" />}
          name="boardMembers"
        />
        <KeyIndividualsGroup
          title={<FormattedMessage id="eto.form.key-individuals.section.notable-investors.title" />}
          name="notableInvestors"
        />
        <KeyIndividualsGroup
          title={<FormattedMessage id="eto.form.key-individuals.section.key-customers.title" />}
          name="keyCustomers"
        />
        <KeyIndividualsGroup
          title={<FormattedMessage id="eto.form.key-individuals.section.partners.title" />}
          name="partners"
        />
      </Section>
      <Section className={styles.buttonSection}>
        <Button
          layout={EButtonLayout.PRIMARY}
          type="submit"
          isLoading={props.savingData}
          data-test-id="eto-registration-key-individuals-submit"
        >
          <FormattedMessage id="form.button.save" />
        </Button>
      </Section>
    </EtoFormBase>
  );
};

const EtoRegistrationKeyIndividuals = compose<React.FunctionComponent>(
  setDisplayName(EEtoFormTypes.KeyIndividuals),
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
  withFormik<IStateProps & IDispatchProps, TPartialCompanyEtoData>({
    validationSchema: EtoKeyIndividualsType.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoRegistrationKeyIndividualsComponent);

export { EtoRegistrationKeyIndividualsComponent, EtoRegistrationKeyIndividuals };
