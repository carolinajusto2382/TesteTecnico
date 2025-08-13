import {
  editarUsuario,
  criarUsuario,
  loginUsuario,
  buscarUsuarioPorId,
} from "../../../support/commands";

describe("Edição de usuário", () => {
  context("Cenários de sucesso", () => {
    let usuarioIdAdmin;
    let adminToken;
    let nomeOriginalAdmin;
    let emailOriginalAdmin;
    let senhaOriginalAdmin;
    let administradorOriginalAdmin;

    beforeEach(() => {
      nomeOriginalAdmin = "Carolina Justo Admin";
      emailOriginalAdmin = `qa_admin_${Date.now()}@teste.com`;
      senhaOriginalAdmin = "senhaAdmin123";
      administradorOriginalAdmin = "true";

      return criarUsuario(
        nomeOriginalAdmin,
        emailOriginalAdmin,
        senhaOriginalAdmin,
        administradorOriginalAdmin
      )
        .then((id) => {
          usuarioIdAdmin = id;
          return loginUsuario(emailOriginalAdmin, senhaOriginalAdmin);
        })
        .then((token) => {
          adminToken = token;
        });
    });

    it("Editar usuário administrador", () => {
      const novoNome = "Carolina Justo Editada Admin";
      const novoEmail = `carolina_editada_${Date.now()}@qa2.com`;
      const dadosParaAtualizar = {
        nome: novoNome,
        email: novoEmail,
        password: senhaOriginalAdmin,
        administrador: administradorOriginalAdmin,
      };

      editarUsuario(usuarioIdAdmin, adminToken, dadosParaAtualizar).then(
        (response) => {
          expect(response.status).to.eq(200);
          expect(response.body)
            .to.have.property("message")
            .to.contain("Registro alterado com sucesso");
        }
      );

      buscarUsuarioPorId(usuarioIdAdmin, adminToken).then((resBusca) => {
        expect(resBusca.status).to.eq(200);
        expect(resBusca.body.nome).to.eq(novoNome);
        expect(resBusca.body.email).to.eq(novoEmail);
        expect(resBusca.body.administrador).to.eq(administradorOriginalAdmin);
      });
    });

    it("Editar usuário que não é administrador", () => {
      let usuarioComumId;
      let usuarioComumToken;
      const nomeComumOriginal = "Usuario Comum Original";
      const emailComumOriginal = `comum_${Date.now()}@teste.com`;
      const senhaComumOriginal = "senhaComum123";

      return criarUsuario(
        nomeComumOriginal,
        emailComumOriginal,
        senhaComumOriginal,
        "false"
      )
        .then((id) => {
          usuarioComumId = id;
          return loginUsuario(emailComumOriginal, senhaComumOriginal);
        })
        .then((token) => {
          usuarioComumToken = token;

          const novoNomeComum = `Usuario Comum Editado ${Date.now()}`;
          const novoEmailComum = `comum_editado_${Date.now()}@teste.com`;

          const dadosParaAtualizarComum = {
            nome: novoNomeComum,
            email: novoEmailComum,
            password: senhaComumOriginal,
            administrador: "false",
          };

          return editarUsuario(
            usuarioComumId,
            usuarioComumToken,
            dadosParaAtualizarComum
          );
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body)
            .to.have.property("message")
            .to.contain("Registro alterado com sucesso");
        });
    });

    it("Editar apenas o nome do usuário", () => {
      let usuarioId;
      let usuarioToken;
      const nomeOriginal = "Gabriel Silva Original";
      const emailOriginal = `gabriel_original_${Date.now()}@teste.com`;
      const senhaOriginal = "senhaGabriel";

      return criarUsuario(nomeOriginal, emailOriginal, senhaOriginal, "false")
        .then((id) => {
          usuarioId = id;
          return loginUsuario(emailOriginal, senhaOriginal);
        })
        .then((token) => {
          usuarioToken = token;

          const novoNome = `Gabriel Silva Editado ${Date.now()}`;
          const dadosParaAtualizar = {
            nome: novoNome,
            email: emailOriginal,
            password: senhaOriginal,
            administrador: "false",
          };

          return editarUsuario(usuarioId, usuarioToken, dadosParaAtualizar);
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body)
            .to.have.property("message")
            .to.contain("Registro alterado com sucesso");
        });
    });

    it("Tornar usuário administrador", () => {
      let usuarioId;
      let usuarioToken;
      const nomeOriginal = "Usuario Comum para Admin";
      const emailOriginal = `comum_to_admin_${Date.now()}@teste.com`;
      const senhaOriginal = "senhaComumToAdmin";

      return criarUsuario(nomeOriginal, emailOriginal, senhaOriginal, "false")
        .then((id) => {
          usuarioId = id;
          return loginUsuario(emailOriginal, senhaOriginal);
        })
        .then((token) => {
          usuarioToken = token;

          const dadosParaAtualizar = {
            nome: nomeOriginal,
            email: emailOriginal,
            password: senhaOriginal,
            administrador: "true",
          };

          return editarUsuario(usuarioId, usuarioToken, dadosParaAtualizar);
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body)
            .to.have.property("message")
            .to.contain("Registro alterado com sucesso");
        });
    });

    it("Retirar a permissão de administrador", () => {
      let usuarioId;
      let usuarioToken;
      const nomeOriginal = "Usuario Admin para Comum";
      const emailOriginal = `admin_to_comum_${Date.now()}@teste.com`;
      const senhaOriginal = "senhaAdminToComum";

      return criarUsuario(nomeOriginal, emailOriginal, senhaOriginal, "true")
        .then((id) => {
          usuarioId = id;
          return loginUsuario(emailOriginal, senhaOriginal);
        })
        .then((token) => {
          usuarioToken = token;

          const dadosParaAtualizar = {
            nome: nomeOriginal,
            email: emailOriginal,
            password: senhaOriginal,
            administrador: "false",
          };

          return editarUsuario(usuarioId, usuarioToken, dadosParaAtualizar);
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body)
            .to.have.property("message")
            .to.contain("Registro alterado com sucesso");
        });
    });
  });

  context("Cenários de falha", () => {
    let adminToken;

    before(() => {
      const tempEmail = `temp_admin_fail_context_${Date.now()}@teste.com`;
      const tempPassword = "tempSenhaAdmin";
      return criarUsuario(
        "Temp Admin Fail Context",
        tempEmail,
        tempPassword,
        "true"
      )
        .then((id) => {
          return loginUsuario(tempEmail, tempPassword);
        })
        .then((token) => {
          adminToken = token;
        });
    });

    it("Deve cadastrar um novo usuário se o ID for inválido (comportamento de upsert)", () => {
      const usuarioIdInvalido = "qualquerIdInvalidoXYZABC12345";
      const novoNome = `Usuario Upsert Teste ${Date.now()}`;
      const novoEmail = `upsert_user_${Date.now()}@teste.com`;
      const novaSenha = "senhaUpsertTeste";
      const novoAdminStatus = "false";

      const dadosParaCadastro = {
        nome: novoNome,
        email: novoEmail,
        password: novaSenha,
        administrador: novoAdminStatus,
      };

      cy.request({
        method: "PUT",
        url: `${Cypress.env("apiUrl")}/usuarios/${usuarioIdInvalido}`,
        headers: {
          authorization: adminToken,
        },
        body: dadosParaCadastro,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body)
          .to.have.property("message")
          .to.eq("Cadastro realizado com sucesso");
        expect(response.body).to.have.property("_id");
      });
    });

    it("Não deve permitir editar um usuário com um e-mail já cadastrado", () => {
      let usuarioExistente_Id;
      let usuarioNovo_Id;
      let usuarioNovo_Token;

      const emailUsuarioExistente = `email_existente_A_${Date.now()}@teste.com`;
      const senhaUsuarioExistente = "senhaA_123";

      criarUsuario(
        "Claudia Santos",
        emailUsuarioExistente,
        senhaUsuarioExistente,
        "false"
      ).then((id) => {
        usuarioExistente_Id = id;
      });

      const emailUsuarioNovo = `email_original_B_${Date.now()}@teste.com`;
      const senhaUsuarioNovo = "senhaB_456";

      return criarUsuario(
        "Claudia Soares",
        emailUsuarioNovo,
        senhaUsuarioNovo,
        "false"
      )
        .then((id) => {
          usuarioNovo_Id = id;
          return loginUsuario(emailUsuarioNovo, senhaUsuarioNovo);
        })
        .then((token) => {
          usuarioNovo_Token = token;

          const dadosParaAtualizarNovo = {
            nome: "Claudia Soares Editada",
            email: emailUsuarioExistente,
            password: senhaUsuarioNovo,
            administrador: "false",
          };

          return editarUsuario(
            usuarioNovo_Id,
            usuarioNovo_Token,
            dadosParaAtualizarNovo,
            false
          );
        })
        .then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body)
            .to.have.property("message")
            .to.eq("Este email já está sendo usado");
        });
    });
  });
});
