# Testes Automatizados Serverest

Este projeto contém uma suíte de testes automatizados para a API e frontend do [Serverest](https://serverest.dev), utilizando o framework [Cypress](https://www.cypress.io/).

## Estrutura do Projeto

```
.
├── cypress.config.js
├── package.json
├── cypress/
│   ├── e2e/
│   │   ├── API/
│   │   │   ├── Produtos/
│   │   │   └── Usuarios/
│   │   └── Frontend/
│   │       ├── Carrinho/
│   │       └── Login/
│   ├── fixtures/
│   └── support/
└── .gitignore
```

- **cypress/e2e/API/Produtos/**: Testes de API para produtos (CRUD, listagem, etc).
- **cypress/e2e/API/Usuarios/**: Testes de API para usuários (CRUD, listagem, etc).
- **cypress/e2e/Frontend/**: Testes de interface para funcionalidades de login e carrinho.
- **cypress/support/**: Funções utilitárias e comandos customizados para Cypress.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/)

## Instalação

1. Clone este repositório:
   ```sh
   git clone [<url-do-repo>](https://github.com/carolinajusto2382/TesteTecnico)
  
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

## Como executar os testes

### Testes em modo headless (CLI)

```sh
npx cypress run
```

### Testes em modo interativo (GUI)

```sh
npx cypress open
```

Escolha o teste desejado na interface do Cypress.

## Configuração

A URL base da API está definida em [`cypress.config.js`](cypress.config.js):

```js
env: {
  apiUrl: 'https://serverest.dev'
}
```

Se necessário, altere para o endpoint desejado.

## Scripts de Teste

- Testes de usuários: [`cypress/e2e/API/Usuarios/`](cypress/e2e/API/Usuarios/)
- Testes de produtos: [`cypress/e2e/API/Produtos/`](cypress/e2e/API/Produtos/)
- Testes de frontend: [`cypress/e2e/Frontend/`](cypress/e2e/Frontend/)

## Comandos Customizados

Funções utilitárias para criação, login, edição e exclusão de usuários e produtos estão em [`cypress/support/commands.js`](cypress/support/commands.js).

## Licença

Este projeto é apenas para fins de estudo e demonstração de testes automatizados com Cypress.

---
