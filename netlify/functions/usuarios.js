const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

let usuarios = [
  { id: 1, login: 'admin', senha: 'FCBCR2026', nome: 'Administrador', perfil: 'admin' },
  { id: 2, login: 'gestor', senha: 'gestor2026', nome: 'Gestor', perfil: 'gestor' },
  { id: 3, login: 'escalador', senha: 'escala2026', nome: 'Escalador', perfil: 'escalador' }
];

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const result = usuarios.map(u => ({
          id: u.id,
          login: u.login,
          nome: u.nome,
          perfil: u.perfil
        }));

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result)
        };
      }

      case 'POST': {
        const body = JSON.parse(event.body);

        if (body.id) {
          const idx = usuarios.findIndex(u => u.id === body.id);
          if (idx !== -1) {
            if (body.senha) {
              usuarios[idx].senha = body.senha;
            }
            usuarios[idx].login = body.login || usuarios[idx].login;
            usuarios[idx].nome = body.nome || usuarios[idx].nome;
            usuarios[idx].perfil = body.perfil || usuarios[idx].perfil;
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                success: true,
                data: {
                  id: usuarios[idx].id,
                  login: usuarios[idx].login,
                  nome: usuarios[idx].nome,
                  perfil: usuarios[idx].perfil
                }
              })
            };
          }
        }

        if (!body.login || !body.senha || !body.nome) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Login, senha e nome sao obrigatorios' })
          };
        }

        const existe = usuarios.some(u => u.login === body.login);
        if (existe) {
          return {
            statusCode: 409,
            headers,
            body: JSON.stringify({ error: 'Ja existe um usuario com este login' })
          };
        }

        const newId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
        const novoUsuario = {
          id: newId,
          login: body.login,
          senha: body.senha,
          nome: body.nome,
          perfil: body.perfil || 'gestor'
        };
        usuarios.push(novoUsuario);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            data: {
              id: novoUsuario.id,
              login: novoUsuario.login,
              nome: novoUsuario.nome,
              perfil: novoUsuario.perfil
            }
          })
        };
      }

      case 'PUT': {
        const body = JSON.parse(event.body);
        if (!body.id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID do usuario e obrigatorio para atualizacao' })
          };
        }

        const idx = usuarios.findIndex(u => u.id === body.id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Usuario nao encontrado' })
          };
        }

        if (body.senha) {
          usuarios[idx].senha = body.senha;
        }
        if (body.login) {
          const loginExiste = usuarios.some(u => u.login === body.login && u.id !== body.id);
          if (loginExiste) {
            return {
              statusCode: 409,
              headers,
              body: JSON.stringify({ error: 'Ja existe um usuario com este login' })
            };
          }
          usuarios[idx].login = body.login;
        }
        if (body.nome) usuarios[idx].nome = body.nome;
        if (body.perfil) usuarios[idx].perfil = body.perfil;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: {
              id: usuarios[idx].id,
              login: usuarios[idx].login,
              nome: usuarios[idx].nome,
              perfil: usuarios[idx].perfil
            }
          })
        };
      }

      case 'DELETE': {
        const params = new URLSearchParams(event.queryStringParameters || {});
        const id = parseInt(params.get('id'));

        if (!id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID e obrigatorio para exclusao' })
          };
        }

        const idx = usuarios.findIndex(u => u.id === id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Usuario nao encontrado' })
          };
        }

        usuarios = usuarios.filter(u => u.id !== id);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };
      }

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Metodo nao permitido' })
        };
    }
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao processar requisicao', details: e.message })
    };
  }
};
