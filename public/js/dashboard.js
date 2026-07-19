// ==========================================
// FCBCR - Dashboard Publico
// ==========================================

const emoticonsTimes = {
    'CEPE/Raposas do Sul/Sesporte': '🛡️',
    'APEDEB/FME BRUSQUE/CLASSE MÓVEIS': '🦅',
    'ÁGUIAS/SESPORT CONCÓRDIA': '🦅',
    'Spartacus/SESC/Sec. Esp. e Lazer/Caçador': '🛡️',
    'AFLODEF/OMDA/FMEFLORIPA': '♿',
    'Tigres Sobre Rodas/FME Criciúma': '🐯'
};

function renderBannerProximoJogo() {
    const jogos = JSON.parse(localStorage.getItem('jogos')) || [];
    const classificacao = JSON.parse(localStorage.getItem('classificacao')) || [];
    const agora = new Date();

    const proximo = jogos
        .filter(j => j.status !== 'Publicado')
        .sort((a, b) => {
            const [dA, mA] = a.data.split('/');
            const [dB, mB] = b.data.split('/');
            return new Date(2026, parseInt(mA) - 1, parseInt(dA)) - new Date(2026, parseInt(mB) - 1, parseInt(dB));
        })
        .filter(j => {
            const [dia, mes] = j.data.split('/');
            const [hora, min] = (j.hora || '00:00').split(':');
            return new Date(2026, parseInt(mes) - 1, parseInt(dia), parseInt(hora), parseInt(min)) > agora;
        })[0];

    if (!proximo) return;

    const getCidade = (nome) => { const cl = classificacao.find(t => t.time === nome); return cl ? cl.cidade : ''; };
    const getLogo = (nome) => { const cl = classificacao.find(t => t.time === nome); return cl && cl.logo ? cl.logo : ''; };

    const logoCasa = getLogo(proximo.casa);
    const logoFora = getLogo(proximo.fora);

    const bannerCasaLogo = document.getElementById('bannerCasaLogo');
    const bannerCasaEmoji = document.getElementById('bannerCasaEmoji');
    if (bannerCasaLogo) {
        if (logoCasa) { bannerCasaLogo.src = logoCasa; bannerCasaLogo.alt = proximo.casa; bannerCasaLogo.style.display = 'block'; bannerCasaEmoji.style.display = 'none'; }
        else { bannerCasaLogo.style.display = 'none'; bannerCasaEmoji.style.display = 'block'; bannerCasaEmoji.innerText = emoticonsTimes[proximo.casa] || '🏀'; }
    }

    const bannerForaLogo = document.getElementById('bannerForaLogo');
    const bannerForaEmoji = document.getElementById('bannerForaEmoji');
    if (bannerForaLogo) {
        if (logoFora) { bannerForaLogo.src = logoFora; bannerForaLogo.alt = proximo.fora; bannerForaLogo.style.display = 'block'; bannerForaEmoji.style.display = 'none'; }
        else { bannerForaLogo.style.display = 'none'; bannerForaEmoji.style.display = 'block'; bannerForaEmoji.innerText = emoticonsTimes[proximo.fora] || '🏀'; }
    }

    document.getElementById('bannerCasaNome').innerText = proximo.casa;
    document.getElementById('bannerCasaCidade').innerText = getCidade(proximo.casa);
    document.getElementById('bannerForaNome').innerText = proximo.fora;
    document.getElementById('bannerForaCidade').innerText = getCidade(proximo.fora);

    const partesData = proximo.data.split('/');
    document.getElementById('bannerData').innerText = `${partesData[0]}/${partesData[1]}/2026`;
    document.getElementById('bannerHora').innerText = proximo.hora;
    document.getElementById('bannerLocal').innerText = proximo.local || 'A definir';
}

