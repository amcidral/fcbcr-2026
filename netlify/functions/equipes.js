const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

let equipes = [
  { id: 1, nome: 'AFLODEF/OMDA/FMEFLORIPA',                  logo: 'logos/aflodef.png' },
  { id: 2, nome: 'ÁGUIAS/SESPORT CONCÓRDIA',                  logo: 'logos/aguias.png' },
  { id: 3, nome: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS',         logo: 'logos/apedeb.png' },
  { id: 4, nome: 'CEPE/Raposas do Sul/Sesporte',              logo: 'logos/cepe.png' },
  { id: 5, nome: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', logo: 'logos/spartacus.png' },
  { id: 6, nome: 'Tigres Sobre Rodas/FME Criciúma',           logo: 'logos/tigres.png' }
];

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const params = new URLSearchParams(event.queryStringParameters || {});
        const busca = params.get('busca');
        let result = [...equipes];

        if (busca) {
          const termo = busca.toLowerCase();
          result = result.filter(e => e.nome.toLowerCase().includes(termo));
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
          const idx = equipes.findIndex(e => e.id === body.id);
          if (idx !== -1) {
            equipes[idx] = { ...equipes[idx], ...body };
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({ success: true, data: equipes[idx] })
            };
          }
        }

        const newId = equipes.length > 0 ? Math.max(...equipes.map(e => e.id)) + 1 : 1;
        const novaEquipe = { id: newId, nome: body.nome, logo: body.logo || '' };
        equipes.push(novaEquipe);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, data: novaEquipe })
        };
      }

      case 'PUT': {
        const body = JSON.parse(event.body);
        if (!body.id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID da equipe e obrigatorio para atualizacao' })
          };
        }

        const idx = equipes.findIndex(e => e.id === body.id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Equipe nao encontrada' })
          };
        }

        equipes[idx] = { ...equipes[idx], ...body };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: equipes[idx] })
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

        const idx = equipes.findIndex(e => e.id === id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Equipe nao encontrada' })
          };
        }

        equipes = equipes.filter(e => e.id !== id);

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
