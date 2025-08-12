function gerarEmailAleatorio() {
  const timestamp = Date.now();
  return `usuario${timestamp}@qa.com.br`;
}

describe("Criação de usuários", () => {
  context("Cenários de sucesso", () => {
    it("Criar usuário administrador", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        body: {
          nome: "Carolina Justo",
          email: gerarEmailAleatorio(),
          password: "teste",
          administrador: "true",
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body)
          .to.have.property("message")
          .to.contain("Cadastro realizado com sucesso");
      });
    });
    it("Criar usuário não administrador", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        body: {
          nome: "Caroline Israel",
          email: gerarEmailAleatorio(),
          password: "teste",
          administrador: "false",
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body)
          .to.have.property("message")
          .to.contain("Cadastro realizado com sucesso");
      });
    });
  });
  context("Cenários de falha", () => {
    it("Criar usuário com email já cadastrado", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        body: {
          nome: "Caroline Israel",
          email: "carolina@qa.com.br",
          password: "teste",
          administrador: "false",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body)
          .to.have.property("message")
          .to.contain("Este email já está sendo usado");
      });
    });
    it("Criar usuário com senha vazia", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        body: {
          nome: "Caroline Israel",
          email: "carolina@qa.com.br",
          administrador: "false",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body)
          .to.have.property("password")
          .to.contain("password é obrigatório");
      });
    });
    it("Criar usuário com nome vazio", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        body: {
          email: "carolina.qa.com.br",
          password: "teste",
          administrador: "false",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body)
          .to.have.property("email")
          .to.contain("email deve ser um email válido");
      });
    });
    it("Criar usuário com email inválido", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        body: {
          nome: "Caroline Israel",
          email: "carolina.qa.com.br",
          password: "teste",
          administrador: "false",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body)
          .to.have.property("email")
          .to.contain("email deve ser um email válido");
      });
    });
  });
});
