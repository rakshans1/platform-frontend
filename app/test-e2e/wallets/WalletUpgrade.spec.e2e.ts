import { extractNumber } from "../../utils/StringUtils";
import { INV_ETH_ICBM_NO_KYC, INV_EUR_ICBM_HAS_KYC_SEED } from "../fixtures";
import { closeModal, confirmAccessModal } from "../utils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Upgrade icbm wallet", () => {
  it("do euro upgrade", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      clearPendingTransactions: true,
    }).then(() => {
      let icbmBalance: number;
      cy.visit("/wallet");
      cy.get(tid("icbmNeuroWallet.balance-values-large-value")).should($e => {
        icbmBalance = parseFloat(extractNumber($e.text()));
        expect(icbmBalance).to.be.greaterThan(0);
      });
      cy.get(tid("icbmNeuroWallet.shared-component.upgrade.button")).click();
      cy.get(tid("modals.tx-sender.withdraw-flow.summery.withdrawSummery.accept")).click();
      confirmAccessModal();
      cy.get(tid("modals.shared.signing-message.modal"));
      cy.get(tid("modals.tx-sender.withdraw-flow.success"));
      closeModal();
      cy.get(tid("lockedEuroWallet.balance-values-large-value")).should($e => {
        const val = parseFloat(extractNumber($e.text()));
        expect(val).to.be.greaterThan(0);
        expect(val).to.equal(icbmBalance);
      });
      cy.get(tid("wallet-start-container")).should($e => {
        expect($e.find(tid("icbmNeuroWallet.balance-values-large-value")).length).to.equal(0);
      });
    });
  });

  it.skip("do eth upgrade", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ETH_ICBM_NO_KYC,
      clearPendingTransactions: true,
    }).then(() => {
      let icbmBalance: number;
      cy.visit("/wallet");
      cy.get(tid("icbmEtherWallet.balance-values-large-value")).should($e => {
        icbmBalance = parseFloat(extractNumber($e.text()));
        expect(icbmBalance).to.be.greaterThan(0);
      });
      cy.get(tid("icbmEtherWallet.shared-component.upgrade.button")).click();
      cy.get(tid("modals.tx-sender.withdraw-flow.summery.withdrawSummery.accept")).click();
      confirmAccessModal();
      cy.get(tid("modals.shared.signing-message.modal"));
      cy.get(tid("modals.tx-sender.withdraw-flow.success"));
      closeModal();
      cy.get(tid("lockedEtherWallet.balance-values-large-value")).should($e => {
        const val = parseFloat(extractNumber($e.text()));
        expect(val).to.be.greaterThan(0);
        expect(val).to.equal(icbmBalance);
      });
      cy.get(tid("wallet-start-container")).should($e => {
        expect($e.find(tid("icbmEtherWallet.balance-values-large-value")).length).to.equal(0);
      });
    });
  });
});
