import { get } from "lodash";

import { appRoutes } from "../../components/appRoutes";
import { walletRegisterRoutes } from "../../components/wallet-selector/walletRoutes";
import { makeEthereumAddressChecksummed } from "../../modules/web3/utils";
import { EthereumAddress } from "../../types";
import { tid } from "./selectors";
import { DEFAULT_PASSWORD } from "./userHelpers";

export const LONG_WAIT_TIME = 60000;

export const ETO_FIXTURES: any = require("../../../git_modules/platform-contracts-artifacts/localhost/eto_fixtures.json");

export const FIXTURE_ACCOUNTS: any = require("../../../git_modules/platform-contracts-artifacts/localhost/fixtures.json");

export const numberRegExPattern = /\d+/g;

export const letterRegExPattern = /[^0-9]/gi;

export const letterKeepDotRegExPattern = /[^0-9.]/gi;

export const charRegExPattern = /[^a-z0-9]/gi;

export const assertEtoDashboard = () => {
  cy.url().should("contain", "/dashboard");
  cy.get(tid("eto-dashboard-application")).should("exist");
};

export const assertEtoDocuments = () => {
  cy.url().should("contain", "/documents");
  cy.get(tid("eto-documents")).should("exist");
};

export const assertDashboard = () => {
  cy.url().should("contain", "/dashboard");
  cy.get(tid("dashboard-application")).should("exist");
};

export const assertRegister = () => {
  cy.url().should("contain", walletRegisterRoutes.light);
  cy.get(tid("register-layout")).should("exist");
};

export const goToDashboard = () => {
  cy.visit("/dashboard");
};

export const goToProfile = () => {
  cy.visit("/profile");
};

export const clearEmailServer = () => {
  cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "DELETE" });
};

export const assertWaitForLatestEmailSentWithSalt = (
  userEmail: string,
  timeout: number = 20000,
) => {
  expect(timeout, `Email not received in ${timeout} ms`).to.be.gt(0);
  cy.wait(1000);
  cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "GET" }).then(r => {
    if (r.status === 200) {
      const response = get(r, "body[0].personalizations[0].to[0]");
      if (response) {
        const loginLink = get(r, "body[0].personalizations[0].substitutions.-loginLink-");
        expect(response.email).to.be.eq(userEmail);
        expect(loginLink).to.contain("salt");
        return;
      }
    }
    assertWaitForLatestEmailSentWithSalt(userEmail, timeout - 1000);
  });
};

export const assertVerifyEmailWidgetIsInUnverifiedEmailState = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget.unverified-email-state")).should(
    shouldNotExist ? "not.exist" : "exist",
  );
};

export const assertVerifyEmailWidgetIsInNoEmailState = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget.no-email-state")).should(
    shouldNotExist ? "not.exist" : "exist",
  );
};

export const assertVerifyEmailWidgetIsInVerfiedEmailState = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget.verified-email-state")).should(
    shouldNotExist ? "not.exist" : "exist",
  );
};

export const assertEmailActivationWidgetVisible = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget")).should(shouldNotExist ? "not.exist" : "exist");
};

export const assertBackupSeedWidgetVisible = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.backup-seed-widget")).should(shouldNotExist ? "not.exist" : "exist");
};

export const assertErrorModal = () => {
  cy.get(tid("components.modals.generic-modal.title")).should("exist");
};

export const assertButtonIsActive = (id: string) => {
  return cy.get(tid(id)).should("be.not.disabled");
};

export const typeEmailPassword = (email: string, password: string) => {
  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);

  cy.get(tid("wallet-selector-register-button")).awaitedClick();
};

export const registerWithLightWalletETO = (
  email: string,
  password: string,
  acceptTos: boolean = true,
) => {
  cy.visit("eto/register/light");

  typeEmailPassword(email, password);
  if (acceptTos) acceptTOS();
};

export const typeLightwalletRecoveryPhrase = (words: string[]) => {
  for (let batch = 0; batch < words.length / 4; batch++) {
    for (let index = 0; index < 4; index++) {
      cy.get(tid(`seed-recovery-word-${batch * 4 + index}`, "input"))
        .type(words[batch * 4 + index], { force: true, timeout: 20 })
        .type("{enter}", { force: true });
    }

    if (batch + 1 < words.length / 4) {
      cy.get(tid("btn-next")).awaitedClick();
    }
  }

  cy.get(tid("btn-send")).awaitedClick();
};

