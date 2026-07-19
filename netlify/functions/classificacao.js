const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

let classificacao = [
  { equipe: 'AFLODEF/OMDA/FMEFLORIPA',                  logo: 'logos/aflodef.png',         jogos: 8, vitorias: 8, derrotas: 0, pontosPro: 313, pontosContra: 198, saldo: 115, pontos: 16 },
  { equipe: 'Tigres Sobre Rodas/FME Criciúma',           logo: 'logos/tigres.png',          jogos: 8, vitorias: 7, derrotas: 1, pontosPro: 312, pontosContra: 223, saldo: 89,  pontos: 14 },
  { equipe: 'ÁGUIAS/SESPORT CONCÓRDIA',                  logo: 'logos/aguias.png',          jogos: 8, vitorias: 5, derrotas: 3, pontosPro: 264, pontosContra: 263, saldo: 1,   pontos: 10 },
  { equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', logo: 'logos/spartacus.png',       jogos: 8, vitorias: 4, derrotas: 4, pontosPro: 242, pontosContra: 258, saldo: -16, pontos: 8  },
  { equipe: 'CEPE/Raposas do Sul/Sesporte',              logo: 'logos/cepe.png',            jogos: 8, vitorias: 3, derrotas: 5, pontosPro: 231, pontosContra: 253, saldo: -22, pontos: 6  },
  { equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS',         logo: 'logos/apedeb.png',          jogos: 8, vitorias: 0, derrotas: 8, pontosPro: 172, pontosContra: 335, saldo: -163,pontos: 0  }
];

function ordenarClassificacao(list) {
  return list.sort((a, b) => {
    const ptsA = a.pontos ?? (a.vitorias * 2 + a.derrotas);
    const ptsB = b.pontos ?? (b.vitorias * 2 + b.derrotas);
    if (ptsB !== ptsA) return ptsB - ptsA;
    return (b.pontosPro - b.pontosContra) - (a.pontosPro - a.pontosContra);
  });
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const result = ordenarClassificacao([...classificacao]);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result)
        };
      }

      case 'POST': {
        const body = JSON.parse(event.body);

        if (body.equipe) {
          const idx = classificacao.findIndex(c => c.equipe === body.equipe);
          if (idx !== -1) {
            classificacao[idx] = { ...classificacao[idx], ...body };
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({ success: true, data: classificacao[idx] })
            };
          }

          const novoRegistro = {
            equipe: body.equipe,
            logo: body.logo || '',
            jogos: body.jogos || 0,
            vitorias: body.vitorias || 0,
            derrotas: body.derrotas || 0,
            pontosPro: body.pontosPro || 0,
            pontosContra: body.pontosContra || 0,
            saldo: body.saldo || 0,
            pontos: body.pontos || 0
          };
          classificacao.push(novoRegistro);

          return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ success: true, data: novoRegistro })
          };
        }

        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Campo equipe e obrigatorio' })
        };
      }

      case 'PUT': {
        const body = JSON.parse(event.body);

        if (!body.equipe) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Campo equipe e obrigatorio para atualizacao' })
          };
        }

        const idx = classificacao.findIndex(c => c.equipe === body.equipe);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Equipe nao encontrada na classificacao' })
          };
        }

        classificacao[idx] = { ...classificacao[idx], ...body };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: classificacao[idx] })
        };
      }

      case 'DELETE': {
        const params = new URLSearchParams(event.queryStringParameters || {});
        const equipe = params.get('equipe');

        if (!equipe) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Campo equipe e obrigatorio para exclusao' })
          };
        }

        const idx = classificacao.findIndex(c => c.equipe === equipe);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Equipe nao encontrada na classificacao' })
          };
        }

        classificacao = classificacao.filter(c => c.equipe !== equipe);

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
