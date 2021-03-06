import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { SetEtoDateSummaryComponent } from "./SetDateSummary";

const date = moment(new Date("2020-12-17T03:24:00Z"));
const changeableTill = date.clone().subtract(3, "days");

const data = {
  etoTermsAddress: "0x456456",
  equityTokenAddress: "0x123123",
  offeringAgreementIPFSLink: "https://ipfs.io/123123",
  etoCommitmentAddress: "0x789789",
  termsAgreementIPFSLink: "https://ipfs.io/789789",
  newDate: date.toDate(),
  onAccept: () => {},
  changeableTill,
};

storiesOf("ETO-Flow/SetStartDateSummary", module)
  .addDecorator(withModalBody())
  .add("default", () => <SetEtoDateSummaryComponent {...data} />);
