import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as MockDate from "mockdate";
import * as React from "react";

import {
  EETOStateOnChain,
  TBlEtoWithCompanyAndContract,
} from "../../../../modules/public-etos/interfaces/interfaces";
import { EtoMaxCapExceededComponent } from "./EtoMaxCapExceeded";

// tslint:disable-next-line:no-object-literal-type-assertion
const eto = {
  etoId: "0x123434562134asdf2412341234adf12341234",
  preMoneyValuationEur: new BigNumber(10000),
  existingCompanyShares: new BigNumber(10),
  equityTokensPerShare: new BigNumber(10),
  maxPledges: new BigNumber(500),
  maxTicketEur: new BigNumber(10000000),
  minTicketEur: new BigNumber(100),
  minimumNewSharesToIssue: new BigNumber(1000),
  newSharesToIssue: new BigNumber(3452),
  newSharesToIssueInWhitelist: new BigNumber(1534),
  company: {},
  contract: {
    timedState: EETOStateOnChain.Whitelist,
    totalInvestment: {
      totalInvestors: new BigNumber("123"),
      totalTokensInt: new BigNumber("34520"),
      totalEquivEurUlps: new BigNumber(1234),
    },
  },
} as TBlEtoWithCompanyAndContract;

class EtoMaxCapExceededComponentWithMockedDate extends React.Component<any> {
  constructor(props: any) {
    super(props);

    MockDate.set("1/1/2000");
  }

  render(): React.ReactNode {
    return (
      <EtoMaxCapExceededComponent
        isPreEto={true}
        eto={eto}
        etherPriceEur={new BigNumber("100")}
        isWaitingForNextStateToStart={true}
        nextStateStartDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
      />
    );
  }

  componentWillUnmount(): void {
    MockDate.reset();
  }
}

storiesOf("ETO/MaxCapExceededWidget", module)
  .add("pre-eto", () => <EtoMaxCapExceededComponentWithMockedDate />)
  .add("public", () => (
    <EtoMaxCapExceededComponent
      isPreEto={false}
      eto={eto}
      etherPriceEur={new BigNumber("100")}
      isWaitingForNextStateToStart={false}
      nextStateStartDate={new Date("+1 day")}
    />
  ));
