import { loginUsuario } from "../../../support/e2e";

describe("Login", () => {
  context("Cenários de sucesso", () => {
    it("Logar usuário", () => {
      loginUsuario("carolinaqa@gmail.com", "teste");
      cy.get('[data-testid="logout"]').should("be.visible");

      cy.url().should("eq", "https://front.serverest.dev/home");
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
