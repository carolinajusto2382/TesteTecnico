describe("Busca por produto por ID", () => {
  const produtoId = "BeeJh5lz3k6kSIzA";

  context("Cenário de sucesso", () => {
    it("Listar produto por ID", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos/${produtoId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("_id", produtoId);
      });
    });
  });
  context("Cenário de falha", () => {
    it("Listar produto por ID inexistente", () => {
      const produtoIdInvalido = "idInvalido123456";
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos/${produtoIdInvalido}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Produto não encontrado");
      });
    });
  });
});
