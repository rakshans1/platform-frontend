import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { IBlTxData } from "../../../../modules/web3/interfaces";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { UserClaimSummaryComponent } from "./Summary";

const txData: IBlTxData = {
  to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  value: new BigNumber("5500000000000000000"),
  gas: new BigNumber("12000"),
  gasPrice: new BigNumber("57000000000"),
  from: "0x8e75544b848f0a32a1ab119e3916ec7138f3bed2",
};

storiesOf("User Claim Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <UserClaimSummaryComponent
      txData={txData}
      txCost={new BigNumber("123456")}
      onAccept={() => {}}
      generateTemplateByEtoId={() => {}}
      isPendingDownload={_ => false}
      etoData={
        {
          investorTicket: {
            equityTokenInt: new BigNumber(100),
            amountEth: new BigNumber(1),
            amountEurUlps: new BigNumber(40),
            equivEurUlps: new BigNumber(1),
            rewardNmkUlps: new BigNumber(1),
            sharesInt: new BigNumber(1),
            tokenPrice: new BigNumber(1),
            neuRate: new BigNumber(1),
            claimedOrRefunded: true,
            usedLockedAccount: true,
          },
        } as any
      }
      etoId={"0xfaDa8f267C054f469b52Ccbeb08250ACAAeE65dc"}
      downloadDocument={() => {}}
    />
  ));
