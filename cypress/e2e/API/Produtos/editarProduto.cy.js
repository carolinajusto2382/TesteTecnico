import {
  loginUsuario,
  criarUsuario,
  criarProduto,
} from "../../../support/commands";

describe("Edição de produto", () => {
  let usuarioId;
  let usuarioToken;
  let token;
  let produtoId;

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
context('Cenários de sucesso', () => {
  it("Editar um produto com sucesso", () => {
    const nomeProduto = `Teclado ${Date.now()}`;
    const precoProduto = 250;
    const descricaoProduto = "Teclado e mousepad";
    const quantidadeProduto = 50;

    cy.request({
      method: "PUT",
      url: `${Cypress.env("apiUrl")}/produtos/${produtoId}`,
      headers: {
        authorization: usuarioToken,
      },
      body: {
        nome: nomeProduto,
        preco: precoProduto,
        descricao: descricaoProduto,
        quantidade: quantidadeProduto,
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.contain("Registro alterado com sucesso");
    });
  });
  })
context('Cenários de falha', () => {
  it("Editar produto sem token", () => {
    cy.request({
      method: "PUT",
      url: `${Cypress.env("apiUrl")}/produtos/${produtoId}`,
      failOnStatusCode: false,
      body: {
        nome: "Sem Token",
        preco: 150,
        descricao: "Teste",
        quantidade: 1,
      },
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.contain(
        "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais"
      );
    });
  });

  it("Editar produto com nome já existente", () => {
    criarProduto("Produto Duplicado", 200, "Teste", 2, token).then(
      (response) => {
        const nomeDuplicado = `Mouse ${Date.now()}`;
        const preco = 10;
        const descricao = "Mouse gamer";
        const quantidade = 1;

        cy.request({
          method: "POST",
          url: `${Cypress.env("apiUrl")}/produtos`,
          headers: { authorization: usuarioToken },
          body: {
            nome: nomeDuplicado,
            preco: preco,
            descricao: descricao,
            quantidade: quantidade,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
        });

        cy.request({
          method: "POST",
          url: `${Cypress.env("apiUrl")}/produtos`,
          headers: {
            authorization: usuarioToken,
          },
          body: {
            nome: nomeDuplicado,
            preco: preco,
            descricao: descricao,
            quantidade: quantidade,
          },
        }).then((res) => {
          expect(res.status).to.eq(400);
          expect(res.body.message).to.contain(
            "Já existe produto com esse nome"
          );
        });
      }
    );
  });

  it("Editar produto inexistente", () => {
    cy.request({
      method: "PUT",
      url: `${Cypress.env("apiUrl")}/produtos/65478gfjsysvrtsj`,
      headers: {
        authorization: usuarioToken,
      },
      failOnStatusCode: false,
      body: {
        nome: "Produto Fantasma",
        preco: 100,
        descricao: "Produto inexistente",
        quantidade: 1,
      },
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.message).to.contain("Cadastro realizado com sucesso");
    });
  });
  })
});
