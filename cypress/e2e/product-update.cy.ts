import "cypress-file-upload";

describe("로그인 후 상품 수정", () => {
  it("아이디와 비밀번호를 입력한 뒤 버튼을 클릭하여 홈으로 이동하기", () => {
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
        cy.get("[data-cy=product-update-button]").should("be.visible").click();
      });
    cy.wait(2000);

    cy.get("[data-cy=product-name-input]").should("have.value", "test");
    cy.get("[data-cy=product-category-select]").should("contain", "귀걸이");
    cy.get("[data-cy=product-price-input]").should("have.value", "135");
    cy.get("[data-cy=product-qunatity-input]").should("have.value", "3");
    cy.get("[data-cy=product-description-textarea]").should(
      "have.value",
      "상품 설명은 열자 이상!!!"
    );
    cy.get("[data-cy=product-images-input]").then(($input) => {
      const fileList = $input.prop("files");
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const fileName = file.name;
        expect(fileName).to.contain("image");
      }
    });

    cy.get("[data-cy=product-name-input]").clear().type("수정된 상품 이름");
    cy.get("[data-cy=product-price-input]").clear().type("20000");
    cy.get("[data-cy=product-category-select]").click();
    cy.contains("[data-cy=ring-option]", "반지").click();
    cy.get("[data-cy=product-price-input]").clear().type("13500");
    cy.get("[data-cy=product-qunatity-input]").clear().type("5");
    cy.get("[data-cy=product-description-textarea]")
      .clear()
      .type("수정! 상품 설명은 열자 이상!!!");
    const fixtureFile = "photo2.png";
    cy.get("[data-cy=product-images-input]").attachFile(fixtureFile);
    cy.wait(2000);

    cy.get("[data-cy=product-register-button]").should("exist").click();
  });
});
