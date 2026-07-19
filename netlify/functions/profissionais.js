const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

let profissionais = [];

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const params = new URLSearchParams(event.queryStringParameters || {});
        const funcao = params.get('funcao');
        const busca = params.get('busca');
        const categoria = params.get('categoria');

        let result = [...profissionais];

        if (funcao) {
          result = result.filter(p => p.funcao === funcao);
        }
        if (categoria) {
          result = result.filter(p => p.categoria === categoria);
        }
        if (busca) {
          const termo = busca.toLowerCase();
          result = result.filter(p =>
            p.nome.toLowerCase().includes(termo) ||
            (p.cidade && p.cidade.toLowerCase().includes(termo))
          );
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result)
        };
      }

      case 'POST': {
        const body = JSON.parse(event.body);

        if (body.id) {
          const idx = profissionais.findIndex(p => p.id === body.id);
          if (idx !== -1) {
            profissionais[idx] = { ...profissionais[idx], ...body };
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({ success: true, data: profissionais[idx] })
            };
          }
        }

        const newId = profissionais.length > 0 ? Math.max(...profissionais.map(p => p.id)) + 1 : 1;
        const novoProfissional = {
          id: newId,
          nome: body.nome,
          cidade: body.cidade || '',
          categoria: body.categoria || 'Árbitro',
          funcao: body.funcao || 'Técnico',
          cref: body.cref || ''
        };
        profissionais.push(novoProfissional);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, data: novoProfissional })
        };
      }

      case 'PUT': {
        const body = JSON.parse(event.body);
        if (!body.id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID do profissional e obrigatorio para atualizacao' })
          };
        }

        const idx = profissionais.findIndex(p => p.id === body.id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Profissional nao encontrado' })
          };
        }

        profissionais[idx] = { ...profissionais[idx], ...body };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: profissionais[idx] })
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

        const idx = profissionais.findIndex(p => p.id === id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Profissional nao encontrado' })
          };
        }

        profissionais = profissionais.filter(p => p.id !== id);

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
