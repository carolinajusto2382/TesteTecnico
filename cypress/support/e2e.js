export function loginUsuario(email, senha) {
        cy.visit("https://front.serverest.dev/login");
        cy.get('[data-testid="email"]').type(email);
        cy.get('[data-testid="senha"]').type(senha);
        cy.get('[data-testid="entrar"]').click();


}

export function cadastrarUsuario(nome, email, senha,checkbox) {
        cy.visit("https://front.serverest.dev");
        cy.get('[data-testid="cadastrar"]').click();
        cy.get('[data-testid="nome"]').type(nome);
        cy.get('[data-testid="email"]').type(email);
        cy.get('[data-testid="password"]').type(senha);
        cy.get('[data-testid="cadastrar"]').click();
}