export const assertLockedAccessModal = () => {
  cy.get(tid("access-light-wallet-locked")).should("exist");
};

export const confirmAccessModal = (password: string = DEFAULT_PASSWORD) => {
  cy.get(tid("access-light-wallet-password-input")).type(password);
  cy.get(tid("access-light-wallet-confirm")).awaitedClick(1500);
};

export const confirmAccessModalNoPW = () => {
  cy.get(tid("access-light-wallet-prompt-accept-button")).awaitedClick(1500);
};

export const closeModal = () => {
  cy.get(tid("modal-close-button")).click();
};

// todo: extract it to separate file
// do it after moving all e2e tests back into cypress directory
export const mockApiUrl = "https://localhost:9090/api/external-services-mock/";

export const verifyLatestUserEmail = () => {
  cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "GET" }).then(r => {
    const activationLink = get(r, "body[0].personalizations[0].substitutions.-activationLink-");
    // we need to replace the loginlink pointing to a remote destination with one pointing to our local instance
    const cleanedActivationLink = activationLink.replace("platform.neufund.io", "localhost:9090");
    cy.visit(cleanedActivationLink);
    cy.get(tid("email-verified")); // wait for the email verified button to show
  });
};

export const assertUserInDashboard = (isIssuer: boolean = false) => {
  cy.url().should("contain", appRoutes.dashboard);
  return isIssuer ? cy.get(tid("eto-dashboard-application")) : cy.get(tid("dashboard-application"));
};

export const assertUserInLanding = () => {
  cy.url().should("contain", appRoutes.root);
  return cy.get(tid("landing-page"));
};

export const convertToUniqueEmail = (email: string) => {
  const splitEmail = email.split("@");
  const randomString = Math.random()
    .toString(36)
    .slice(2);
  return `${splitEmail[0]}-${randomString}@${splitEmail[1]}`;
};

export const registerWithLightWallet = (
  email: string,
  password: string,
  uniqueEmail: boolean = false,
  asIssuer: boolean = false,
) => {
  if (uniqueEmail) {
    email = convertToUniqueEmail(email);
  }

  cy.visit(asIssuer ? appRoutes.registerEto : appRoutes.register);

  cy.get(tid("wallet-selector-light")).awaitedClick();
  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);
  cy.get(tid("wallet-selector-register-button")).awaitedClick();
  cy.get(tid("wallet-selector-register-button")).should("be.disabled");
  assertUserInDashboard(asIssuer);
  acceptTOS();
};

export const acceptTOS = () => {
  cy.get(tid("modals.accept-tos.accept-button-hidden")).awaitedClick();
};

export const logoutViaTopRightButton = () => {
  cy.get(tid("Header-logout")).awaitedClick();
  cy.get(tid("landing-page")); // wait for landing page to show
};

export const loginWithLightWallet = (email: string, password: string) => {
  cy.get(tid("Header-login")).awaitedClick();
  cy.get(tid("wallet-selector-light")).awaitedClick();

  cy.contains(tid("light-wallet-login-with-email-email-field"), email);
  cy.get(tid("light-wallet-login-with-email-password-field")).type(password);
  cy.get(tid("wallet-selector-nuewallet.login-button")).awaitedClick();
  cy.get(tid("wallet-selector-nuewallet.login-button")).should("be.disabled");

  return assertUserInDashboard();
};

export const acceptWallet = () => {
  cy.get(tid("access-light-wallet-password-input")).type(DEFAULT_PASSWORD);
  cy.get(tid("access-light-wallet-confirm")).awaitedClick(1500);
};

export const etoFixtureByName = (name: string) => {
  const etoAddress = Object.keys(ETO_FIXTURES).find(a => ETO_FIXTURES[a].name === name);
  return etoAddress ? ETO_FIXTURES[etoAddress] : undefined;
};

export const etoFixtureAddressByName = (name: string): string => {
  const address = Object.keys(ETO_FIXTURES).find(
    a => ETO_FIXTURES[a].name === name,
  )! as EthereumAddress;
  return makeEthereumAddressChecksummed(address);
};

export const stubWindow = (hookName: string) => (window.open = cy.stub().as(hookName) as any);
