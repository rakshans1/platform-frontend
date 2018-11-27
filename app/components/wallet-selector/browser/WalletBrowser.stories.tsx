import { storiesOf } from "@storybook/react";
import * as React from "react";

import { noop } from "redux-saga/utils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { WalletBrowserComponent } from "./WalletBrowser";
import {BrowserWalletErrorMessage} from "../../translatedMessages/messages";

storiesOf("Wallet selector/Browser", module)
  .add("initial loading state", () => (
    <WalletBrowserComponent
      isLoading={true}
      isLoginRoute
      approvalRejected={false}
      handleReset={noop}
    />
  ))
  .add("error message", () => (
    <WalletBrowserComponent
      isLoading={false}
      errorMessage={{messageType: BrowserWalletErrorMessage.GENERIC_ERROR}}
      isLoginRoute
      approvalRejected={false}
      handleReset={noop}
    />
  ))
  .add("approval rejected", () => (
    <WalletBrowserComponent
      isLoading={false}
      errorMessage={{messageType: BrowserWalletErrorMessage.GENERIC_ERROR}}
      isLoginRoute
      approvalRejected={true}
      handleReset={noop}
    />
  ));
