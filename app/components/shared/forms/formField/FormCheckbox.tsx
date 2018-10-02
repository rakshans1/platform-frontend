import { Field, FieldProps, FormikConsumer } from "formik";
import * as React from "react";

import * as styles from "./FormCheckbox.module.scss";

interface IProps {
  inputId?: string;
  name: string;
  label?: string | React.ReactNode;
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  "data-test-id"?: string;
}

interface IInternalProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const CheckboxComponent: React.SFC<IProps & IInternalProps> = ({
  name,
  label,
  value,
  onChange,
  checked,
  disabled,
  inputId,
  "data-test-id": dataTestId,
}) => {
  return (
    <label className={styles.checkbox}>
      <input
        id={inputId}
        className={styles.input}
        onChange={onChange}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        data-test-id={dataTestId}
        disabled={disabled}
      />
      <div className={styles.indicator} />
      {label && <div className={styles.label}>{label}</div>}
    </label>
  );
};

const RadioButtonComponent: React.SFC<IProps & IInternalProps> = ({
  name,
  label,
  value,
  onChange,
  checked,
  disabled,
  "data-test-id": dataTestId,
}) => {
  return (
    <label className={styles.checkbox}>
      <input
        className={styles.input}
        disabled={disabled}
        onChange={onChange}
        type="radio"
        name={name}
        value={value}
        defaultChecked={checked}
        data-test-id={dataTestId}
      />
      <div className={styles.indicator} />
      {label && <div className={styles.label}>{label}</div>}
    </label>
  );
};

class FormCheckbox extends React.Component<IProps> {
  render(): React.ReactNode {
    const { name, checked, disabled } = this.props;

    return (
      <FormikConsumer>
        {({ values, setFieldValue }) => (
          <Field
            name={name}
            render={({ field }: FieldProps) => {
              return (
                <CheckboxComponent
                  {...this.props}
                  {...field}
                  checked={checked || values[name]}
                  onChange={() => setFieldValue(name, !values[name])}
                  disabled={disabled}
                />
              );
            }}
          />
        )}
      </FormikConsumer>
    );
  }
}

class FormRadioButton extends React.Component<IProps> {
  render(): React.ReactNode {
    const { name, checked, disabled } = this.props;

    return (
      <FormikConsumer>
        {({ values, setFieldValue }) => (
          <Field
            name={name}
            render={({ field }: FieldProps) => {
              const { name } = field;
              const { value } = this.props;

              return (
                <RadioButtonComponent
                  {...this.props}
                  {...field}
                  checked={checked || values[name] === value}
                  onChange={() => setFieldValue(name, value)}
                  disabled={disabled}
                />
              );
            }}
          />
        )}
      </FormikConsumer>
    );
  }
}

export { RadioButtonComponent, FormRadioButton, FormCheckbox, CheckboxComponent };
