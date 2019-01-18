import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Q18 } from "../../../config/constants";
import { UnlockedNEURWallet } from "./UnlockedNEURWallet";

storiesOf("Unlocked EUR Wallet", module)
  .add("empty", () => (
    <UnlockedNEURWallet
      deposit={() => {}}
      withdraw={() => {}}
      neuroAmount={"0"}
      neuroEuroAmount={"0"}
    />
  ))
  .add("not empty", () => (
    <UnlockedNEURWallet
      deposit={() => {}}
      withdraw={() => {}}
      neuroAmount={Q18.mul(847213).toString()}
      neuroEuroAmount={Q18.mul(847213).toString()}
    />
  ));