function carregarDadosPublicos() {
    renderBannerProximoJogo();
    setInterval(renderBannerProximoJogo, 60000);

    const classificacao = JSON.parse(localStorage.getItem('classificacao')) || [];
    classificacao.sort((a, b) => {
        const ptsA = a.pts ?? (a.v * 2 + a.d);
        const ptsB = b.pts ?? (b.v * 2 + b.d);
        if (ptsB !== ptsA) return ptsB - ptsA;
        return (b.ptsPro - b.ptsContra) - (a.ptsPro - a.ptsContra);
    });

    const corpoClassificacao = document.getElementById('corpoClassificacao');
    corpoClassificacao.innerHTML = '';
    classificacao.forEach((t, i) => {
        const totalJogos = t.v + t.d;
        const totalPontos = t.pts ?? (t.v * 2 + t.d * 1);
        let badgeRank = 'bg-slate-100 text-slate-500 text-[10px]';
        let medal = '';
        if (i === 0) { badgeRank = 'bg-yellow-400 text-slate-900 font-black text-[11px] shadow-sm shadow-yellow-300'; }
        if (i === 1) { badgeRank = 'bg-slate-300 text-slate-800 font-black text-[11px] shadow-sm shadow-slate-200'; }
        if (i === 2) { badgeRank = 'bg-amber-500 text-white font-black text-[11px] shadow-sm shadow-amber-300'; }
        corpoClassificacao.innerHTML += `<tr class="hover:bg-slate-50 transition"><td class="py-2.5 px-2 text-center"><span class="w-6 h-6 rounded-full ${badgeRank} flex items-center justify-center mx-auto">${medal}${i + 1}</span></td><td class="py-2.5 px-2 font-bold text-slate-800 truncate max-w-[120px]"><span>${emoticonsTimes[t.time] || '🏀'}</span> ${t.time}</td><td class="py-2.5 px-1 text-center text-slate-500">${totalJogos}</td><td class="py-2.5 px-1 text-center text-green-600 font-bold">${t.v}</td><td class="py-2.5 px-1 text-center text-red-500 font-bold">${t.d}</td><td class="py-2.5 px-2 text-center font-black text-blue-600 text-sm">${totalPontos}</td></tr>`;
    });

    const jogos = JSON.parse(localStorage.getItem('jogos')) || [];
    const corpoResultados = document.getElementById('corpoResultados');
    const corpoProximasPartidas = document.getElementById('corpoProximasPartidas');
    corpoResultados.innerHTML = '';
    corpoProximasPartidas.innerHTML = '';

    const publicados = jogos.filter(j => j.status === 'Publicado');
    const proximos = jogos.filter(j => j.status !== 'Publicado');

    document.getElementById('totalEquipesCampeonato').innerText = classificacao.length;
    document.getElementById('contadorJogosRealizados').innerHTML = `${publicados.length} <span class="text-lg font-normal text-slate-400">/ 36</span>`;

    const atletasPorEquipe = JSON.parse(localStorage.getItem('atletasPorEquipe')) || {};
    let totalAtletas = 0;
    Object.values(atletasPorEquipe).forEach(lista => { totalAtletas += (lista || []).length; });
    document.getElementById('totalAtletasCampeonato').innerText = totalAtletas;

    let totalPontosPro = publicados.reduce((acc, j) => acc + (j.pontosCasa || 0) + (j.pontosFora || 0), 0);
    document.getElementById('totalPontosCampeonato').innerText = totalPontosPro;
    document.getElementById('mediaGeralPontos').innerText = publicados.length > 0 ? (totalPontosPro / publicados.length).toFixed(1) : "0.0";

    if (publicados.length === 0) {
        corpoResultados.innerHTML = '<p class="text-xs text-slate-400 text-center py-4">Nenhum resultado de jogo publicado ainda.</p>';
    } else {
        publicados.slice(0, 4).forEach(jogo => {
            const destaqueCasa = jogo.pontosCasa > jogo.pontosFora ? 'text-green-600' : 'text-slate-500';
            const destaqueFora = jogo.pontosFora > jogo.pontosCasa ? 'text-green-600' : 'text-slate-500';
            corpoResultados.innerHTML += `<div class="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs"><div class="flex flex-col text-slate-400 font-bold shrink-0"><span>${jogo.data.split('/')[0]}</span><span class="text-[10px] font-normal uppercase">MES</span></div><div class="flex-1 px-4 flex items-center justify-between font-bold text-slate-800"><span class="truncate">${jogo.casa}</span><div class="flex items-center gap-2 bg-white px-2 py-1 rounded shadow-sm mx-2 shrink-0"><span class="${destaqueCasa}">${jogo.pontosCasa}</span><span class="text-slate-300 font-normal">x</span><span class="${destaqueFora}">${jogo.pontosFora}</span></div><span class="truncate">${jogo.fora}</span></div></div>`;
        });
    }

    if (proximos.length === 0) {
        corpoProximasPartidas.innerHTML = '<p class="text-xs text-slate-400 py-4 col-span-3">Nenhum próximo jogo agendado no momento.</p>';
    } else {
        const meses = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
        proximos.slice(0, 3).forEach((jogo, index) => {
            const logoCasa = getLogoUrl(jogo.casa);
            const logoFora = getLogoUrl(jogo.fora);
            const partesData = jogo.data.split('/');
            const mesLabel = meses[parseInt(partesData[1]) - 1] || '';
            corpoProximasPartidas.innerHTML += `<div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-blue-400 transition flex flex-col justify-between gap-4"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><div class="bg-blue-600 text-white font-black text-xs px-2.5 py-1.5 rounded flex flex-col items-center leading-none"><span>${partesData[0]}</span><span class="text-[8px] font-normal mt-0.5 uppercase">${mesLabel}</span></div><div class="text-xs text-slate-500 font-bold">${jogo.hora}</div></div><span class="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold uppercase">Rodada ${index + 15}</span></div><div class="flex items-center justify-around gap-2"><div class="flex flex-col items-center gap-1.5 w-1/3"><div class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center p-1.5 border border-slate-200 overflow-hidden">${logoCasa ? '<img src="' + logoCasa + '" class="w-full h-full object-contain" onerror="this.style.display=\'none\'">' : '<span class="text-2xl">' + (emoticonsTimes[jogo.casa] || '🏀') + '</span>'}</div><span class="text-[10px] font-bold text-slate-700 text-center leading-tight">${jogo.casa}</span></div><span class="text-fcbcr-accent font-black italic text-sm">VS</span><div class="flex flex-col items-center gap-1.5 w-1/3"><div class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center p-1.5 border border-slate-200 overflow-hidden">${logoFora ? '<img src="' + logoFora + '" class="w-full h-full object-contain" onerror="this.style.display=\'none\'">' : '<span class="text-2xl">' + (emoticonsTimes[jogo.fora] || '🏀') + '</span>'}</div><span class="text-[10px] font-bold text-slate-700 text-center leading-tight">${jogo.fora}</span></div></div><div class="border-t border-slate-50 pt-2 flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold"><i class="fa-solid fa-location-dot text-blue-500"></i><span class="truncate">${jogo.local || 'A definir'}</span></div></div>`;
        });
    }

    const artilharia = JSON.parse(localStorage.getItem('artilharia')) || [];
    const corpoCestinhas = document.getElementById('corpoCestinhas');
    corpoCestinhas.innerHTML = '';
    artilharia.slice(0, 5).forEach((atleta, index) => {
        let badgeRank = 'bg-slate-200 text-slate-600';
        if (index === 0) badgeRank = 'bg-yellow-400 text-slate-900';
        if (index === 1) badgeRank = 'bg-slate-300 text-slate-900';
        if (index === 2) badgeRank = 'bg-amber-600 text-white';
        corpoCestinhas.innerHTML += `<div class="flex items-center justify-between p-2 bg-slate-50/55 rounded-lg border border-slate-100 hover:bg-slate-50 transition"><div class="flex items-center gap-2"><span class="w-5 h-5 rounded-full ${badgeRank} font-extrabold text-[10px] flex items-center justify-center">${index + 1}</span><div><p class="text-[11px] font-bold text-slate-800 leading-none cursor-pointer hover:text-blue-600 transition" onclick="abrirModalJogador(${atleta.id})">${atleta.nome}</p><p class="text-[9px] font-bold text-blue-600 uppercase mt-0.5">${atleta.time}</p></div></div><div class="text-right"><p class="text-xs font-black text-slate-800">${atleta.pontos}</p><p class="text-[8px] text-slate-400 uppercase font-bold">Pts</p></div></div>`;
    });
}

