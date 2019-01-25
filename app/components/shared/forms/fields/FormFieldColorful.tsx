import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";

import { CommonHtmlProps, InputType, TTranslatedString } from "../../../../types";
import { Avatar } from "../../Avatar";
import { FormFieldLabel } from "./FormFieldLabel";
import { isNonValid } from "./utils";

import * as styles from "./FormFieldColorful.module.scss";
import { FormFieldError, generateErrorId } from "./FormFieldError";

interface IFieldGroup {
  label?: string | React.ReactNode;
  placeholder?: string | React.ReactNode;
  type?: InputType;
  maxLength?: string;
  showAvatar?: boolean;
  errorMessage?: TTranslatedString;
}
type FieldGroupProps = IFieldGroup & FieldAttributes<any> & CommonHtmlProps;

export class FormFieldColorful extends React.Component<FieldGroupProps> {
  render(): React.ReactNode {
    const { label, type, placeholder, name, className, showAvatar, ...props } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors, submitCount }) => {
          return (
            <FormGroup>
              {label && <FormFieldLabel name={name}>{label}</FormFieldLabel>}
              <Field
                name={name}
                render={({ field }: FieldProps) => {
                  const validClass = () => {
                    if (field.value) {
                      return errors[name] !== undefined ? "is-invalid" : "is-valid";
                    }

                    return "";
                  };

                  const invalid = isNonValid(touched, errors, name, submitCount);

                  return (
                    <>
                      <div className={cn(styles.inputWrapper, validClass())}>
                        <Input
                          {...field}
                          aria-describedby={generateErrorId(name)}
                          aria-invalid={invalid}
                          invalid={invalid}
                          className={cn(styles.input, className)}
                          type={type}
                          value={field.value}
                          placeholder={placeholder || label}
                          {...props}
                        />
                        {showAvatar && (
                          <div className={styles.addon}>
                            <Avatar seed={field.value || ""} />
                          </div>
                        )}
                      </div>
                      <FormFieldError name={name} />
                    </>
                  );
                }}
              />
            </FormGroup>
          );
        }}
      </FormikConsumer>
    );
  }
}
