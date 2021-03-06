import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EUserType } from "../../../../lib/api/users/interfaces";
import { RecoverySuccessComponent } from "./RecoverySuccess";

storiesOf("RecoverySuccess", module).add("default", () => (
  <RecoverySuccessComponent goToDashboard={() => {}} userType={EUserType.INVESTOR} />
));
