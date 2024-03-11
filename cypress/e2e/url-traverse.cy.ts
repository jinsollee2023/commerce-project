const urls = [
  "/",
  "/login",
  "/sign-up",
  "/necklace",
  "/earring",
  "/bracelet",
  "/ring",
];

describe("url traverse", () => {
  urls.forEach((url) => {
    it(url, () => {
      cy.visit(url);
      cy.get("#root").should("not.be.empty");
      cy.get("#error-boundary", { timeout: 0 }).should("not.exist");
    });
  });
});
