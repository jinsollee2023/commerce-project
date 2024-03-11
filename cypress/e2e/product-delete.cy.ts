import "cypress-file-upload";

describe("로그인 후 상품 수정", () => {
  it("로그인 후 상품 삭제", () => {
    cy.visit("/login");
    cy.get("[data-cy=email-input]").type("jins2ol@naver.com");
    cy.get("[data-cy=password-input]").type("wlsthf1010!");

    cy.get("[data-cy=email-input]")
      .invoke("val")
      .should("eq", "jins2ol@naver.com");
    cy.get("[data-cy=password-input]").then(($passwordInput) => {
      cy.wrap($passwordInput).should("have.value", "wlsthf1010!");
    });
    cy.get("[data-cy=login-button]").should("exist").click();
    cy.url().should("eq", "http://localhost:5173/");
    cy.wait(2000);

    cy.get("[data-cy=mypage-button]").should("exist").click();
    cy.get("[data-cy=product-card]")
      .eq(0)
      .within(() => {
        cy.get("[data-cy=product-delete-button]").should("be.visible").click();
      });
    cy.wait(2000);
  });
});
