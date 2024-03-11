import "cypress-file-upload";

describe("로그인 후 장바구니 테스트 후 주문", () => {
  it("로그인 후 장바구니 테스트 후 주문", () => {
    cy.visit("/login");
    cy.get("[data-cy=email-input]").type("jinsol@dummy.com");
    cy.get("[data-cy=password-input]").type("wlsthf1010!");

    cy.get("[data-cy=email-input]")
      .invoke("val")
      .should("eq", "jinsol@dummy.com");
    cy.get("[data-cy=password-input]").then(($passwordInput) => {
      cy.wrap($passwordInput).should("have.value", "wlsthf1010!");
    });
    cy.get("[data-cy=login-button]").should("exist").click();
    cy.url().should("eq", "http://localhost:5173/");
    cy.wait(2000);

    cy.get("[data-cy=product-card]").eq(1).click();
    cy.wait(1000);
    cy.get("[data-cy=add-cart-button]").should("be.visible").click();
    cy.get("[data-cy=cart-item-card]").within(() => {
      cy.get("[data-cy=cart-qunatity-input]").clear().type("2");
      cy.get("[data-cy=cart-qunatity-update-button]").click();
      cy.get("[data-cy=cart-delete-button]").click();
    });
    cy.get("[data-cy=close-cart-button]").click();

    cy.get("[data-cy=add-cart-button]").should("be.visible").click();
    cy.get("[data-cy=open-order-button]").click();

    cy.get("[data-cy=order-name-input]").type("이진솔");
    cy.get("[data-cy=order-contact-input]").type("01096039475");
    cy.get("[data-cy=order-email-input]").type("sparta@sparta.com");
    cy.get("[data-cy=order-zipcode-input]").type("11111");
    cy.get("[data-cy=order-address-input]").type("서울시 동작구");
    cy.contains("주문 정보 확인하였으며, 결제 진행을 동의합니다.").click();

    cy.get("[data-cy=order-name-input]").should("have.value", "이진솔");
    cy.get("[data-cy=order-contact-input]").should("have.value", "01096039475");
    cy.get("[data-cy=order-email-input]").should(
      "have.value",
      "sparta@sparta.com"
    );
    cy.get("[data-cy=order-zipcode-input]").should("have.value", "11111");
    cy.get("[data-cy=order-address-input]").should(
      "have.value",
      "서울시 동작구"
    );
    cy.get("[data-cy=order-check-box]").should(
      "have.attr",
      "data-state",
      "checked"
    );

    cy.get("[data-cy=order-button]").should("exist").click();
  });
});
