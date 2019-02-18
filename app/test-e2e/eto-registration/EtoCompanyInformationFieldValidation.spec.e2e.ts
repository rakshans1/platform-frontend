import { pick } from "lodash/fp";

import { etoRegisterRoutes } from "../../components/eto/registration/routes";
import { fillForm, getFieldError } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { aboutFormRequired, aboutFormSubmit } from "./fixtures";

export const goToEtoCompanyInformation = () => {
  cy.visit(etoRegisterRoutes.companyInformation);
  cy.get(tid("eto.form.company-information")).should("exist");
};

describe("Eto Company Information Field Validation", () => {
  it("should cancel confirmation when navigating to another page with dirty form", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      // cancel confirm
      const confirm = cy
        .stub()
        .log()
        .returns(false);
      cy.on("window:confirm", confirm);

      goToEtoCompanyInformation();

      // fill single field
      fillForm(
        {
          brandName: aboutFormRequired.brandName,
        },
        { submit: false },
      );

      cy.get(tid("authorized-layout-eto-dashboard-button"))
        .click()
        .then(() => {
          expect(confirm).to.have.been.calledOnce;
        });

      cy.get(tid("eto-dashboard-application")).should("not.exist");
    });
  });

  it("should accept confirmation when navigating to another page with dirty form", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      // accept confirm
      const confirm = cy
        .stub()
        .log()
        .returns(true);

      cy.on("window:confirm", confirm);

      goToEtoCompanyInformation();

      // fill single field
      fillForm(
        {
          brandName: aboutFormRequired.brandName,
        },
        { submit: false },
      );

      cy.get(tid("authorized-layout-eto-dashboard-button"))
        .click()
        .then(() => {
          expect(confirm).to.have.been.calledOnce;
        });

      cy.get(tid("eto-dashboard-application")).should("exist");
    });
  });

  it("should correctly validate required fields", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      goToEtoCompanyInformation();

      const requiredFields = Object.keys(aboutFormRequired);

      requiredFields.forEach(key => {
        getFieldError(tid("eto.form.company-information"), key).then(
          error => expect(error).to.be.empty,
        );
      });

      fillForm({
        ...aboutFormSubmit,
      });

      requiredFields.forEach(key => {
        getFieldError(tid("eto.form.company-information"), key).then(error =>
          expect(error).to.equal("This field is required"),
        );
      });
    });
  });

  it("should focus first invalid input field", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      goToEtoCompanyInformation();

      fillForm({
        ...aboutFormSubmit,
      });

      cy.focused().should("have.attr", "name", "brandName");
    });
  });

  it("should focus first invalid textarea field", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      goToEtoCompanyInformation();

      const requiredInputFields = pick(
        ["brandName", "companyWebsite", "companyOneliner"],
        aboutFormRequired,
      );

      fillForm({
        ...requiredInputFields,
        ...aboutFormSubmit,
      });

      cy.focused().should("have.attr", "name", "companyDescription");
    });
  });
});
