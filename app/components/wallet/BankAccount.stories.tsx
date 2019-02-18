import { storiesOf } from "@storybook/react";
import * as React from "react";
import { BankAccount } from "./BankAccount";

storiesOf("BankAccount", module).add("default", () => (
  <BankAccount
    bankAccount={{ bankAccountNumberLast4: "1234" }}
    personalData={{
      lastName: "Last",
      firstName: "First",
    }}
  />
));
