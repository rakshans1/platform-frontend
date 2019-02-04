import * as React from "react";

import { Panel } from "../../shared/Panel";
import * as styles from "./EtoRegistrationPanel.module.scss";
import { EtoRegisterRouter } from "./Router";

export const EtoRegistrationPanel: React.FunctionComponent = () => (
  <Panel className={styles.etoRegistrationPanel}>
    <EtoRegisterRouter />
  </Panel>
);
