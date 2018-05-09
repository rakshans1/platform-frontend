import * as React from "react";
import {
  ComponentConstructor,
  DateSource,
  FormattedDate,
  FormattedMessage,
  FormattedNumber,
  FormattedPlural,
  FormattedRelative,
  FormattedTime,
  injectIntl,
  MessageValue,
} from "react-intl";

export interface IIntlHelpers {
  formatDate(value: DateSource, options?: FormattedDate.PropsBase): string;
  formatTime(value: DateSource, options?: FormattedTime.PropsBase): string;
  formatRelative(value: DateSource, options?: FormattedRelative.PropsBase & { now?: any }): string;
  formatNumber(value: number, options?: FormattedNumber.PropsBase): string;
  formatPlural(value: number, options?: FormattedPlural.Base): keyof FormattedPlural.PropsBase;
  formatIntlMessage(id: string, values?: { [key: string]: MessageValue }): string;
  formatHTMLMessage(
    messageDescriptor: FormattedMessage.MessageDescriptor,
    values?: { [key: string]: MessageValue },
  ): string;
  locale: string;
  formats: any;
  messages: { [id: string]: string };
  defaultLocale: string;
  defaultFormats: any;
  now(): number;
}

export interface IIntlProps {
  intl: IIntlHelpers;
}

/**
 * Simplifies interface of injectIntl. We should use exclusively these helpers!
 */
export const injectIntlHelpers = <OwnProps extends {}>(
  Component: ComponentConstructor<OwnProps & IIntlProps>,
): ComponentConstructor<OwnProps> => {
  return injectIntl<any>(({ intl, ...props }) => {
    const newIntl: IIntlHelpers = {
      ...intl,
      // we dont need to pass description
      formatIntlMessage: (id: string, values?: { [key: string]: MessageValue }) =>
        intl.formatMessage({ id }, values),
    };

    return <Component intl={newIntl} {...props} />;
  }) as any;
};