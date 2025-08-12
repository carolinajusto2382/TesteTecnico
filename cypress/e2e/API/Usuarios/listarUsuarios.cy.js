describe("Listagem de usuários", () => {
  const nomeUsuario = "Dallas Kuhn DDS";
  const emailUsuario = "Dakota9@hotmail.com";
  context("Cenários de sucesso", () => {
    it("Listar todos os usuários cadastrados", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("quantidade");
        expect(response.body).to.have.property("usuarios").and.not.be.empty;
      });
    });
    it("Listar usuários pelo nome", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        qs: {
          nome: nomeUsuario,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.usuarios[0].nome)
          .to.contain(nomeUsuario)
          .that.is.a("string");
      });
    });
    it("Listar usuários pelo email", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        qs: {
          email: emailUsuario,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.usuarios[0].email)
          .to.contain(emailUsuario)
          .that.is.a("string");
      });
    });
    it("Listar usuários administradores", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        qs: {
          administrador: true,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("quantidade");
      });
    });
    it("Listar usuários que não são administradores", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        qs: {
          administrador: false,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("quantidade");
      });
    });
    it("Listar usuários por nome e administrador", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        qs: {
          nome: "Fulano da Silva",
          administrador: true,
        },
      }).then((response) => {
        expect(response.body.usuarios[0].nome)
          .to.contain("Fulano da Silva")
          .that.is.a("string");
        expect(response.body.usuarios[0].administrador)
          .to.eq("true")
          .that.is.a("string");
      });
    });
  });
  context("Cenários de falha", () => {
    it("Listar usuário inexistente pelo nome", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        qs: {
          nome: "Teetes",
        },
        failStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.quantidade).to.eq(0);
        expect(response.body.usuarios).to.be.empty;
      });
    });
    it("Listar usuário inexistente pelo email", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        qs: {
          email: "teste987@gmail.com",
        },
        failStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.quantidade).to.eq(0);
        expect(response.body.usuarios).to.be.empty;
      });
    });
    it("Listar usuário inexistente pelo email e administrador", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios`,
        qs: {
          email: "teste987@gmail.com",
          administrador: true,
        },
        failStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.quantidade).to.eq(0);
        expect(response.body.usuarios).to.be.empty;
      });
    });
  });
});
