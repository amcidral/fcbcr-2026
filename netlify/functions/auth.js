const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

const usuarios = [
  { id: 1, login: 'admin', senha: 'FCBCR2026', nome: 'Administrador', perfil: 'admin' },
  { id: 2, login: 'gestor', senha: 'gestor2026', nome: 'Gestor', perfil: 'gestor' },
  { id: 3, login: 'escalador', senha: 'escala2026', nome: 'Escalador', perfil: 'escalador' }
];

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      const { usuario, senha } = body;

      if (!usuario || !senha) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Usuario e senha sao obrigatorios' })
        };
      }

      const user = usuarios.find(u => u.login === usuario && u.senha === senha);

      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Usuario ou senha invalidos' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          usuario: { login: user.login, nome: user.nome, perfil: user.perfil }
        })
      };
    } catch (e) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erro ao processar login', details: e.message })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Metodo nao permitido' })
  };
};
