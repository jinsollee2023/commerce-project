describe("로그인", () => {
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
  });
});
