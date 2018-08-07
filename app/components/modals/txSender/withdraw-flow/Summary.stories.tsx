import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import { ITxData } from "../../../../modules/tx/sender/reducer";
import { WithdrawSummary } from "./Summary";

const txData: ITxData = {
  to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  value: "12345",
  gas: "12000",
  gasPrice: "50000",
  from: "0x8e75544b848f0a32a1ab119e3916ec7138f3bed2",
};

storiesOf("Withdraw summary", module).add("default", () => (
  <Container>
    <WithdrawSummary data={txData} onAccept={() => {}} />
  </Container>
));