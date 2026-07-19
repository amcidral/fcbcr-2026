const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

let escalas = [];

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const params = new URLSearchParams(event.queryStringParameters || {});
        const jogoId = params.get('jogoId');

        let result = [...escalas];

        if (jogoId) {
          result = result.filter(e => e.jogoId === parseInt(jogoId));
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result)
        };
      }

      case 'POST': {
        const body = JSON.parse(event.body);
        const jogoId = body.jogoId;

        if (!jogoId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'jogoId e obrigatorio' })
          };
        }

        const idx = escalas.findIndex(e => e.jogoId === jogoId);
        const escala = {
          jogoId: jogoId,
          jurados: body.jurados || [],
          arbitros: body.arbitros || [],
          delegado: body.delegado || '',
          juradosCidades: body.juradosCidades || [],
          juradosCrefs: body.juradosCrefs || [],
          arbitrosCidades: body.arbitrosCidades || [],
          arbitrosCrefs: body.arbitrosCrefs || [],
          dataCriacao: new Date().toISOString()
        };

        if (idx >= 0) {
          escalas[idx] = escala;
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: escala })
          };
        }

        escalas.push(escala);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, data: escala })
        };
      }

      case 'PUT': {
        const body = JSON.parse(event.body);

        if (!body.jogoId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'jogoId e obrigatorio para atualizacao' })
          };
        }

        const idx = escalas.findIndex(e => e.jogoId === body.jogoId);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Escala nao encontrada para este jogo' })
          };
        }

        escalas[idx] = { ...escalas[idx], ...body };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: escalas[idx] })
        };
      }

      case 'DELETE': {
        const params = new URLSearchParams(event.queryStringParameters || {});
        const jogoId = params.get('jogoId');

        if (!jogoId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'jogoId e obrigatorio para exclusao' })
          };
        }

        const idx = escalas.findIndex(e => e.jogoId === parseInt(jogoId));
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Escala nao encontrada para este jogo' })
          };
        }

        escalas = escalas.filter(e => e.jogoId !== parseInt(jogoId));

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
