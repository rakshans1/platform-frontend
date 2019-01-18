import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Q18 } from "../../config/constants";
import { AccountBalance } from "./AccountBalance";
import { ECurrency } from "./Money";

import * as ethIcon from "../../assets/img/eth_icon.svg";

storiesOf("AccountBalance", module)
  .add("without actions", () => (
    <AccountBalance
      icon={ethIcon}
      currency={ECurrency.ETH}
      currencyTotal={ECurrency.EUR}
      largeNumber={Q18.mul(847213.1954).toString()}
      value={Q18.mul(123145.12).toString()}
    />
  ))
  .add("with actions", () => (
    <AccountBalance
      icon={ethIcon}
      currency={ECurrency.ETH}
      currencyTotal={ECurrency.EUR}
      largeNumber={Q18.mul(847213.1954).toString()}
      value={Q18.mul(123145.12).toString()}
      actions={[
        {
          name: "Top up",
          onClick: () => {},
        },
        {
          name: "Redeem",
          onClick: () => {},
          disabled: true,
        },
      ]}
    />
  ));
