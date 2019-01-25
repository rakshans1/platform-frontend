import * as React from "react";

import * as styles from "./Modals.module.scss";

export const Heading: React.FunctionComponent = ({ children, ...props }) => (
  <h4 {...props} className={styles.heading}>
    {children}
  </h4>
);
