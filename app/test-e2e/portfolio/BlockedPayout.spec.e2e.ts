import { INV_ETH_ICBM_NO_KYC } from "../fixtures";
import { goToPortfolio } from "../utils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Investor blocked payout", () => {
  beforeEach(() =>
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ETH_ICBM_NO_KYC,
      clearPendingTransactions: true,
    }));

  it("should disable payout when account is not verified", () => {
    goToPortfolio();

    cy.get(tid(`asset-portfolio.payout-eur_t`)).within(() => {
      cy.get(tid("asset-portfolio.payout.accept-payout")).should("be.disabled");
      cy.get(tid("asset-portfolio.payout.redistribute-payout")).should("be.disabled");
    });

    cy.get(tid(`asset-portfolio.payout-eth`)).within(() => {
      cy.get(tid("asset-portfolio.payout.accept-payout")).should("be.disabled");
      cy.get(tid("asset-portfolio.payout.redistribute-payout")).should("be.disabled");
    });

    cy.get(tid("asset-portfolio.payout.accept-all-payouts")).should("be.disabled");
  });
});
