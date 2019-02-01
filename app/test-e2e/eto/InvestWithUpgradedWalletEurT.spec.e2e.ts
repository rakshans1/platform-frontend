import { INV_ETH_EUR_ICBM_HAS_KYC } from "../constants";
import { confirmAccessModal, etoFixtureAddressByName, LONG_WAIT_TIME } from "../utils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Invest with euro token", () => {
  const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
  it("do", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ETH_EUR_ICBM_HAS_KYC,
      clearPendingTransactions: true,
    }).then(() => {
      cy.visit("/dashboard");
      // click invest now button
      cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID), { timeout: LONG_WAIT_TIME }).click();
      // select euro from icbm wallet
      cy.wait(1000);
      cy.get(tid("investment-type.selector.ICBM_NEURO")).check({ force: true });
      cy.get(tid("invest-modal-eur-field"))
        .clear()
        .type("500");
      cy.wait(1000);
      cy.get(tid("invest-modal-invest-now-button")).click();
      cy.get(tid("invest-modal-summary-confirm-button")).click();
      confirmAccessModal();
      cy.get(tid("investment-flow.success.title"));
      // TODO check smart contracts balances
    });
  });
});
