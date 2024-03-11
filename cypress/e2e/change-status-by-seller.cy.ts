import "cypress-file-upload";

describe("로그인 후 상품 판매 상태 변경", () => {
  it("로그인 후 상품 판매 상태 변경", () => {
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
    cy.get("[data-cy= sale-management-tab-button]").should("exist").click();

    cy.get("[data-cy=order-item-card]")
      .eq(1)
      .within(() => {
        cy.get("[data-cy=status-select]").click();
      });
    cy.contains("[data-cy=send-wating-option]", "발송 대기")
      .should("be.visible")
      .click();
    cy.get("[data-cy= status-change-ok-option]").click();
  });
});
