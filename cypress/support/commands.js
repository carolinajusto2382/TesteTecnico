export function criarUsuario(nome, email, password, administrador) {
  return cy
    .request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/usuarios`,
      body: {
        nome: nome,
        email: email,
        password: password,
        administrador: administrador,
      },
    })
    .then((res) => {
      expect(res.status).to.eq(201);
      return res.body._id;
    });
}

export function loginUsuario(email, senha) {
  return cy
    .request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/login`,
      body: {
        email: email,
        password: senha,
      },
    })
    .then((res) => {
      expect(res.status).to.eq(200);
      return res.body.authorization;
    });
}

export function criarCarrinho(userId, produtoId, token) {
  return cy
    .request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/carrinhos`,
      headers: {
        authorization: token,
      },
      body: {
        produtos: [
          {
            idProduto: produtoId,
            quantidade: 1,
          },
        ],
      },
    })
    .then((res) => {
      expect(res.status).to.eq(201);
      return res.body._id;
    });
}

export function excluirUsuario(userId, token) {
  return cy.request({
    method: "DELETE",
    url: `${Cypress.env("apiUrl")}/usuarios/${userId}`,
    headers: {
      authorization: token,
    },
    failOnStatusCode: false, 
  });
}
export function editarUsuario(userId, token, dadosAtualizados, failOnStatusCode = true) {
    return cy.request({
        method: "PUT",
        url: `${Cypress.env("apiUrl")}/usuarios/${userId}`,
        headers: {
            authorization: token,
        },
        body: dadosAtualizados,
        failOnStatusCode: failOnStatusCode
    });
}
export function buscarUsuarioPorId(userId) {
      return cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/usuarios/${userId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("_id", userId);
      });
}

export function criarProduto(token, produto) { 
  return cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/produtos`,
        headers: {
          authorization: token,
        },
        body: {
          nome: produto.nome,
          preco: produto.preco,
          descricao: produto.descricao,
          quantidade: produto.quantidade,
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body)
          .to.have.property("message")
          .to.contain("Cadastro realizado com sucesso");
        expect(response.body).to.have.property("_id");
        return response.body._id;
      });
}