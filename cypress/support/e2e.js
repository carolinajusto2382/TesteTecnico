export function loginUsuario(email, senha) {
        cy.visit("https://front.serverest.dev/login");
        cy.get('[data-testid="email"]').type(email);
        cy.get('[data-testid="senha"]').type(senha);
        cy.get('[data-testid="entrar"]').click();


}