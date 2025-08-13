describe("Listagem de produtos", () => {
  const produtoNome = "Logitech MX Vertical";
  const precoProduto = 470;
  const descricaoProduto = "Mouse";
  const produtoId = "BeeJh5lz3k6kSIzA";
  const qtdProduto = 381;
  const produtoIdInvalido = "idInvalido123456";

  context("Cenário de sucesso", () => {
    it("Listar todos os produtos cadastrados", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("quantidade");
        expect(response.body).to.have.property("produtos").and.not.be.empty;
      });
    });

    it("Listar produto por ID", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos/${produtoId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("_id", produtoId);
      });
    });

    it("Listar produtos pelo nome", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos`,
        qs: { nome: produtoNome },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.produtos[0].nome)
          .to.contain(produtoNome)
          .that.is.a("string");
      });
    });

    it("Listar produtos pelo preço", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos`,
        qs: { preco: precoProduto },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.produtos[0].preco).to.eq(precoProduto);
      });
    });

    it("Listar produtos pela descrição", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos`,
        qs: { descricao: descricaoProduto },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.produtos[0].descricao)
          .to.contain(descricaoProduto)
          .that.is.a("string");
      });
    });

    it("Listar produtos pela quantidade", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos`,
        qs: { quantidade: qtdProduto },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("quantidade");
      });
    });

    it("Listar produtos pelo nome e preço", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos`,
        qs: { nome: produtoNome, preco: precoProduto },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.produtos[0].nome)
          .to.contain(produtoNome)
          .that.is.a("string");
        expect(response.body.produtos[0].preco).to.eq(precoProduto);
      });
    });

    it("Listar produtos pelo nome e quantidade", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos`,
        qs: { nome: produtoNome, quantidade: qtdProduto },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.produtos[0].nome)
          .to.contain(produtoNome)
          .that.is.a("string");
        expect(response.body).to.have.property("quantidade");
      });
    });
  });

  context("Cenário de falha", () => {
    it("Listar produto por ID inexistente", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos/${produtoIdInvalido}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Produto não encontrado");
      });
    });

    it("Listar produtos com filtro inexistente", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtos`,
        qs: { nome: "ProdutoInexistente123" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.produtos).to.be.empty;
      });
    });

    it("Rota inexistente", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/produtoss`, // rota errada
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(405);
      });
    });
  });
});
