import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import { injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { InvestmentSelectionComponent } from "./Investment";
import { wallets } from "./InvestmentTypeSelector.stories";

const Investment = injectIntlHelpers(InvestmentSelectionComponent);

storiesOf("Investment/Form", module)
  .addDecorator(withModalBody("47.5rem"))
  .add("default with error", () => (
    <Container>
      <Investment
        wallets={wallets}
        changeEthValue={() => {}}
        changeEuroValue={() => {}}
        changeInvestmentType={() => {}}
        equityTokenCount={"1234"}
        errorState={EInvestmentErrorState.ExceedsWalletBalance}
        ethValue={"1234123412341232341234"}
        // tslint:disable-next-line:no-object-literal-type-assertion
        eto={{ etoId: 11234 } as any}
        euroValue={"123412341234123412341234"}
        gasCostEth={"123412323412341234"}
        gasCostEuro={"12341234123412341234"}
        etherPriceEur={"123412341234123412341234"}
        eurPriceEther={"0.123412341234123412341234"}
        investEntireBalance={() => {}}
        investmentType={EInvestmentType.InvestmentWallet}
        minTicketEth={"12341234123412341234"}
        minTicketEur={"1234"}
        maxTicketEur={"123456"}
        readyToInvest={false}
        investNow={() => {}}
        showTokens={true}
        totalCostEth={"1234141234123412341234"}
        totalCostEur={"123412341234123412341234"}
        sendTransaction={() => {}}
        hasPreviouslyInvested={true}
      />
    </Container>
  ));