function trocarAba(aba) {
    const abas = ['inicio', 'classificacao', 'resultados', 'calendario', 'cestinhas'];
    abas.forEach(a => {
        document.getElementById('aba-' + a).classList.add('hidden');
        const menuItem = document.getElementById('menu-' + a);
        menuItem.classList.remove('bg-fcbcr-blue', 'text-white', 'font-medium');
        menuItem.classList.add('text-blue-100', 'hover:bg-blue-900');
    });
    document.getElementById('aba-' + aba).classList.remove('hidden');
    const menuItem = document.getElementById('menu-' + aba);
    menuItem.classList.add('bg-fcbcr-blue', 'text-white', 'font-medium');
    menuItem.classList.remove('text-blue-100', 'hover:bg-blue-900');
    if (aba === 'classificacao') renderClassificacaoFull();
    if (aba === 'resultados') renderResultadosFull();
    if (aba === 'calendario') renderCalendarioFull();
    if (aba === 'cestinhas') renderCestinhasFull();
}

function renderClassificacaoFull() {
    const classificacao = JSON.parse(localStorage.getItem('classificacao')) || [];
    classificacao.sort((a, b) => { const ptsA = a.pts ?? (a.v * 2 + a.d); const ptsB = b.pts ?? (b.v * 2 + b.d); if (ptsB !== ptsA) return ptsB - ptsA; return (b.ptsPro - b.ptsContra) - (a.ptsPro - a.ptsContra); });
    const tbody = document.getElementById('corpoClassificacaoFull');
    tbody.innerHTML = '';
    classificacao.forEach((t, i) => {
        const totalJogos = t.v + t.d;
        const totalPontos = t.pts ?? (t.v * 2 + t.d * 1);
        let badgeRank = 'bg-slate-100 text-slate-500';
        if (i === 0) badgeRank = 'bg-yellow-400 text-slate-900 font-black shadow-sm shadow-yellow-300';
        if (i === 1) badgeRank = 'bg-slate-300 text-slate-800 font-black shadow-sm shadow-slate-200';
        if (i === 2) badgeRank = 'bg-amber-500 text-white font-black shadow-sm shadow-amber-300';
        tbody.innerHTML += `<tr class="hover:bg-slate-50 transition"><td class="py-3 px-3 text-center"><span class="w-7 h-7 rounded-full ${badgeRank} text-xs flex items-center justify-center mx-auto">${i + 1}</span></td><td class="py-3 px-3 flex items-center gap-2 font-bold text-slate-800">${t.logo ? '<img src="' + t.logo + '" class="w-6 h-6 object-contain rounded" onerror="this.style.display=\'none\'">' : ''}<span>${t.time}</span></td><td class="py-3 px-2 text-center text-slate-500">${totalJogos}</td><td class="py-3 px-2 text-center text-green-600 font-bold">${t.v}</td><td class="py-3 px-2 text-center text-red-500 font-bold">${t.d}</td><td class="py-3 px-2 text-center text-slate-500">${t.ptsPro || 0}</td><td class="py-3 px-2 text-center text-slate-500">${t.ptsContra || 0}</td><td class="py-3 px-3 text-center font-black text-blue-600 text-base">${totalPontos}</td></tr>`;
    });
}

