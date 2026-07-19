const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

let jogos = [
  { id: 1,  data: '16/05', hora: '14:00', equipeCasa: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', equipeFora: 'AFLODEF/OMDA/FMEFLORIPA',         placarCasa: 23, placarFora: 38, fase: 'Fase de Grupos',   rodada: 1, local: 'Ginásio Central' },
  { id: 2,  data: '16/05', hora: '16:00', equipeCasa: 'ÁGUIAS/SESPORT CONCÓRDIA',            equipeFora: 'CEPE/Raposas do Sul/Sesporte',          placarCasa: 30, placarFora: 28, fase: 'Fase de Grupos',   rodada: 1, local: 'Ginásio Central' },
  { id: 3,  data: '16/05', hora: '18:00', equipeCasa: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', equipeFora: 'Tigres Sobre Rodas/FME Criciúma', placarCasa: 35, placarFora: 40, fase: 'Fase de Grupos',   rodada: 1, local: 'Ginásio Central' },
  { id: 4,  data: '23/05', hora: '14:00', equipeCasa: 'AFLODEF/OMDA/FMEFLORIPA',             equipeFora: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', placarCasa: 42, placarFora: 20, fase: 'Fase de Grupos',   rodada: 2, local: 'Ginásio Central' },
  { id: 5,  data: '23/05', hora: '16:00', equipeCasa: 'CEPE/Raposas do Sul/Sesporte',        equipeFora: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS',         placarCasa: 36, placarFora: 25, fase: 'Fase de Grupos',   rodada: 2, local: 'Ginásio Central' },
  { id: 6,  data: '23/05', hora: '18:00', equipeCasa: 'Tigres Sobre Rodas/FME Criciúma',     equipeFora: 'ÁGUIAS/SESPORT CONCÓRDIA',                placarCasa: 44, placarFora: 32, fase: 'Fase de Grupos',   rodada: 2, local: 'Ginásio Central' },
  { id: 7,  data: '30/05', hora: '14:00', equipeCasa: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS',    equipeFora: 'Tigres Sobre Rodas/FME Criciúma',         placarCasa: 20, placarFora: 45, fase: 'Fase de Grupos',   rodada: 3, local: 'Ginásio Central' },
  { id: 8,  data: '30/05', hora: '16:00', equipeCasa: 'ÁGUIAS/SESPORT CONCÓRDIA',            equipeFora: 'AFLODEF/OMDA/FMEFLORIPA',                 placarCasa: 27, placarFora: 40, fase: 'Fase de Grupos',   rodada: 3, local: 'Ginásio Central' },
  { id: 9,  data: '30/05', hora: '18:00', equipeCasa: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', equipeFora: 'CEPE/Raposas do Sul/Sesporte',      placarCasa: 33, placarFora: 30, fase: 'Fase de Grupos',   rodada: 3, local: 'Ginásio Central' },
  { id: 10, data: '06/06', hora: '14:00', equipeCasa: 'CEPE/Raposas do Sul/Sesporte',        equipeFora: 'AFLODEF/OMDA/FMEFLORIPA',                 placarCasa: 22, placarFora: 35, fase: 'Fase de Grupos',   rodada: 4, local: 'Ginásio Central' },
  { id: 11, data: '06/06', hora: '16:00', equipeCasa: 'Tigres Sobre Rodas/FME Criciúma',     equipeFora: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS',         placarCasa: 48, placarFora: 18, fase: 'Fase de Grupos',   rodada: 4, local: 'Ginásio Central' },
  { id: 12, data: '06/06', hora: '18:00', equipeCasa: 'ÁGUIAS/SESPORT CONCÓRDIA',            equipeFora: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', placarCasa: 31, placarFora: 29, fase: 'Fase de Grupos',  rodada: 4, local: 'Ginásio Central' },
  { id: 13, data: '13/06', hora: '14:00', equipeCasa: 'AFLODEF/OMDA/FMEFLORIPA',             equipeFora: 'Tigres Sobre Rodas/FME Criciúma',         placarCasa: 38, placarFora: 34, fase: 'Fase de Grupos',   rodada: 5, local: 'Ginásio Central' },
  { id: 14, data: '13/06', hora: '16:00', equipeCasa: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS',    equipeFora: 'ÁGUIAS/SESPORT CONCÓRDIA',                placarCasa: 19, placarFora: 36, fase: 'Fase de Grupos',   rodada: 5, local: 'Ginásio Central' },
  { id: 15, data: '13/06', hora: '18:00', equipeCasa: 'CEPE/Raposas do Sul/Sesporte',        equipeFora: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', placarCasa: 27, placarFora: 32, fase: 'Fase de Grupos',  rodada: 5, local: 'Ginásio Central' },
  { id: 16, data: '20/06', hora: '14:00', equipeCasa: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', equipeFora: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS',   placarCasa: 40, placarFora: 21, fase: 'Fase de Grupos',   rodada: 6, local: 'Ginásio Central' },
  { id: 17, data: '20/06', hora: '16:00', equipeCasa: 'AFLODEF/OMDA/FMEFLORIPA',             equipeFora: 'CEPE/Raposas do Sul/Sesporte',            placarCasa: 37, placarFora: 26, fase: 'Fase de Grupos',   rodada: 6, local: 'Ginásio Central' },
  { id: 18, data: '20/06', hora: '18:00', equipeCasa: 'Tigres Sobre Rodas/FME Criciúma',     equipeFora: 'ÁGUIAS/SESPORT CONCÓRDIA',                placarCasa: 41, placarFora: 30, fase: 'Fase de Grupos',   rodada: 6, local: 'Ginásio Central' },
  { id: 19, data: '11/07', hora: '14:00', equipeCasa: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS',    equipeFora: 'CEPE/Raposas do Sul/Sesporte',            placarCasa: 24, placarFora: 33, fase: 'Fase de Grupos',   rodada: 7, local: 'Ginásio Central' },
  { id: 20, data: '11/07', hora: '16:00', equipeCasa: 'ÁGUIAS/SESPORT CONCÓRDIA',            equipeFora: 'Tigres Sobre Rodas/FME Criciúma',         placarCasa: 28, placarFora: 42, fase: 'Fase de Grupos',   rodada: 7, local: 'Ginásio Central' },
  { id: 21, data: '11/07', hora: '18:00', equipeCasa: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', equipeFora: 'AFLODEF/OMDA/FMEFLORIPA',             placarCasa: 18, placarFora: 44, fase: 'Fase de Grupos',   rodada: 7, local: 'Ginásio Central' },
  { id: 22, data: '18/07', hora: '14:00', equipeCasa: 'AFLODEF/OMDA/FMEFLORIPA',             equipeFora: 'ÁGUIAS/SESPORT CONCÓRDIA',                placarCasa: 39, placarFora: 25, fase: 'Fase de Grupos',   rodada: 8, local: 'Ginásio Central' },
  { id: 23, data: '18/07', hora: '16:00', equipeCasa: 'CEPE/Raposas do Sul/Sesporte',        equipeFora: 'Tigres Sobre Rodas/FME Criciúma',         placarCasa: 29, placarFora: 38, fase: 'Fase de Grupos',   rodada: 8, local: 'Ginásio Central' },
  { id: 24, data: '18/07', hora: '18:00', equipeCasa: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS',    equipeFora: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', placarCasa: 22, placarFora: 35, fase: 'Fase de Grupos',  rodada: 8, local: 'Ginásio Central' },
  { id: 25, data: '01/08', hora: '14:00', equipeCasa: 'Tigres Sobre Rodas/FME Criciúma',     equipeFora: 'AFLODEF/OMDA/FMEFLORIPA',                 placarCasa: 0,  placarFora: 0,  fase: 'Semifinal',        rodada: 1, local: 'Ginásio Central' },
  { id: 26, data: '01/08', hora: '16:00', equipeCasa: 'ÁGUIAS/SESPORT CONCÓRDIA',            equipeFora: 'CEPE/Raposas do Sul/Sesporte',            placarCasa: 0,  placarFora: 0,  fase: 'Semifinal',        rodada: 1, local: 'Ginásio Central' },
  { id: 27, data: '08/08', hora: '14:00', equipeCasa: 'AFLODEF/OMDA/FMEFLORIPA',             equipeFora: 'Tigres Sobre Rodas/FME Criciúma',         placarCasa: 0,  placarFora: 0,  fase: 'Semifinal',        rodada: 2, local: 'Ginásio Central' },
  { id: 28, data: '08/08', hora: '16:00', equipeCasa: 'CEPE/Raposas do Sul/Sesporte',        equipeFora: 'ÁGUIAS/SESPORT CONCÓRDIA',                placarCasa: 0,  placarFora: 0,  fase: 'Semifinal',        rodada: 2, local: 'Ginásio Central' },
  { id: 29, data: '22/08', hora: '18:00', equipeCasa: 'A definir',                           equipeFora: 'A definir',                               placarCasa: 0,  placarFora: 0,  fase: 'Disputa 5º Lugar', rodada: 1, local: 'Ginásio Central' },
  { id: 30, data: '12/10', hora: '18:00', equipeCasa: 'A definir',                           equipeFora: 'A definir',                               placarCasa: 0,  placarFora: 0,  fase: 'Disputa 3º Lugar', rodada: 1, local: 'Ginásio Central' },
  { id: 31, data: '07/11', hora: '18:00', equipeCasa: 'A definir',                           equipeFora: 'A definir',                               placarCasa: 0,  placarFora: 0,  fase: 'Final',            rodada: 1, local: 'Ginásio Central' },
  { id: 32, data: '14/11', hora: '18:00', equipeCasa: 'A definir',                           equipeFora: 'A definir',                               placarCasa: 0,  placarFora: 0,  fase: 'Final',            rodada: 2, local: 'Ginásio Central' }
];

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const params = new URLSearchParams(event.queryStringParameters || {});
        const status = params.get('status');
        const fase = params.get('fase');
        const rodada = params.get('rodada');

        let result = [...jogos];

        if (status) {
          result = result.filter(j => j.status === status);
        }
        if (fase) {
          result = result.filter(j => j.fase === fase);
        }
        if (rodada) {
          result = result.filter(j => j.rodada === parseInt(rodada));
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
          const idx = jogos.findIndex(j => j.id === body.id);
          if (idx !== -1) {
            jogos[idx] = { ...jogos[idx], ...body };
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({ success: true, data: jogos[idx] })
            };
          }
        }

        const newId = jogos.length > 0 ? Math.max(...jogos.map(j => j.id)) + 1 : 1;
        const novoJogo = { id: newId, ...body };
        jogos.push(novoJogo);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, data: novoJogo })
        };
      }

      case 'PUT': {
        const body = JSON.parse(event.body);
        if (!body.id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID do jogo e obrigatorio para atualizacao' })
          };
        }

        const idx = jogos.findIndex(j => j.id === body.id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Jogo nao encontrado' })
          };
        }

        jogos[idx] = { ...jogos[idx], ...body };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: jogos[idx] })
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

        const idx = jogos.findIndex(j => j.id === id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Jogo nao encontrado' })
          };
        }

        jogos = jogos.filter(j => j.id !== id);

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
