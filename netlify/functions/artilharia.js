const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

let artilharia = [];

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const params = new URLSearchParams(event.queryStringParameters || {});
        const limit = parseInt(params.get('limit'));
        const equipe = params.get('equipe');
        const busca = params.get('busca');

        let result = [...artilharia];

        if (equipe) {
          result = result.filter(a => a.time === equipe);
        }
        if (busca) {
          const termo = busca.toLowerCase();
          result = result.filter(a =>
            a.nome.toLowerCase().includes(termo) ||
            (a.time && a.time.toLowerCase().includes(termo))
          );
        }

        result.sort((a, b) => (b.pontos || 0) - (a.pontos || 0));

        if (limit && limit > 0) {
          result = result.slice(0, limit);
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
          const idx = artilharia.findIndex(a => a.id === body.id);
          if (idx !== -1) {
            artilharia[idx] = { ...artilharia[idx], ...body };
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({ success: true, data: artilharia[idx] })
            };
          }
        }

        const newId = artilharia.length > 0 ? Math.max(...artilharia.map(a => a.id)) + 1 : 1;
        const novoAtleta = {
          id: newId,
          nome: body.nome,
          time: body.time,
          classe: body.classe || '',
          pontos: body.pontos || 0,
          jogos: body.jogos || []
        };
        artilharia.push(novoAtleta);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, data: novoAtleta })
        };
      }

      case 'PUT': {
        const body = JSON.parse(event.body);
        if (!body.id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID do atleta e obrigatorio para atualizacao' })
          };
        }

        const idx = artilharia.findIndex(a => a.id === body.id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Atleta nao encontrado na artilharia' })
          };
        }

        artilharia[idx] = { ...artilharia[idx], ...body };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: artilharia[idx] })
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

        const idx = artilharia.findIndex(a => a.id === id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Atleta nao encontrado na artilharia' })
          };
        }

        artilharia = artilharia.filter(a => a.id !== id);

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