function renderResultadosFull() {
    const jogos = JSON.parse(localStorage.getItem('jogos')) || [];
    const container = document.getElementById('corpoResultadosFull');
    container.innerHTML = '';
    const meses = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
    const publicados = jogos.filter(j => j.status === 'Publicado');
    if (publicados.length === 0) { container.innerHTML = '<p class="text-sm text-slate-400 text-center py-8 col-span-3">Nenhum resultado publicado ainda.</p>'; return; }
    publicados.forEach(jogo => {
        const partesData = jogo.data.split('/');
        const mesLabel = meses[parseInt(partesData[1]) - 1] || '';
        const logoCasa = getLogoUrl(jogo.casa);
        const logoFora = getLogoUrl(jogo.fora);
        const destaqueCasa = jogo.pontosCasa > jogo.pontosFora ? 'text-green-600 font-black' : 'text-slate-600 font-bold';
        const destaqueFora = jogo.pontosFora > jogo.pontosCasa ? 'text-green-600 font-black' : 'text-slate-600 font-bold';
        container.innerHTML += `<div onclick="abrirModalJogoDetalhes(${jogo.id})" class="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer hover:bg-green-100 hover:border-green-300 transition"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><div class="bg-blue-600 text-white font-black text-xs px-2.5 py-1.5 rounded flex flex-col items-center leading-none"><span>${partesData[0]}</span><span class="text-[8px] font-normal mt-0.5 uppercase">${mesLabel}</span></div><div class="text-xs text-slate-500 font-bold">${jogo.hora}</div></div><span class="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Finalizado</span></div><div class="flex items-center justify-around gap-2"><div class="flex flex-col items-center gap-1.5 w-1/3"><div class="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5 border border-slate-200 overflow-hidden">${logoCasa ? '<img src="' + logoCasa + '" class="w-full h-full object-contain" onerror="this.style.display=\'none\'">' : '<span class="text-xl">' + (emoticonsTimes[jogo.casa] || '🏀') + '</span>'}</div><span class="text-[10px] font-bold text-slate-700 text-center leading-tight">${jogo.casa}</span></div><div class="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm"><span class="${destaqueCasa} text-xl">${jogo.pontosCasa}</span><span class="text-slate-300 font-normal">x</span><span class="${destaqueFora} text-xl">${jogo.pontosFora}</span></div><div class="flex flex-col items-center gap-1.5 w-1/3"><div class="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5 border border-slate-200 overflow-hidden">${logoFora ? '<img src="' + logoFora + '" class="w-full h-full object-contain" onerror="this.style.display=\'none\'">' : '<span class="text-xl">' + (emoticonsTimes[jogo.fora] || '🏀') + '</span>'}</div><span class="text-[10px] font-bold text-slate-700 text-center leading-tight">${jogo.fora}</span></div></div><div class="border-t border-green-200/50 pt-2 flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold"><i class="fa-solid fa-location-dot text-blue-500"></i><span class="truncate">${jogo.local || 'A definir'}</span></div></div>`;
    });
}

