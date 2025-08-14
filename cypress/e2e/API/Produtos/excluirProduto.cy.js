import { loginUsuario, criarUsuario, criarProduto } from "../../../support/commands";

describe("Exclusão de produto", () => {
  let usuarioId;
  let usuarioToken;
  let produtoId;

  context("Cenários de sucesso", () => {
    before(() => {
      const nome = "Cecilia Admin";
      const email = `admin_prod_${Date.now()}@teste.com`;
      const senha = "teste";
      const administrador = "true";

      return criarUsuario(nome, email, senha, administrador)
        .then((id) => {
          usuarioId = id;
          return loginUsuario(email, senha);
        })
        .then((token) => {
          usuarioToken = token;
          return criarProduto(usuarioToken, {
            nome: `Mochila ${Date.now()}`,
            preco: 100,
            descricao: "Mochila para notebook",
            quantidade: 5,
          });
        })
        .then((id) => {
          produtoId = id;
        });
    });

    it("Excluir Produto com sucesso", () => {
      cy.request({
        method: "DELETE",
        url: `${Cypress.env("apiUrl")}/produtos/${produtoId}`,
        headers: {
          Authorization: usuarioToken, // sem "Bearer"
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.contain("Registro excluído com sucesso");
      });
    });
  });

  context("Cenários de falha", () => {
    it("Tentar excluir produto inexistente", () => {
      cy.request({
        method: "DELETE",
        url: `${Cypress.env("apiUrl")}/produtos/gchgdsdgshghcd`,
        headers: {
          Authorization: usuarioToken,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Nenhum registro excluído");
      });
    });

    it("Tentar excluir produto sem estar autenticado", () => {
      cy.request({
        method: "DELETE",
        url: `${Cypress.env("apiUrl")}/produtos/${produtoId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.contain("Token de acesso ausente");
      });
    });

    it("Tentar excluir produto com token inválido", () => {
      cy.request({
        method: "DELETE",
        url: `${Cypress.env("apiUrl")}/produtos/${produtoId}`,
        headers: {
          Authorization: "token_invalido_aqui",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.contain("Token de acesso ausente, inválido, expirado");
      });
    });
  });
});
