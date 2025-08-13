import {
  criarUsuario,
  loginUsuario,
  excluirUsuario,
  criarCarrinho,
} from "../../../support/commands";

describe("Exclusão de usuário", () => {
  context("Cenário de sucesso", () => {
    let usuarioId;

    before(() => {
      const nome = "Teste QA";
      const email = `qa${Date.now()}@teste.com`;
      const senha = "123456";
      const administrador = "true";

      return criarUsuario(nome, email, senha, administrador).then((id) => {
        usuarioId = id;
      });
    });

    it("Excluir usuário existente", () => {
      cy.request({
        method: "DELETE",
        url: `${Cypress.env("apiUrl")}/usuarios/${usuarioId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.contain(
          "Registro excluído com sucesso"
        );
      });
    });
  });

  context("Cenário de falha", () => {
    it("Excluir usuário inexistente", () => {
      const usuarioInexistente = "fjffnsnfn";
      cy.request({
        method: "DELETE",
        url: `${Cypress.env("apiUrl")}/usuarios/${usuarioInexistente}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.contain("Nenhum registro excluído");
      });
    });

    it("Deve impedir exclusão de usuário que possui carrinho", () => {
      const nome = "Teste QA";
      const email = `qa${Date.now()}@teste.com`;
      const senha = "123456";
      const administrador = "true";
      const produtoId = "BeeJh5lz3k6kSIzA";

      criarUsuario(nome, email, senha,administrador).then((userId) => {
        loginUsuario(email, senha).then((token) => {
          criarCarrinho(userId, produtoId, token).then(() => {
            excluirUsuario(userId, token).then((res) => {
              expect(res.status).to.eq(400);
              expect(res.body.message).to.contain(
                "Não é permitido excluir usuário com carrinho cadastrado"
              );
            });
          });
        });
      });
    });
  });
});