function renderCalendarioFull() {
    const jogos = JSON.parse(localStorage.getItem('jogos')) || [];
    const container = document.getElementById('corpoCalendarioFull');
    container.innerHTML = '';
    const meses = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
    const proximos = jogos.filter(j => j.status !== 'Publicado');
    if (proximos.length === 0) { container.innerHTML = '<p class="text-sm text-slate-400 text-center py-8 col-span-3">Nenhum jogo agendado.</p>'; return; }
    proximos.forEach((jogo) => {
        const partesData = jogo.data.split('/');
        const mesLabel = meses[parseInt(partesData[1]) - 1] || '';
        const logoCasa = getLogoUrl(jogo.casa);
        const logoFora = getLogoUrl(jogo.fora);
        container.innerHTML += `<div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><div class="bg-blue-600 text-white font-black text-xs px-2.5 py-1.5 rounded flex flex-col items-center leading-none"><span>${partesData[0]}</span><span class="text-[8px] font-normal mt-0.5 uppercase">${mesLabel}</span></div><div class="text-xs text-slate-500 font-bold">${jogo.hora}</div></div><span class="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase">Agendado</span></div><div class="flex items-center justify-around gap-2"><div class="flex flex-col items-center gap-1.5 w-1/3"><div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center p-1.5 border border-slate-200 overflow-hidden">${logoCasa ? '<img src="' + logoCasa + '" class="w-full h-full object-contain" onerror="this.style.display=\'none\'">' : '<span class="text-xl">' + (emoticonsTimes[jogo.casa] || '🏀') + '</span>'}</div><span class="text-[10px] font-bold text-slate-700 text-center leading-tight">${jogo.casa}</span></div><span class="text-fcbcr-accent font-black italic text-sm">VS</span><div class="flex flex-col items-center gap-1.5 w-1/3"><div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center p-1.5 border border-slate-200 overflow-hidden">${logoFora ? '<img src="' + logoFora + '" class="w-full h-full object-contain" onerror="this.style.display=\'none\'">' : '<span class="text-xl">' + (emoticonsTimes[jogo.fora] || '🏀') + '</span>'}</div><span class="text-[10px] font-bold text-slate-700 text-center leading-tight">${jogo.fora}</span></div></div><div class="border-t border-slate-100 pt-2 flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold"><i class="fa-solid fa-location-dot text-blue-500"></i><span class="truncate">${jogo.local || 'A definir'}</span></div></div>`;
    });
}

