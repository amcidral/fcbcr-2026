const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

let atletas = [
  { id: 1, nome: 'Jean Carlos Homem', numero: 11, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Armador' },
  { id: 2, nome: 'Thiago da Silva Bispo', numero: 7, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Ala' },
  { id: 3, nome: 'Ruan Felipe da Silva', numero: 1, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Ala' },
  { id: 4, nome: 'Gabriel de Lima Machado', numero: 10, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Pivô' },
  { id: 5, nome: 'Lucas da Silva Machado', numero: 23, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Ala' },
  { id: 6, nome: 'Wagner Luiz Theobald', numero: 5, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Armador' },
  { id: 7, nome: 'Bruno Henrique da Silva', numero: 8, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Pivô' },
  { id: 8, nome: 'Carlos Eduardo Pereira', numero: 14, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Ala' },
  { id: 9, nome: 'Danilo de Souza', numero: 21, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Ala' },
  { id: 10, nome: 'Douglas da Silva Ramos', numero: 3, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Armador' },
  { id: 11, nome: 'Eduardo José de Souza', numero: 9, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Pivô' },
  { id: 12, nome: 'Felipe Augusto dos Santos', numero: 12, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Ala' },
  { id: 13, nome: 'Francisco Júnior da Silva', numero: 13, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Ala' },
  { id: 14, nome: 'Paulo Henrique de Souza', numero: 15, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Armador' },
  { id: 15, nome: 'Ygor Fernandes Marcelino', numero: 18, equipe: 'AFLODEF/OMDA/FMEFLORIPA', posicao: 'Ala' },

  { id: 16, nome: 'Adinan Danrlei', numero: 49, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Ala' },
  { id: 17, nome: 'Alexandre Schneider', numero: 10, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Armador' },
  { id: 18, nome: 'André Luis Zanotelli', numero: 5, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Pivô' },
  { id: 19, nome: 'Carlos Rafael da Cunha', numero: 8, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Ala' },
  { id: 20, nome: 'Cristian Vinicius Pereira', numero: 21, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Ala' },
  { id: 21, nome: 'Danieli de Oliveira', numero: 11, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Ala' },
  { id: 22, nome: 'Eduardo Henrique Zanotelli', numero: 7, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Armador' },
  { id: 23, nome: 'Gilberto da Silva', numero: 12, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Pivô' },
  { id: 24, nome: 'João Pedro Schons', numero: 14, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Ala' },
  { id: 25, nome: 'Leandro Bordin', numero: 3, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Armador' },
  { id: 26, nome: 'Lucas Gabriel da Rosa', numero: 9, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Ala' },
  { id: 27, nome: 'Márcio Ricardo dos Santos', numero: 15, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Pivô' },
  { id: 28, nome: 'Rafael Henrique da Cunha', numero: 23, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Ala' },
  { id: 29, nome: 'Tiago dos Santos da Silva', numero: 4, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Ala' },
  { id: 30, nome: 'Wellington Christian Renosto', numero: 7, equipe: 'ÁGUIAS/SESPORT CONCÓRDIA', posicao: 'Armador' },

  { id: 31, nome: 'Jorge Manoel', numero: 19, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Pivô' },
  { id: 32, nome: 'Alexsandro da Silva', numero: 5, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Ala' },
  { id: 33, nome: 'Bruno Henrique Bischof', numero: 10, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Armador' },
  { id: 34, nome: 'Carlos Rafael Machado', numero: 11, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Ala' },
  { id: 35, nome: 'Claudio Luis de Souza', numero: 7, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Ala' },
  { id: 36, nome: 'Danilo de Souza Lima', numero: 8, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Ala' },
  { id: 37, nome: 'Elias da Silva Pereira', numero: 12, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Pivô' },
  { id: 38, nome: 'Francisco Anerson da Silva', numero: 3, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Armador' },
  { id: 39, nome: 'Geovani dos Santos', numero: 13, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Ala' },
  { id: 40, nome: 'Higor Vinicius Pereira', numero: 9, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Ala' },
  { id: 41, nome: 'Igor Rafael da Cunha', numero: 14, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Armador' },
  { id: 42, nome: 'João Victor de Souza', numero: 21, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Ala' },
  { id: 43, nome: 'Leandro da Silva Machado', numero: 15, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Pivô' },
  { id: 44, nome: 'Marcos Vinicius dos Santos', numero: 23, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Ala' },
  { id: 45, nome: 'Diego dos Santos', numero: 6, equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS', posicao: 'Ala' },

  { id: 46, nome: 'Ryan Xavier', numero: 1, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Armador' },
  { id: 47, nome: 'Alexandre Pereira da Silva', numero: 3, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Ala' },
  { id: 48, nome: 'Bruno da Silva Santos', numero: 4, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Pivô' },
  { id: 49, nome: 'Carlos Eduardo Machado', numero: 7, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Ala' },
  { id: 50, nome: 'Daniel da Rosa Pereira', numero: 8, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Ala' },
  { id: 51, nome: 'Eduardo Henrique da Cunha', numero: 9, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Armador' },
  { id: 52, nome: 'Felipe da Silva Souza', numero: 10, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Ala' },
  { id: 53, nome: 'Gabriel Henrique de Souza', numero: 11, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Pivô' },
  { id: 54, nome: 'Hugo Leonardo da Silva', numero: 12, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Ala' },
  { id: 55, nome: 'Igor Felipe dos Santos', numero: 13, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Ala' },
  { id: 56, nome: 'João Paulo de Lima', numero: 14, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Armador' },
  { id: 57, nome: 'Kevin Lucas da Rosa', numero: 15, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Ala' },
  { id: 58, nome: 'Lucas Gabriel dos Santos', numero: 21, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Pivô' },
  { id: 59, nome: 'Matheus Henrique Pereira', numero: 23, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Ala' },
  { id: 60, nome: 'Natan da Silva Machado', numero: 30, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Ala' },
  { id: 61, nome: 'Dario Schulz Filho', numero: 5, equipe: 'CEPE/Raposas do Sul/Sesporte', posicao: 'Ala' },

  { id: 62, nome: 'Cleiton dos Santos', numero: 99, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Pivô' },
  { id: 63, nome: 'Alexsandro Machado', numero: 5, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Ala' },
  { id: 64, nome: 'Bruno da Silva Ramos', numero: 7, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Ala' },
  { id: 65, nome: 'Carlos Henrique de Souza', numero: 8, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Armador' },
  { id: 66, nome: 'Danieli dos Santos', numero: 9, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Ala' },
  { id: 67, nome: 'Eduardo da Silva Machado', numero: 10, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Ala' },
  { id: 68, nome: 'Felipe Augusto da Rosa', numero: 11, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Armador' },
  { id: 69, nome: 'Gabriel da Silva Pereira', numero: 12, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Pivô' },
  { id: 70, nome: 'Higor Vinicius dos Santos', numero: 13, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Ala' },
  { id: 71, nome: 'Igor Rafael da Silva', numero: 14, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Ala' },
  { id: 72, nome: 'João Pedro da Cunha', numero: 15, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Armador' },
  { id: 73, nome: 'Helton Lopes', numero: 21, equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', posicao: 'Pivô' },

  { id: 74, nome: 'Jose Felipe Pavan', numero: 83, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Pivô' },
  { id: 75, nome: 'Alexsandro da Silva Ramos', numero: 3, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Ala' },
  { id: 76, nome: 'Bruno Henrique da Rosa', numero: 5, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Ala' },
  { id: 77, nome: 'Carlos Eduardo da Silva', numero: 7, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Armador' },
  { id: 78, nome: 'Daniel Henrique Machado', numero: 8, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Ala' },
  { id: 79, nome: 'Eduardo Felipe de Souza', numero: 9, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Ala' },
  { id: 80, nome: 'Fábio Henrique da Cunha', numero: 10, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Armador' },
  { id: 81, nome: 'Gabriel Henrique dos Santos', numero: 11, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Pivô' },
  { id: 82, nome: 'Higor Leonardo da Silva', numero: 12, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Ala' },
  { id: 83, nome: 'Igor Vinicius Pereira', numero: 13, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Ala' },
  { id: 84, nome: 'João Vitor de Souza', numero: 14, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Armador' },
  { id: 85, nome: 'Lucas Fernando Machado', numero: 15, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Ala' },
  { id: 86, nome: 'Helton Lopes Ferreira Souza', numero: 21, equipe: 'Tigres Sobre Rodas/FME Criciúma', posicao: 'Pivô' }
];

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const params = new URLSearchParams(event.queryStringParameters || {});
        const equipe = params.get('equipe');
        const busca = params.get('busca');

        let result = [...atletas];

        if (equipe) {
          result = result.filter(a => a.equipe === equipe);
        }
        if (busca) {
          const termo = busca.toLowerCase();
          result = result.filter(a => a.nome.toLowerCase().includes(termo));
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
          const idx = atletas.findIndex(a => a.id === body.id);
          if (idx !== -1) {
            atletas[idx] = { ...atletas[idx], ...body };
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({ success: true, data: atletas[idx] })
            };
          }
        }

        const newId = atletas.length > 0 ? Math.max(...atletas.map(a => a.id)) + 1 : 1;
        const novoAtleta = {
          id: newId,
          nome: body.nome,
          numero: body.numero,
          equipe: body.equipe,
          posicao: body.posicao || 'Ala'
        };
        atletas.push(novoAtleta);

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

        const idx = atletas.findIndex(a => a.id === body.id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Atleta nao encontrado' })
          };
        }

        atletas[idx] = { ...atletas[idx], ...body };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: atletas[idx] })
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

        const idx = atletas.findIndex(a => a.id === id);
        if (idx === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Atleta nao encontrado' })
          };
        }

        atletas = atletas.filter(a => a.id !== id);

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
