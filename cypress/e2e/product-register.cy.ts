import "cypress-file-upload";

describe("로그인 후 상품 등록", () => {
  it("로그인 후 상품 등록", () => {
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
    cy.get("[data-cy=product-registration-button]").should("exist").click();

    cy.get("[data-cy=product-name-input]").type("test");
    cy.get("[data-cy=product-category-select]").click();
    cy.contains("[data-cy=earring-option]", "귀걸이").click();
    cy.get("[data-cy=product-price-input]").type("135");
    cy.get("[data-cy=product-qunatity-input]").type("3");
    cy.get("[data-cy=product-description-textarea]").type(
      "상품 설명은 열자 이상!!!"
    );
    const fixtureFile = "photo.png";
    cy.get("[data-cy=product-images-input]").attachFile(fixtureFile);
    cy.wait(2000);

    cy.get("[data-cy=product-name-input]").should("have.value", "test");
    cy.get("[data-cy=product-category-select]").should("contain", "귀걸이");
    cy.get("[data-cy=product-price-input]").should("have.value", "135");
    cy.get("[data-cy=product-qunatity-input]").should("have.value", "3");
    cy.get("[data-cy=product-description-textarea]").should(
      "have.value",
      "상품 설명은 열자 이상!!!"
    );
    cy.get("[data-cy=product-images-input]")
      .invoke("val")
      .should("contain", "photo.png");
    cy.get("[data-cy=product-register-button]").should("exist").click();
    cy.url().should("eq", "http://localhost:5173/mypage");
  });
});