function renderCestinhasFull() {
    const artilharia = JSON.parse(localStorage.getItem('artilharia')) || [];
    const container = document.getElementById('corpoCestinhasFull');
    const filtroEl = document.getElementById('filtroCestinhas');
    const filtro = filtroEl ? filtroEl.value.trim().toLowerCase() : '';
    container.innerHTML = '';
    if (artilharia.length === 0) { container.innerHTML = '<p class="text-sm text-slate-400 text-center py-8">Nenhuma estatistica registrada ainda.</p>'; return; }
    let lista = filtro ? artilharia.filter(a => a.nome.toLowerCase().includes(filtro) || (a.time || '').toLowerCase().includes(filtro)) : artilharia;
    if (lista.length === 0) { container.innerHTML = `<p class="text-sm text-slate-400 text-center py-8">Nenhum resultado para "${filtro}".</p>`; return; }
    lista.forEach((atleta, index) => {
        let badgeRank = 'bg-slate-200 text-slate-600';
        if (index === 0) badgeRank = 'bg-yellow-400 text-slate-900';
        if (index === 1) badgeRank = 'bg-slate-300 text-slate-900';
        if (index === 2) badgeRank = 'bg-amber-600 text-white';
        container.innerHTML += `<div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition"><div class="flex items-center gap-3"><span class="w-8 h-8 rounded-full ${badgeRank} font-extrabold text-sm flex items-center justify-center">${index + 1}</span><div><p class="text-sm font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition" onclick="abrirModalJogador(${atleta.id})">${atleta.nome}</p><p class="text-xs font-bold text-blue-600 uppercase mt-0.5">${atleta.time}</p></div></div><div class="text-right"><p class="text-lg font-black text-slate-800">${atleta.pontos}</p><p class="text-[10px] text-slate-400 uppercase font-bold">Pontos</p></div></div>`;
    });
}

function abrirModalJogoDetalhes(jogoId) {
    const jogos = JSON.parse(localStorage.getItem('jogos')) || [];
    const artilharia = JSON.parse(localStorage.getItem('artilharia')) || [];
    const jogo = jogos.find(j => j.id === jogoId);
    if (!jogo) return;

    document.getElementById('modalJogoDetalhesTitulo').innerText = jogo.casa + ' vs ' + jogo.fora;
    document.getElementById('modalJogoDetalhesInfo').innerText = jogo.data + ' as ' + jogo.hora + (jogo.local ? ' | ' + jogo.local : '');

    const pontuadoresCasa = [];
    const pontuadoresFora = [];
    artilharia.forEach(atleta => {
        if (atleta.jogos) {
            const jogoAtleta = atleta.jogos.find(j => j.jogoId === jogoId);
            if (jogoAtleta && jogoAtleta.pontos > 0) {
                const dados = { nome: atleta.nome, pontos: jogoAtleta.pontos };
                if (atleta.time === jogo.casa) pontuadoresCasa.push(dados);
                else if (atleta.time === jogo.fora) pontuadoresFora.push(dados);
            }
        }
    });
    pontuadoresCasa.sort((a, b) => b.pontos - a.pontos);
    pontuadoresFora.sort((a, b) => b.pontos - a.pontos);

    const totalCasa = pontuadoresCasa.reduce((s, p) => s + p.pontos, 0);
    const totalFora = pontuadoresFora.reduce((s, p) => s + p.pontos, 0);

    function renderarTime(nomeTime, pontosTime, pontuadores) {
        let h = '<div class="bg-slate-50 rounded-xl p-3 border border-slate-100"><div class="flex items-center justify-between mb-2"><p class="text-xs font-extrabold text-slate-800 uppercase">' + nomeTime + '</p><p class="text-[10px] font-bold text-blue-600">' + pontuadores.length + ' pontuador(es) | Total: ' + pontosTime + ' pts</p></div>';
        if (pontuadores.length === 0) { h += '<p class="text-[10px] text-slate-400 text-center py-2">Nenhum pontuador registrado</p>'; }
        else { h += '<div class="space-y-1">'; pontuadores.forEach((p, i) => { const cor = i === 0 ? 'text-green-600' : 'text-slate-700'; h += '<div class="flex items-center justify-between py-1 px-2 bg-white rounded-lg"><span class="text-[11px] font-semibold ' + cor + '">' + (i + 1) + '. ' + p.nome + '</span><span class="text-[11px] font-black ' + cor + '">' + p.pontos + ' pts</span></div>'; }); h += '</div>'; }
        h += '</div>';
        return h;
    }

    document.getElementById('modalJogoDetalhesCorpo').innerHTML = renderarTime(jogo.casa, totalCasa, pontuadoresCasa) + renderarTime(jogo.fora, totalFora, pontuadoresFora);
    abrirModal('modalJogoDetalhes');
}

