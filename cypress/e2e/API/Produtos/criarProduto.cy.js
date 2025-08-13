import { loginUsuario, criarUsuario } from "../../../support/commands";

describe("Criação de produto", () => {
  let adminId;
  let adminToken;
  let nomeAdmin;
  let emailAdmin;
  let senhaAdmin;

  before(() => {
    nomeAdmin = "Admin Produto Teste";
    emailAdmin = `admin_prod_${Date.now()}@teste.com`;
    senhaAdmin = "senhaProduto123";
    const administrador = "true";

    return criarUsuario(nomeAdmin, emailAdmin, senhaAdmin, administrador)
      .then((id) => {
        adminId = id;
        return loginUsuario(emailAdmin, senhaAdmin);
      })
      .then((token) => {
        adminToken = token;
      });
  });

  context("Cenários de sucesso", () => {
    it("Criar produto com sucesso", () => {
      const nomeProduto = `Teclado ${Date.now()}`;
      const precoProduto = 250;
      const descricaoProduto = "Teclado e mousepad";
      const quantidadeProduto = 50;

      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/produtos`,
        headers: {
          authorization: adminToken,
        },
        body: {
          nome: nomeProduto,
          preco: precoProduto,
          descricao: descricaoProduto,
          quantidade: quantidadeProduto,
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body)
          .to.have.property("message")
          .to.contain("Cadastro realizado com sucesso");
        expect(response.body).to.have.property("_id");
      });
    });
  });

  context("Cenários de falha", () => {
    it("Criar produto sem autenticação", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/produtos`,
        failOnStatusCode: false,
        body: {
          nome: "Produto Sem Token",
          preco: 100,
          descricao: "Um produto qualquer",
          quantidade: 10,
        },
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body)
          .to.have.property("message")
          .to.contain(
            "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais"
          );
      });
    });

    it("Criar produto com nome já existente", () => {
      const nomeDuplicado = `Mouse ${Date.now()}`;
      const preco = 10;
      const descricao = "Mouse gamer";
      const quantidade = 1;

      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/produtos`,
        headers: { authorization: adminToken },
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
        headers: { authorization: adminToken },
        failOnStatusCode: false,
        body: {
          nome: nomeDuplicado,
          preco: preco,
          descricao: descricao,
          quantidade: quantidade,
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body)
          .to.have.property("message")
          .to.contain("Já existe produto com esse nome");
      });
    });
    let usuarioComumId;
    let usuarioComumToken;

    before(() => {
      const nomeComum = "Usuario Comum Produto";
      const emailComum = `comum_prod_${Date.now()}@teste.com`;
      const senhaComum = "senhaComum123";
      const administrador = "false";

      return criarUsuario(nomeComum, emailComum, senhaComum, administrador)
        .then((id) => {
          usuarioComumId = id;
          return loginUsuario(emailComum, senhaComum);
        })
        .then((token) => {
          usuarioComumToken = token;
        });
    });
    it("Criar produto com usuário não administrador", () => {
      const nomeProduto = `Produto Comum ${Date.now()}`;
      const precoProduto = 150;
      const descricaoProduto = "Produto criado por usuário comum";
      const quantidadeProduto = 20;
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/produtos`,
        headers: {
          authorization: usuarioComumToken,
        },
        body: {
          nome: nomeProduto,
          preco: precoProduto,
          descricao: descricaoProduto,
          quantidade: quantidadeProduto,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body)
          .to.have.property("message")
          .to.contain("Rota exclusiva para administradores");
      });
    });
    it("Criar produto sem o nome", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/produtos`,
        headers: {
          authorization: adminToken,
        },
        body: {
          preco: 100,
          descricao: "Produto sem nome",
          quantidade: 10,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body)
          .to.have.property("nome")
          .to.contain("nome é obrigatório");
      });
    });
    it("Criar produto com o preço negativo", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/produtos`,
        headers: {
          authorization: adminToken,
        },
        body: {
          nome: "Produto Preço Negativo",
          preco: -50,
          descricao: "Produto com preço negativo",
          quantidade: 5,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body)
          .to.have.property("preco")
          .to.contain("preco deve ser um número positivo");
      });
    });
    it("Criar produto com a quantidade negativa", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/produtos`,
        headers: {
          authorization: adminToken,
        },
        body: {
          nome: "Produto Quantidade Negativa",
          preco: 100,
          descricao: "Produto com quantidade negativa",
          quantidade: -10,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body)
          .to.have.property("quantidade")
          .to.contain("quantidade deve ser maior ou igual a 0");
      });
    });
    it("Criar produto com preço vazio", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/produtos`,
        headers: {
          authorization: adminToken,
        },
        body: {
          nome: "Produto Preço Vazio",
          descricao: "Produto com preço vazio",
          quantidade: 10,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body)
          .to.have.property("preco")
          .to.contain("preco é obrigatório");
      });
    });
    it("Criar produto com descrição vazia", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/produtos`,
        headers: {
          authorization: adminToken,
        },
        body: {
          nome: "Produto Descrição Vazia",
          preco: 100,
          quantidade: 10,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body)
          .to.have.property("descricao")
          .to.contain("descricao é obrigatório");
      });
    });
  });
});
