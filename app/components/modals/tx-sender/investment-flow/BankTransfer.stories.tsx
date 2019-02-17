import { storiesOf } from "@storybook/react";
import * as React from "react";
import BigNumber from "bignumber.js";

import { IBlPublicEtoData } from "../../../../modules/eto-flow/interfaces/PublicEtoData";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { BankTransferDetailsComponent } from "./BankTransferDetails";
import { BankTransferSummaryComponent } from "./BankTransferSummary";

// tslint:disable-next-line:no-object-literal-type-assertion
const eto = {
  etoId: "0xfufu",
  preMoneyValuationEur: new BigNumber(10000),
  existingCompanyShares: new BigNumber(10),
  equityTokensPerShare: new BigNumber(10),
} as IBlPublicEtoData;

const detailsData = {
  accountName: "Fifth Force GmbH",
  country: "DE",
  recipient: "Fifth Force GmbH",
  iban: "DE1250094039446384529400565",
  bic: "TLXXXXXXXXX",
  referenceCode: "NF AGHGCmR3u2SuxdyNPIksxTyAhKM REF 123456789011 G WL",
  amount: new BigNumber("123456781234567812345678"),
  onGasStipendChange: () => {},
  handleCheckbox: () => {},
};

const summaryData = {
  eto,
  companyName: "fufu company",
  investmentEur: new BigNumber("10000000000000000000000"),
  equityTokens: new BigNumber("1234"),
  estimatedReward: new BigNumber("3456123412341231234123412344"),
  onAccept: () => {},
  downloadAgreement: () => {},
  onChange: () => {},
};

storiesOf("Investment/Bank Transfer", module)
  .addDecorator(withModalBody())
  .add("Details", () => <BankTransferDetailsComponent {...detailsData} />)
  .add("Summary", () => <BankTransferSummaryComponent {...summaryData} />);