function fecharModalJogoDetalhes() { fecharModal('modalJogoDetalhes'); }

function abrirModalJogador(id) {
    const artilharia = JSON.parse(localStorage.getItem('artilharia')) || [];
    const atleta = artilharia.find(a => a.id === id);
    if (!atleta) return;

    document.getElementById('modalJogadorNome').innerText = atleta.nome;
    const classeLabel = atleta.classe ? 'Classe ' + atleta.classe : '';
    document.getElementById('modalJogadorTime').innerText = atleta.time + (classeLabel ? ' — ' + classeLabel : '');
    document.getElementById('modalJogadorPontos').innerText = atleta.pontos;

    const todosJogos = JSON.parse(localStorage.getItem('jogos')) || [];
    const publicados = todosJogos.filter(j => j.status === 'Publicado');
    const jogosAtleta = [];
    publicados.forEach(jogo => {
        const ptsCasa = jogo.pontosAtletasCasa || [];
        const ptsFora = jogo.pontosAtletasFora || [];
        const ptsEsteJogo = [...ptsCasa, ...ptsFora].find(p => p.id === id);
        if (ptsEsteJogo) {
            jogosAtleta.push({ jogoId: jogo.id, timeDoAtleta: ptsEsteJogo.time, adversario: ptsEsteJogo.time === jogo.casa ? jogo.fora : jogo.casa, data: jogo.data, pontos: ptsEsteJogo.pontosNovos });
        }
    });

    document.getElementById('modalJogadorJogos').innerText = jogosAtleta.length;
    document.getElementById('modalJogadorMedia').innerText = jogosAtleta.length > 0 ? (atleta.pontos / jogosAtleta.length).toFixed(1) : '0.0';

    const detalhes = document.getElementById('modalJogadorDetalhes');
    detalhes.innerHTML = '';
    if (jogosAtleta.length === 0) { detalhes.innerHTML = '<p class="text-xs text-slate-400 text-center py-4">Nenhum jogo registrado ainda.</p>'; }
    else {
        const meses = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
        jogosAtleta.forEach(j => {
            const partesData = j.data ? j.data.split('/') : [];
            detalhes.innerHTML += `<div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"><div class="flex items-center gap-3"><div class="bg-blue-600 text-white font-black text-xs px-2 py-1.5 rounded flex flex-col items-center leading-none"><span>${partesData[0] || '--'}</span><span class="text-[8px] font-normal mt-0.5">${partesData[1] || ''}</span></div><div><p class="text-xs font-bold text-slate-700">${j.timeDoAtleta} vs ${j.adversario}</p></div></div><div class="text-right"><p class="text-lg font-black text-blue-600">${j.pontos}</p><p class="text-[9px] text-slate-400 uppercase font-bold">pontos</p></div></div>`;
        });
    }
    abrirModal('modalJogador');
}

function fecharModalJogador() { fecharModal('modalJogador'); }

document.addEventListener('DOMContentLoaded', function() {
    var mj = document.getElementById('modalJogador');
    if (mj) mj.addEventListener('click', function(e) { if (e.target === this) fecharModalJogador(); });
    var mjd = document.getElementById('modalJogoDetalhes');
    if (mjd) mjd.addEventListener('click', function(e) { if (e.target === this) fecharModalJogoDetalhes(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { fecharModalJogador(); fecharModalJogoDetalhes(); } });
});

(function atualizarData() {
    const dataEl = document.getElementById('dataAtual');
    if (dataEl) {
        const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const agora = new Date();
        dataEl.innerHTML = `${dias[agora.getDay()]}, ${agora.getDate()} de ${meses[agora.getMonth()]} de ${agora.getFullYear()}`;
    }
})();

window.onload = carregarDadosPublicos;
