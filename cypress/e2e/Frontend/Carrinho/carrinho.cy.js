import { loginUsuario, cadastrarUsuario } from "../../../support/e2e";

describe("Carrinho", () => {
  let nome;
  let email;
  let senha;

  beforeEach(() => {
    nome = "Carolina";
    email = `carolina${Date.now()}@teste.com`;
    senha = "teste";
    const checkbox = "false";
    cadastrarUsuario(nome, email, senha, checkbox, { timeout: 10000 });
    loginUsuario(email, senha);
  });

  context("Cenários de sucesso", () => {
    it("Adicionar produto ao carrinho", () => {
      cy.get('[data-testid="adicionarNaLista"]', { timeout: 10000 }).should(
        "be.visible"
      );

      cy.get('[data-testid="adicionarNaLista"]').first().click();
      cy.get('[data-testid="adicionar carrinho"]').click();

      cy.url().should("eq", "https://front.serverest.dev/carrinho");
    });

    it("Adicionar produto ao carrinho buscando pela busca", () => {
      const termoBusca = "Teclado";

      cy.get('[data-testid="pesquisar"]').type(termoBusca);
      cy.get('[data-testid="botaoPesquisar"]').click();

      cy.get('[data-testid="adicionarNaLista"]', { timeout: 10000 }).should(
        "be.visible"
      );

      cy.get(".card-title")
        .first()
        .invoke("text")
        .then(() => {
          cy.get('[data-testid="adicionarNaLista"]').first().click();
          cy.get('[data-testid="adicionar carrinho"]').click();

          cy.url().should("eq", "https://front.serverest.dev/carrinho");
        });
    });

    it("Verificar quantidade do produto no carrinho", () => {
      cy.get('[data-testid="adicionarNaLista"]', { timeout: 10000 }).should(
        "be.visible"
      );

      cy.get('[data-testid="adicionarNaLista"]').first().click();
      cy.get('[data-testid="adicionar carrinho"]').click();

      cy.url().should("eq", "https://front.serverest.dev/carrinho");
    });

    it("Adicionar produto ao carrinho pela página de detalhes", () => {
      cy.get('[data-testid="adicionarNaLista"]', { timeout: 10000 }).should(
        "be.visible"
      );

      cy.contains("a", "Detalhes").first().click();

      cy.url().should("include", "/detalhesProduto/");

      cy.get('[data-testid="adicionarNaLista"]').first().click();

      cy.get('[data-testid="adicionar carrinho"]').first().click();

      cy.url().should("eq", "https://front.serverest.dev/carrinho");
    });
  });
});
