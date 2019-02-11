import { assertDashboard, goToDashboard } from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Ethereum Node RPC requests batching", () => {
  it("should batch web3 requests", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: process.env.NF_RPC_PROVIDER as string,
    }).as("node");

    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();
      assertDashboard();

      cy.get("@node").should((xhr: any) => {
        expect(xhr.requestBody).to.be.an("array");
      });
    });
  });
});
