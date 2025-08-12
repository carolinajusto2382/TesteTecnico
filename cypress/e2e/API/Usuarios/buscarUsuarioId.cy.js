describe("Busca de usuários por id", () => {
  context("Cenário de sucesso", () => {
    it("Buscar usuário por id existente", () => {
      const userId = "0uxuPY0cbmQhpEz1";
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios/${userId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("_id", userId);
      });
    });
  });
  context("Cenário de falha", () => {
    it("Buscar usuário por id inexistente", () => {
      const userId = "0uxuPY0cbmQhpEz2";
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios/${userId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body)
          .to.have.property("message")
          .to.contain("Usuário não encontrado");
      });
    });
  });
});
