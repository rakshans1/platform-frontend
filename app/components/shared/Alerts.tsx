import * as cn from "classnames";
import * as React from "react";

import { TDataTestId } from "../../types";

import * as styles from "./Alerts.module.scss";

export const InfoAlert: React.FunctionComponent<TDataTestId> = ({
  children,
  "data-test-id": dataTestId,
}) => {
  return (
    <div data-test-id={dataTestId} className={cn("alert", styles.alert)}>
      {children}
    </div>
  );
};
