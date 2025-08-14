import { cadastrarUsuario, loginUsuario } from "../../../support/e2e";

describe("Login", () => {
  let nome 
  let email 
  let senha 

  beforeEach(() => {
    nome = "Carolina";
    email = `carolina${Date.now()}@teste.com`;
    senha = "teste";
    const checkbox = "true";
    cadastrarUsuario(nome, email, senha, checkbox,  { timeout: 10000 });
  });
  context("Cenários de sucesso", () => {
    it("Logar usuário", () => {
      loginUsuario(email, senha);
      cy.get('[data-testid="logout"]').should("be.visible");

      cy.url().should("not.include", "/login");
    });
  });
  context("Cenários de falha", () => {
    it("Logar com usuário inexistente", () => {
      loginUsuario("carolinaqa2@gmail.com", "teste");

      cy.get('[role="alert"]').should("be.visible");
      cy.get('[role="alert"]').should("contain", "Email e/ou senha inválidos");
    });

    it("Logar com senha inválida", () => {
      cy.visit("https://front.serverest.dev/login");
      loginUsuario("carolinaqa2@gmail.com", "testeedd");

      cy.get('[role="alert"]').should("be.visible");
      cy.get('[role="alert"]').should("contain", "Email e/ou senha inválidos");
    });
  });
});
