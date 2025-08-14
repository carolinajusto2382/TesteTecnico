import { loginUsuario } from "../../../support/commands"; // Verifique o caminho!

describe("Carrinho", () => {
  beforeEach(() => {
    loginUsuario("carolinaqa@gmail.com", "teste");
  });

  context("Cenários de sucesso", () => {
    it("Adicionar produto ao carrinho", () => {
      cy.get('[data-testid="adicionarNaLista"]').first().click();
      cy.get('[data-testid="adicionar carrinho"]').click();

      cy.url().should("eq", "https://front.serverest.dev/carrinho");
      cy.get('[data-testid="carrinho"]').should("contain", "1 item(s)");
    });
  });
});
