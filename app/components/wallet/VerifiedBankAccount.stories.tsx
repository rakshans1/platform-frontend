import { storiesOf } from "@storybook/react";
import * as React from "react";
import { VerifiedBankAccountComponent } from "./VerifiedBankAccount";

const kyc = {
  lastName: "Last",
  firstName: "First",
};

storiesOf("VerifiedBankAccount", module)
  .add("not verified", () => <VerifiedBankAccountComponent isVerified={false} />)
  .add("verified", () => (
    <VerifiedBankAccountComponent
      isVerified={true}
      bankAccount={{ hasBankAccount: true, details: { bankAccountNumberLast4: "1234" } }}
      personalData={kyc}
    />
  ));
