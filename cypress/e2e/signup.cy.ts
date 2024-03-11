describe("회원가입", () => {
  it("필수정보를 입력한 뒤 버튼을 클릭하여 홈으로 이동하기", () => {
    cy.visit("/sign-up");
    cy.get("[data-cy=name-input]").type("테스트");
    cy.get("[data-cy=email-input]").type("test@naver.com");
    cy.get("[data-cy=role-select]").click();
    cy.contains("[data-cy=seller-option]", "판매자").click();
    cy.get("[data-cy=password-input]").type("xptmxm1010!");
    cy.get("[data-cy=confirmPassword-input]").type("xptmxm1010!");

    cy.get("[data-cy=name-input]").should("have.value", "테스트");
    cy.get("[data-cy=email-input]").should("have.value", "test@naver.com");
    cy.get("[data-cy=role-select]").should("contain", "판매자");
    cy.get("[data-cy=password-input]").should("have.value", "xptmxm1010!");
    cy.get("[data-cy=confirmPassword-input]").should(
      "have.value",
      "xptmxm1010!"
    );

    cy.get("[data-cy=signup-button]").should("exist").click();
    cy.url().should("eq", "http://localhost:5173/");
  });
});
