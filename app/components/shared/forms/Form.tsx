// tslint:disable-next-line:import-blacklist
import { connect as formikConnect, Form as FormikForm } from "formik";
import * as React from "react";
import { Prompt } from "react-router";
import { compose, fromRenderProps, lifecycle } from "recompose";

import { symbols } from "../../../di/symbols";
import { ILogger } from "../../../lib/dependencies/logger";
import { TFormikConnect } from "../../../types";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { ContainerContext, TContainerContext } from "../../../utils/InversifyProvider";

type TProps = React.ComponentProps<typeof FormikForm>;

/**
 * Attach prompt that is going to be shown when user is trying to leave the page with dirty form state
 */
const withPrompt = () => (Wrapper: React.ComponentType<any>) => (
  props: TFormikConnect & IIntlProps,
) => (
  <>
    <Prompt
      when={props.formik.dirty && !props.formik.isSubmitting}
      message={props.intl.formatIntlMessage("shared.form.prompt-on-leave.message")}
    />
    <Wrapper {...props} />
  </>
);

const Form = compose<TProps, TProps>(
  formikConnect,
  fromRenderProps<{ logger: ILogger | undefined }, any, TContainerContext>(
    ContainerContext.Consumer,
    container => ({ logger: container && container.get<ILogger>(symbols.logger) }),
  ),
  injectIntlHelpers,
  withPrompt(),
  lifecycle<TFormikConnect & { logger: ILogger | undefined }, {}>({
    componentDidUpdate(prevProps: TFormikConnect): void {
      if (
        prevProps.formik.isSubmitting &&
        !this.props.formik.isSubmitting &&
        !this.props.formik.isValid
      ) {
        const selector = "input[aria-invalid='true'], textarea[aria-invalid='true']";
        const invalidInput = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          selector,
        );

        if (invalidInput) {
          invalidInput.focus();
        } else {
          this.props.logger!.warn(`It's not possible to focus invalid field`);
        }
      }
    },
  }),
)(FormikForm);

export { Form };
