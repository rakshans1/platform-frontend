import * as React from "react";

import { DatetimeProps, TypedDatetime } from "./forms";
import { InlineIcon } from "./InlineIcon";

import * as iconCalendar from "../../assets/img/inline_icons/calendar.svg";
import * as styles from "./forms/fields/FormFieldDatePicker.module.scss";

const DatePicker: React.FunctionComponent<DatetimeProps> = props => {
  return (
    <div className={styles.formFieldDatePicker}>
      <TypedDatetime
        closeOnSelect={true}
        utc={true}
        {...props}
        renderInput={props => {
          return (
            <div className={styles.inputWrapper}>
              <input
                onChange
                autoComplete="off"
                value={props.value}
                type="text"
                className="form-control"
                {...props}
              />
              <div className={styles.icon}>
                <InlineIcon svgIcon={iconCalendar} />
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export { DatePicker };
