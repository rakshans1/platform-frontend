import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EUserType } from "../../../../modules/auth/interfaces";
import { RecoverySuccessComponent } from "./RecoverySuccess";

storiesOf("RecoverySuccess", module).add("default", () => (
  <RecoverySuccessComponent goToDashboard={() => {}} userType={EUserType.INVESTOR} />
));
