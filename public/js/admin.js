/* ============================================================
   admin.js – Painel Administrativo FCBCR
   Basquete em Cadeira de Rodas – Campeonato Catarinense
   ============================================================ */

// ────────────────────────────────────────────
// 0. COMPATIBILIDADE DE IDs (HTML ↔ JS)
// ────────────────────────────────────────────
const _ID_MAP = {
  formUsuarioIndice:'usuarioEditId', inputUsuarioLogin:'usuarioLogin',
  inputUsuarioNome:'usuarioNome', inputUsuarioSenha:'usuarioSenha',
  inputUsuarioPerfil:'usuarioRole', listaJogosAdmin:'tabelaJogosFila',
  editarPartidaId:'editPartidaId', editarPartidaData:'editPartidaData',
  editarPartidaHora:'editPartidaHora', editarPartidaCasa:'editSelectMandante',
  editarPartidaFora:'editSelectVisitante', editarPartidaPlacarCasa:'editPartidaPtCasa',
  editarPartidaPlacarFora:'editPartidaPtFora', editarPartidaRodada:'editPartidaRodada',
  editarPartidaLocal:'editPartidaLocal', partidaEquipeCasa:'selectMandante',
  partidaEquipeFora:'selectVisitante', listaAtletas:'listaAtletasGerenciar',
  inputAtletaNome:'atletaNome', inputAtletaNumero:'atletaCamisa',
  inputAtletaPosicao:'atletaClasse', inputAtletaEquipe:'atletaEquipe', editarAtletaId:'editAtletaId',
  editarAtletaNome:'editAtletaNome', editarAtletaNumero:'editAtletaCamisa',
  editarAtletaPosicao:'editAtletaClasse', editarAtletaEquipe:'editAtletaEquipe',
  listaEquipes:'listaEquipesGerenciar', inputEquipeNome:'equipeNome',
  inputEquipeLogo:'equipeLogo', editarEquipeNome:'editEquipeNome',
  editarEquipeLogo:'editEquipeLogo', formProfissionalIndice:'profissionalEditId',
  inputProfissionalNome:'profissionalNome', inputProfissionalCidade:'profissionalCidade',
  inputProfissionalCategoria:'profissionalCategoria', inputProfissionalFuncao:'profissionalFuncao',
  importarProfissionaisTexto:'textoImportarProf', sumulaPlacarCasa:'pontosCasa',
  sumulaPlacarFora:'pontosFora', sumulaAtletasCasa:'listaAtletasCasa',
  sumulaAtletasFora:'listaAtletasFora'
};
const _getElementById = document.getElementById.bind(document);
document.getElementById = function(id) {
  return _getElementById(_ID_MAP[id] || id);
};

// ────────────────────────────────────────────
// 1. CONFIGURAÇÃO PADRÃO
// ────────────────────────────────────────────
const CONFIG_DEFAULTS = {
  usuarios: [
    { login: 'admin', senha: 'admin123', nome: 'Administrador', perfil: 'admin' },
    { login: 'gestor', senha: 'gestor123', nome: 'Gestor', perfil: 'gestor' },
    { login: 'escalador', senha: 'esc123', nome: 'Escalador', perfil: 'escalador' }
  ],
  equipes: [],
  atletas: [],
  jogos: [],
  classificacao: [],
  profissionais: [],
  escalas: [],
  sumulas: []
};

// ────────────────────────────────────────────
// 2. getConfig / setConfig
// ────────────────────────────────────────────
function getConfig(chave, padrao) {
  try {
    const dados = localStorage.getItem('fcbcr_' + chave);
    if (dados !== null) return JSON.parse(dados);
  } catch (e) { /* ignora */ }
  return padrao !== undefined ? padrao : (CONFIG_DEFAULTS[chave] !== undefined ? JSON.parse(JSON.stringify(CONFIG_DEFAULTS[chave])) : null);
}

function setConfig(chave, valor) {
  try {
    localStorage.setItem('fcbcr_' + chave, JSON.stringify(valor));
  } catch (e) {
    console.error('Erro ao salvar config:', chave, e);
  }
}

// ────────────────────────────────────────────
// 3. USUÁRIOS PADRÃO
// ────────────────────────────────────────────
const USUARIOS_PADRAO = CONFIG_DEFAULTS.usuarios;

// ────────────────────────────────────────────
// 4. Toast Notifications
// ────────────────────────────────────────────
function showToast(mensagem, tipo) {
  tipo = tipo || 'info';
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const cores = { sucesso: '#28a745', erro: '#dc3545', info: '#17a2b8', aviso: '#ffc107' };
  toast.style.cssText = 'padding:14px 24px;border-radius:8px;color:#fff;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.3);opacity:0;transform:translateX(100px);transition:all .3s ease;max-width:400px;word-wrap:break-word;background:' + (cores[tipo] || cores.info) + ';';
  toast.textContent = mensagem;
  container.appendChild(toast);
  requestAnimationFrame(function () { toast.style.opacity = '1'; toast.style.transform = 'translateX(0)'; });
  setTimeout(function () {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
  }, 3500);
}

// ────────────────────────────────────────────
// 5. Menu Lateral Mobile
// ────────────────────────────────────────────
function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

// ────────────────────────────────────────────
// 6. Equipes do Storage / Popular Selects
// ────────────────────────────────────────────
function getEquipesDoStorage() {
  const equipes = getConfig('equipes', []);
  return equipes.length > 0 ? equipes : CONFIG_DEFAULTS.equipes;
}

function popularSelectsEquipesGlobais() {
  const selects = document.querySelectorAll('.select-equipe-global');
  const equipes = getEquipesDoStorage();
  selects.forEach(function (sel) {
    const val = sel.value;
    sel.innerHTML = '<option value="">Selecione a equipe</option>';
    equipes.forEach(function (eq) {
      const opt = document.createElement('option');
      opt.value = eq.id || eq.nome;
      opt.textContent = eq.nome;
      sel.appendChild(opt);
    });
    if (val) sel.value = val;
  });
}

// ────────────────────────────────────────────
// 7. Autenticação e Controle de Acesso
// ────────────────────────────────────────────
function inicializarUsuarios() {
  let usuarios = getConfig('usuarios', null);
  if (!usuarios || usuarios.length === 0) {
    setConfig('usuarios', USUARIOS_PADRAO);
    usuarios = USUARIOS_PADRAO;
  }
  return usuarios;
}

function fazerLogin(login, senha) {
  const usuarios = inicializarUsuarios();
  const usuario = usuarios.find(function (u) {
    return u.login === login && u.senha === senha;
  });
  if (usuario) {
    setConfig('usuarioLogado', { login: usuario.login, nome: usuario.nome, perfil: usuario.perfil });
    return usuario;
  }
  return null;
}

function loginFormSubmit() {
  const login = document.getElementById('loginUsuario').value.trim();
  const senha = document.getElementById('loginSenha').value;
  const resultado = fazerLogin(login, senha);
  if (resultado) {
    document.getElementById('loginOverlay').style.display = 'none';
    aplicarControleAcesso();
    popularSelectsEquipesGlobais();
    renderizarFilaJogos();
    renderizarEscalaArbitros();
    showToast('Bem-vindo, ' + resultado.nome + '!', 'sucesso');
  } else {
    const erro = document.getElementById('loginErro');
    if (erro) erro.classList.remove('hidden');
    setTimeout(function () { if (erro) erro.classList.add('hidden'); }, 3000);
  }
}

function fazerLogout() {
  localStorage.removeItem('fcbcr_usuarioLogado');
  window.location.href = 'index.html';
}

function getUsuarioLogado() {
  try {
    const dados = localStorage.getItem('fcbcr_usuarioLogado');
    return dados ? JSON.parse(dados) : null;
  } catch (e) { return null; }
}

function aplicarControleAcesso() {
  const usuario = getUsuarioLogado();
  const overlay = document.getElementById('loginOverlay');
  if (!usuario) {
    if (overlay) overlay.style.display = 'flex';
    return;
  }
  if (overlay) overlay.style.display = 'none';
  document.querySelectorAll('[data-perfil]').forEach(function (el) {
    const perfis = el.getAttribute('data-perfil').split(',');
    if (!perfis.includes(usuario.perfil)) {
      el.style.display = 'none';
    }
  });
  const nomeEl = document.getElementById('usuario-logado-nome');
  if (nomeEl) nomeEl.textContent = usuario.nome;
}

// ────────────────────────────────────────────
// 8. Gerenciar Usuários
// ────────────────────────────────────────────
function abrirModalUsuarios() {
  const modal = document.getElementById('modalUsuarios');
  if (modal) {
    modal.style.display = 'flex';
    renderizarListaUsuarios();
  }
}

function fecharModalUsuarios() {
  const modal = document.getElementById('modalUsuarios');
  if (modal) modal.style.display = 'none';
}

function renderizarListaUsuarios() {
  const lista = document.getElementById('listaUsuarios');
  if (!lista) return;
  const usuarios = getConfig('usuarios', USUARIOS_PADRAO);
  lista.innerHTML = '';
  if (usuarios.length === 0) {
    lista.innerHTML = '<p style="text-align:center;color:#888;">Nenhum usuário cadastrado.</p>';
    return;
  }
  usuarios.forEach(function (u, i) {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #e9ecef;background:#fff;border-radius:8px;margin-bottom:6px;';
    item.innerHTML =
      '<div><strong>' + u.nome + '</strong><br><small style="color:#666;">Login: ' + u.login + ' | Perfil: ' + u.perfil + '</small></div>' +
      '<div><button class="btn-sm btn-primary" onclick="editarUsuario(' + i + ')">Editar</button> ' +
      '<button class="btn-sm btn-danger" onclick="excluirUsuario(' + i + ')">Excluir</button></div>';
    lista.appendChild(item);
  });
}

function abrirFormNovoUsuario() {
  const modal = document.getElementById('modalFormUsuario');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('formUsuarioIndice').value = '-1';
    document.getElementById('inputUsuarioLogin').value = '';
    document.getElementById('inputUsuarioNome').value = '';
    document.getElementById('inputUsuarioSenha').value = '';
    document.getElementById('inputUsuarioPerfil').value = 'gestor';
  }
}

function fecharModalFormUsuario() {
  const modal = document.getElementById('modalFormUsuario');
  if (modal) modal.style.display = 'none';
}

function editarUsuario(indice) {
  const usuarios = getConfig('usuarios', []);
  if (indice < 0 || indice >= usuarios.length) return;
  const u = usuarios[indice];
  const modal = document.getElementById('modalFormUsuario');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('formUsuarioIndice').value = indice;
    document.getElementById('inputUsuarioLogin').value = u.login;
    document.getElementById('inputUsuarioNome').value = u.nome;
    document.getElementById('inputUsuarioSenha').value = u.senha;
    document.getElementById('inputUsuarioPerfil').value = u.perfil;
  }
}

function excluirUsuario(indice) {
  if (!confirm('Deseja excluir este usuário?')) return;
  const usuarios = getConfig('usuarios', []);
  usuarios.splice(indice, 1);
  setConfig('usuarios', usuarios);
  renderizarListaUsuarios();
  showToast('Usuário excluído com sucesso!', 'sucesso');
}

function salvarUsuario() {
  const indice = parseInt(document.getElementById('formUsuarioIndice').value);
  const login = document.getElementById('inputUsuarioLogin').value.trim();
  const nome = document.getElementById('inputUsuarioNome').value.trim();
  const senha = document.getElementById('inputUsuarioSenha').value.trim();
  const perfil = document.getElementById('inputUsuarioPerfil').value;

  if (!login || !nome || !senha) {
    showToast('Preencha todos os campos!', 'erro');
    return;
  }

  const usuarios = getConfig('usuarios', []);
  const novoUsuario = { login: login, nome: nome, senha: senha, perfil: perfil };

  if (indice >= 0) {
    usuarios[indice] = novoUsuario;
    showToast('Usuário atualizado com sucesso!', 'sucesso');
  } else {
    const existe = usuarios.some(function (u) { return u.login === login; });
    if (existe) {
      showToast('Já existe um usuário com este login!', 'erro');
      return;
    }
    usuarios.push(novoUsuario);
    showToast('Usuário criado com sucesso!', 'sucesso');
  }

  setConfig('usuarios', usuarios);
  fecharModalFormUsuario();
  renderizarListaUsuarios();
}

// ────────────────────────────────────────────
// 9. Atletas Iniciais (FATA)
// ────────────────────────────────────────────
const atletasIniciaisFata = [
  // ── AFLODEF / OMDA / FMEFLORIPA ──
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

  // ── ÁGUIAS / SESPORT CONCÓRDIA ──
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

  // ── APEDEB / FME BRUSQUE / CLASSE MÓVEIS ──
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

  // ── CEPE / Raposas do Sul / Sesporte ──
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

  // ── Spartacus / SESC / Sec. Esp. e Lazer / Caçador ──
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

  // ── Tigres Sobre Rodas / FME Criciúma ──
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

// ────────────────────────────────────────────
// 10. Jogos Iniciais (32 jogos)
// ────────────────────────────────────────────
const jogosIniciais = [
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

// ────────────────────────────────────────────
// Classificação Inicial
// ────────────────────────────────────────────
const classificacaoInicial = [
  { equipe: 'AFLODEF/OMDA/FMEFLORIPA',                  logo: 'logos/aflodef.png',         jogos: 8, vitorias: 8, derrotas: 0, pontosPro: 313, pontosContra: 198, saldo: 115, pontos: 16 },
  { equipe: 'Tigres Sobre Rodas/FME Criciúma',           logo: 'logos/tigres.png',          jogos: 8, vitorias: 7, derrotas: 1, pontosPro: 312, pontosContra: 223, saldo: 89,  pontos: 14 },
  { equipe: 'ÁGUIAS/SESPORT CONCÓRDIA',                  logo: 'logos/aguias.png',          jogos: 8, vitorias: 5, derrotas: 3, pontosPro: 264, pontosContra: 263, saldo: 1,   pontos: 10 },
  { equipe: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', logo: 'logos/spartacus.png',       jogos: 8, vitorias: 4, derrotas: 4, pontosPro: 242, pontosContra: 258, saldo: -16, pontos: 8  },
  { equipe: 'CEPE/Raposas do Sul/Sesporte',              logo: 'logos/cepe.png',            jogos: 8, vitorias: 3, derrotas: 5, pontosPro: 231, pontosContra: 253, saldo: -22, pontos: 6  },
  { equipe: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS',         logo: 'logos/apedeb.png',          jogos: 8, vitorias: 0, derrotas: 8, pontosPro: 172, pontosContra: 335, saldo: -163,pontos: 0  }
];

// ────────────────────────────────────────────
// 11. Inicializar Banco de Dados
// ────────────────────────────────────────────
function inicializarBancoDados() {
  const jogos = getConfig('jogos', []);
  if (jogos.length === 0) {
    setConfig('jogos', jogosIniciais);
  }

  const atletas = getConfig('atletas', []);
  if (atletas.length === 0) {
    setConfig('atletas', atletasIniciaisFata);
  }

  const classificacao = getConfig('classificacao', []);
  if (classificacao.length === 0) {
    setConfig('classificacao', classificacaoInicial);
  }

  const equipes = getConfig('equipes', []);
  if (equipes.length === 0) {
    const equipesDefault = [
      { id: 1, nome: 'AFLODEF/OMDA/FMEFLORIPA',                  logo: 'logos/aflodef.png' },
      { id: 2, nome: 'ÁGUIAS/SESPORT CONCÓRDIA',                  logo: 'logos/aguias.png' },
      { id: 3, nome: 'APEDEB/FME BRUSQUE/CLASSE MÓVEIS',         logo: 'logos/apedeb.png' },
      { id: 4, nome: 'CEPE/Raposas do Sul/Sesporte',              logo: 'logos/cepe.png' },
      { id: 5, nome: 'Spartacus/SESC/Sec. Esp. e Lazer/Caçador', logo: 'logos/spartacus.png' },
      { id: 6, nome: 'Tigres Sobre Rodas/FME Criciúma',           logo: 'logos/tigres.png' }
    ];
    setConfig('equipes', equipesDefault);
  }

  inicializarUsuarios();
}

// ────────────────────────────────────────────
// 12. Renderizar Fila de Jogos
// ────────────────────────────────────────────
function renderizarFilaJogos() {
  const container = document.getElementById('listaJogosAdmin');
  if (!container) return;

  const jogos = getConfig('jogos', []);
  const faseFiltro = document.getElementById('filtroFase') ? document.getElementById('filtroFase').value : 'todos';

  container.innerHTML = '';

  const jogosFiltrados = faseFiltro === 'todos' ? jogos : jogos.filter(function (j) { return j.fase === faseFiltro; });

  if (jogosFiltrados.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;padding:30px;">Nenhum jogo encontrado.</p>';
    return;
  }

  const fases = ['Fase de Grupos', 'Semifinal', 'Disputa 5º Lugar', 'Disputa 3º Lugar', 'Final'];

  fases.forEach(function (fase) {
    const jogosDaFase = jogosFiltrados.filter(function (j) { return j.fase === fase; });
    if (jogosDaFase.length === 0) return;

    const secao = document.createElement('div');
    secao.style.marginBottom = '30px';

    const titulo = document.createElement('h3');
    titulo.style.cssText = 'color:var(--primary,#d32f2f);margin-bottom:12px;font-size:16px;border-bottom:2px solid var(--primary,#d32f2f);padding-bottom:6px;';
    titulo.textContent = fase;
    secao.appendChild(titulo);

    jogosDaFase.forEach(function (jogo) {
      const card = document.createElement('div');
      card.style.cssText = 'background:#fff;border-radius:10px;padding:14px 18px;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-left:4px solid var(--primary,#d32f2f);';

      const info = document.createElement('div');
      info.style.cssText = 'flex:1;min-width:250px;';
      info.innerHTML =
        '<strong style="font-size:15px;">' + jogo.equipeCasa + ' vs ' + jogo.equipeFora + '</strong><br>' +
        '<small style="color:#666;">📅 ' + jogo.data + ' às ' + jogo.hora + ' | 📍 ' + jogo.local + ' | Rodada ' + jogo.rodada + '</small><br>' +
        '<span style="font-size:18px;font-weight:700;color:var(--primary,#d32f2f);">' + jogo.placarCasa + ' x ' + jogo.placarFora + '</span>';
      card.appendChild(info);

      const acoes = document.createElement('div');
      acoes.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
      acoes.innerHTML =
        '<button class="btn-sm btn-primary" onclick="abrirModalEditarPartida(' + jogo.id + ')">✏️ Editar</button>' +
        '<button class="btn-sm btn-success" onclick="abrirModalSumula(' + jogo.id + ')">📋 Súmula</button>' +
        '<button class="btn-sm btn-danger" onclick="excluirJogoFila(' + jogo.id + ')">🗑️ Excluir</button>';
      card.appendChild(acoes);

      secao.appendChild(card);
    });

    container.appendChild(secao);
  });
}

// ────────────────────────────────────────────
// 13. Modal Editar Partida
// ────────────────────────────────────────────
function abrirModalEditarPartida(idJogo) {
  const jogos = getConfig('jogos', []);
  const jogo = jogos.find(function (j) { return j.id === idJogo; });
  if (!jogo) return;

  const modal = document.getElementById('modalEditarPartida');
  if (!modal) return;

  modal.style.display = 'flex';
  document.getElementById('editarPartidaId').value = jogo.id;
  document.getElementById('editarPartidaData').value = jogo.data;
  document.getElementById('editarPartidaHora').value = jogo.hora;
  document.getElementById('editarPartidaCasa').value = jogo.equipeCasa;
  document.getElementById('editarPartidaFora').value = jogo.equipeFora;
  document.getElementById('editarPartidaPlacarCasa').value = jogo.placarCasa;
  document.getElementById('editarPartidaPlacarFora').value = jogo.placarFora;
  document.getElementById('editarPartidaFase').value = jogo.fase;
  document.getElementById('editarPartidaRodada').value = jogo.rodada;
  document.getElementById('editarPartidaLocal').value = jogo.local;

  popularSelectsEquipesGlobais();
  const selCasa = document.getElementById('editarPartidaCasa');
  const selFora = document.getElementById('editarPartidaFora');
  if (selCasa) selCasa.value = jogo.equipeCasa;
  if (selFora) selFora.value = jogo.equipeFora;
}

function fecharModalEditarPartida() {
  const modal = document.getElementById('modalEditarPartida');
  if (modal) modal.style.display = 'none';
}

function salvarEdicaoPartida() {
  const id = parseInt(document.getElementById('editarPartidaId').value);
  const jogos = getConfig('jogos', []);
  const idx = jogos.findIndex(function (j) { return j.id === id; });
  if (idx === -1) return;

  jogos[idx].data = document.getElementById('editarPartidaData').value;
  jogos[idx].hora = document.getElementById('editarPartidaHora').value;
  jogos[idx].equipeCasa = document.getElementById('editarPartidaCasa').value;
  jogos[idx].equipeFora = document.getElementById('editarPartidaFora').value;
  jogos[idx].placarCasa = parseInt(document.getElementById('editarPartidaPlacarCasa').value) || 0;
  jogos[idx].placarFora = parseInt(document.getElementById('editarPartidaPlacarFora').value) || 0;
  jogos[idx].fase = document.getElementById('editarPartidaFase').value;
  jogos[idx].rodada = parseInt(document.getElementById('editarPartidaRodada').value) || 1;
  jogos[idx].local = document.getElementById('editarPartidaLocal').value;

  setConfig('jogos', jogos);
  fecharModalEditarPartida();
  renderizarFilaJogos();
  showToast('Partida atualizada com sucesso!', 'sucesso');
}

// ────────────────────────────────────────────
// 14. Excluir Jogo da Fila
// ────────────────────────────────────────────
function excluirJogoFila(idJogo) {
  if (!confirm('Deseja excluir esta partida?')) return;
  const jogos = getConfig('jogos', []);
  const novos = jogos.filter(function (j) { return j.id !== idJogo; });
  setConfig('jogos', novos);
  renderizarFilaJogos();
  showToast('Partida excluída com sucesso!', 'sucesso');
}

// ────────────────────────────────────────────
// 15. Rolar para Seção (Menu Lateral)
// ────────────────────────────────────────────
function rolarParaSecao(secao) {
  const el = document.getElementById(secao);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const sidebar = document.querySelector('.sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
  }
}

// ────────────────────────────────────────────
// 16. Modal Sumula
// ────────────────────────────────────────────
function abrirModalSumula(idJogo) {
  const jogos = getConfig('jogos', []);
  const jogo = jogos.find(function (j) { return j.id === idJogo; });
  if (!jogo) return;

  const modal = document.getElementById('modalSumula');
  if (!modal) return;

  modal.style.display = 'flex';
  document.getElementById('sumulaJogoId').value = jogo.id;
  document.getElementById('sumulaTitle').textContent = 'Súmula: ' + jogo.equipeCasa + ' vs ' + jogo.equipeFora;

  const sumulas = getConfig('sumulas', []);
  const sumulaExistente = sumulas.find(function (s) { return s.jogoId === idJogo; });

  popularSelectsEquipesGlobais();
  document.getElementById('sumulaEquipeCasa').value = jogo.equipeCasa;
  document.getElementById('sumulaEquipeFora').value = jogo.equipeFora;

  renderizarAtletasSumula(jogo.equipeCasa, 'sumulaAtletasCasa', sumulaExistente, 'casa');
  renderizarAtletasSumula(jogo.equipeFora, 'sumulaAtletasFora', sumulaExistente, 'fora');

  document.getElementById('sumulaPlacarCasa').value = sumulaExistente ? sumulaExistente.placarCasa : jogo.placarCasa;
  document.getElementById('sumulaPlacarFora').value = sumulaExistente ? sumulaExistente.placarFora : jogo.placarFora;
  document.getElementById('sumulaObservacoes').value = sumulaExistente ? (sumulaExistente.observacoes || '') : '';
}

function renderizarAtletasSumula(nomeEquipe, containerId, sumulaExistente, tipoEquipe) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const atletas = getConfig('atletas', []);
  const atletasDaEquipe = atletas.filter(function (a) { return a.equipe === nomeEquipe; });

  container.innerHTML = '';

  if (atletasDaEquipe.length === 0) {
    container.innerHTML = '<p style="color:#888;text-align:center;">Nenhum atleta encontrado para esta equipe.</p>';
    return;
  }

  atletasDaEquipe.forEach(function (atleta) {
    let pontosAtuais = 0;
    if (sumulaExistente && sumulaExistente.atletas) {
      const dados = sumulaExistente.atletas.find(function (a) { return a.atletaId === atleta.id; });
      if (dados) pontosAtuais = dados.pontos || 0;
    }

    const linha = document.createElement('div');
    linha.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid #eee;background:#fafafa;border-radius:6px;margin-bottom:4px;';
    linha.innerHTML =
      '<span style="font-weight:700;color:var(--primary,#d32f2f);min-width:30px;">#' + atleta.numero + '</span>' +
      '<span style="flex:1;min-width:120px;">' + atleta.nome + '</span>' +
      '<label style="font-size:12px;color:#666;">Pontos:</label>' +
      '<input type="number" class="sumula-pontos" data-atleta-id="' + atleta.id + '" data-tipo="' + tipoEquipe + '" value="' + pontosAtuais + '" min="0" style="width:60px;padding:4px 8px;border:1px solid #ccc;border-radius:4px;text-align:center;font-weight:700;">' +
      '<label style="font-size:12px;color:#666;">Faltas:</label>' +
      '<input type="number" class="sumula-faltas" data-atleta-id="' + atleta.id + '" value="0" min="0" max="5" style="width:50px;padding:4px 8px;border:1px solid #ccc;border-radius:4px;text-align:center;">';
    container.appendChild(linha);
  });
}

function fecharModalSumula() {
  const modal = document.getElementById('modalSumula');
  if (modal) modal.style.display = 'none';
}

function salvarSumula() {
  const jogoId = parseInt(document.getElementById('sumulaJogoId').value);
  const placarCasa = parseInt(document.getElementById('sumulaPlacarCasa').value) || 0;
  const placarFora = parseInt(document.getElementById('sumulaPlacarFora').value) || 0;
  const observacoes = document.getElementById('sumulaObservacoes').value;

  const atletasInputs = document.querySelectorAll('.sumula-pontos');
  const faltasInputs = document.querySelectorAll('.sumula-faltas');
  const atletasDados = [];

  atletasInputs.forEach(function (input) {
    const atletaId = parseInt(input.getAttribute('data-atleta-id'));
    const pontos = parseInt(input.value) || 0;
    const faltaInput = document.querySelector('.sumula-faltas[data-atleta-id="' + atletaId + '"]');
    const faltas = faltaInput ? parseInt(faltaInput.value) || 0 : 0;
    atletasDados.push({ atletaId: atletaId, pontos: pontos, faltas: faltas });
  });

  const sumula = {
    jogoId: jogoId,
    placarCasa: placarCasa,
    placarFora: placarFora,
    observacoes: observacoes,
    atletas: atletasDados,
    dataPreenchimento: new Date().toISOString()
  };

  const sumulas = getConfig('sumulas', []);
  const idx = sumulas.findIndex(function (s) { return s.jogoId === jogoId; });
  if (idx >= 0) {
    sumulas[idx] = sumula;
  } else {
    sumulas.push(sumula);
  }
  setConfig('sumulas', sumulas);

  // Atualizar placar do jogo
  const jogos = getConfig('jogos', []);
  const jogoIdx = jogos.findIndex(function (j) { return j.id === jogoId; });
  if (jogoIdx >= 0) {
    jogos[jogoIdx].placarCasa = placarCasa;
    jogos[jogoIdx].placarFora = placarFora;
    setConfig('jogos', jogos);
  }

  fecharModalSumula();
  renderizarFilaJogos();
  showToast('Súmula salva com sucesso!', 'sucesso');
}

// ────────────────────────────────────────────
// 17. Modal Selecionar Jogo para Súmula
// ────────────────────────────────────────────
function abrirModalSelecionarJogo() {
  const modal = document.getElementById('modalSelecionarJogo');
  if (modal) {
    modal.style.display = 'flex';
    renderizarListaJogosSelecao();
  }
}

function fecharModalSelecionarJogo() {
  const modal = document.getElementById('modalSelecionarJogo');
  if (modal) modal.style.display = 'none';
}

function renderizarListaJogosSelecao() {
  const container = document.getElementById('listaJogosSelecao');
  if (!container) return;

  const jogos = getConfig('jogos', []);
  container.innerHTML = '';

  if (jogos.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;">Nenhum jogo disponível.</p>';
    return;
  }

  jogos.forEach(function (jogo) {
    const item = document.createElement('div');
    item.style.cssText = 'padding:12px 16px;border-bottom:1px solid #e9ecef;background:#fff;border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:background .2s;';
    item.onmouseover = function () { item.style.background = '#f0f0f0'; };
    item.onmouseout = function () { item.style.background = '#fff'; };

    item.innerHTML =
      '<div><strong>' + jogo.equipeCasa + ' vs ' + jogo.equipeFora + '</strong><br><small style="color:#666;">📅 ' + jogo.data + ' | ' + jogo.fase + ' | Rodada ' + jogo.rodada + '</small></div>' +
      '<button class="btn-sm btn-success">📋 Preencher Súmula</button>';

    item.onclick = function () { selecionarJogoParaSumula(jogo.id); };
    container.appendChild(item);
  });
}

function selecionarJogoParaSumula(idJogo) {
  fecharModalSelecionarJogo();
  abrirModalSumula(idJogo);
}

// ────────────────────────────────────────────
// 18. Modal Nova Partida
// ────────────────────────────────────────────
function abrirModalPartida() {
  const modal = document.getElementById('modalPartida');
  if (modal) {
    modal.style.display = 'flex';
    popularSelectsEquipesGlobais();
    document.getElementById('partidaData').value = '';
    document.getElementById('partidaHora').value = '14:00';
    document.getElementById('partidaEquipeCasa').value = '';
    document.getElementById('partidaEquipeFora').value = '';
    document.getElementById('partidaPlacarCasa').value = '0';
    document.getElementById('partidaPlacarFora').value = '0';
    document.getElementById('partidaFase').value = 'Fase de Grupos';
    document.getElementById('partidaRodada').value = '1';
    document.getElementById('partidaLocal').value = 'Ginásio Central';
  }
}

function fecharModalPartida() {
  const modal = document.getElementById('modalPartida');
  if (modal) modal.style.display = 'none';
}

function salvarPartida() {
  const data = document.getElementById('partidaData').value;
  const hora = document.getElementById('partidaHora').value;
  const equipeCasa = document.getElementById('partidaEquipeCasa').value;
  const equipeFora = document.getElementById('partidaEquipeFora').value;
  const placarCasa = parseInt(document.getElementById('partidaPlacarCasa').value) || 0;
  const placarFora = parseInt(document.getElementById('partidaPlacarFora').value) || 0;
  const fase = document.getElementById('partidaFase').value;
  const rodada = parseInt(document.getElementById('partidaRodada').value) || 1;
  const local = document.getElementById('partidaLocal').value;

  if (!data || !equipeCasa || !equipeFora) {
    showToast('Preencha todos os campos obrigatórios!', 'erro');
    return;
  }

  if (equipeCasa === equipeFora) {
    showToast('As equipes devem ser diferentes!', 'erro');
    return;
  }

  const jogos = getConfig('jogos', []);
  const novoId = jogos.length > 0 ? Math.max.apply(null, jogos.map(function (j) { return j.id; })) + 1 : 1;

  const novoJogo = {
    id: novoId,
    data: data,
    hora: hora,
    equipeCasa: equipeCasa,
    equipeFora: equipeFora,
    placarCasa: placarCasa,
    placarFora: placarFora,
    fase: fase,
    rodada: rodada,
    local: local
  };

  jogos.push(novoJogo);
  setConfig('jogos', jogos);
  fecharModalPartida();
  renderizarFilaJogos();
  showToast('Partida criada com sucesso!', 'sucesso');
}

// ────────────────────────────────────────────
// 19. Modal de Atleta
// ────────────────────────────────────────────
function popularSelectsEquipes() {
  const selects = document.querySelectorAll('.select-equipe-atleta');
  const equipes = getEquipesDoStorage();
  selects.forEach(function (sel) {
    const val = sel.value;
    sel.innerHTML = '<option value="">Selecione a equipe</option>';
    equipes.forEach(function (eq) {
      const opt = document.createElement('option');
      opt.value = eq.id || eq.nome;
      opt.textContent = eq.nome;
      sel.appendChild(opt);
    });
    if (val) sel.value = val;
  });
}

function trocarAbaAtleta(aba) {
  document.querySelectorAll('.aba-atleta').forEach(function (el) { el.style.display = 'none'; });
  document.querySelectorAll('.btn-aba-atleta').forEach(function (el) { el.classList.remove('active'); });
  const alvo = document.getElementById('abaAtleta' + aba);
  if (alvo) alvo.style.display = 'block';
  const btn = document.querySelector('[data-aba-atleta="' + aba + '"]');
  if (btn) btn.classList.add('active');
  renderizarListaAtletas(aba);
}

function renderizarListaAtletas(filtroEquipe) {
  const container = document.getElementById('listaAtletas');
  if (!container) return;

  const atletas = getConfig('atletas', []);
  container.innerHTML = '';

  const filtrados = filtroEquipe && filtroEquipe !== 'todos'
    ? atletas.filter(function (a) { return a.equipe === filtroEquipe; })
    : atletas;

  if (filtrados.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;">Nenhum atleta encontrado.</p>';
    return;
  }

  const equipes = getEquipesDoStorage();
  const agrupado = {};
  filtrados.forEach(function (a) {
    if (!agrupado[a.equipe]) agrupado[a.equipe] = [];
    agrupado[a.equipe].push(a);
  });

  Object.keys(agrupado).forEach(function (eqNome) {
    const eq = equipes.find(function (e) { return e.nome === eqNome; });
    const secao = document.createElement('div');
    secao.style.marginBottom = '20px';

    const titulo = document.createElement('h4');
    titulo.style.cssText = 'color:var(--primary,#d32f2f);margin-bottom:8px;font-size:14px;';
    titulo.textContent = eqNome + ' (' + agrupado[eqNome].length + ' atletas)';
    secao.appendChild(titulo);

    agrupado[eqNome].forEach(function (atleta) {
      const card = document.createElement('div');
      card.style.cssText = 'background:#fff;border-radius:8px;padding:10px 14px;margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,.06);display:flex;justify-content:space-between;align-items:center;border-left:3px solid var(--primary,#d32f2f);';
      card.innerHTML =
        '<div><strong style="color:#333;">#' + atleta.numero + ' ' + atleta.nome + '</strong><br><small style="color:#888;">Posição: ' + (atleta.posicao || '—') + '</small></div>' +
        '<div><button class="btn-sm btn-primary" onclick="abrirModalEditarAtleta(' + atleta.id + ')">✏️</button> <button class="btn-sm btn-danger" onclick="excluirAtleta(' + atleta.id + ')">🗑️</button></div>';
      secao.appendChild(card);
    });

    container.appendChild(secao);
  });
}

function abrirModalAtleta() {
  const modal = document.getElementById('modalAtleta');
  if (modal) {
    modal.style.display = 'flex';
    popularSelectsEquipes();
    document.getElementById('formAtletaIndice').value = '-1';
    document.getElementById('inputAtletaNome').value = '';
    document.getElementById('inputAtletaNumero').value = '';
    document.getElementById('inputAtletaPosicao').value = '1.0';
    document.getElementById('inputAtletaEquipe').value = '';
  }
}

function fecharModalAtleta() {
  const modal = document.getElementById('modalAtleta');
  if (modal) modal.style.display = 'none';
}

function salvarAtleta() {
  const nome = document.getElementById('inputAtletaNome').value.trim();
  const numero = parseInt(document.getElementById('inputAtletaNumero').value);
  const posicao = document.getElementById('inputAtletaPosicao').value;
  const equipe = document.getElementById('inputAtletaEquipe').value;

  if (!nome || !numero || !equipe) {
    showToast('Preencha todos os campos obrigatórios!', 'erro');
    return;
  }

  const atletas = getConfig('atletas', []);
  const novoId = atletas.length > 0 ? Math.max.apply(null, atletas.map(function (a) { return a.id; })) + 1 : 1;

  const novoAtleta = {
    id: novoId,
    nome: nome,
    numero: numero,
    posicao: posicao,
    equipe: equipe
  };

  atletas.push(novoAtleta);
  setConfig('atletas', atletas);
  fecharModalAtleta();
  renderizarListaAtletas('todos');
  showToast('Atleta cadastrado com sucesso!', 'sucesso');
}

// ────────────────────────────────────────────
// 20. Editar / Excluir Atleta
// ────────────────────────────────────────────
function abrirModalEditarAtleta(idAtleta) {
  const atletas = getConfig('atletas', []);
  const atleta = atletas.find(function (a) { return a.id === idAtleta; });
  if (!atleta) return;

  const modal = document.getElementById('modalEditarAtleta');
  if (!modal) return;

  modal.style.display = 'flex';
  popularSelectsEquipes();
  document.getElementById('editarAtletaId').value = atleta.id;
  document.getElementById('editarAtletaNome').value = atleta.nome;
  document.getElementById('editarAtletaNumero').value = atleta.numero;
  document.getElementById('editarAtletaPosicao').value = atleta.posicao || 'Ala';
  document.getElementById('editarAtletaEquipe').value = atleta.equipe;
}

function fecharModalEditarAtleta() {
  const modal = document.getElementById('modalEditarAtleta');
  if (modal) modal.style.display = 'none';
}

function salvarEdicaoAtleta() {
  const id = parseInt(document.getElementById('editarAtletaId').value);
  const atletas = getConfig('atletas', []);
  const idx = atletas.findIndex(function (a) { return a.id === id; });
  if (idx === -1) return;

  atletas[idx].nome = document.getElementById('editarAtletaNome').value.trim();
  atletas[idx].numero = parseInt(document.getElementById('editarAtletaNumero').value);
  atletas[idx].posicao = document.getElementById('editarAtletaPosicao').value;
  atletas[idx].equipe = document.getElementById('editarAtletaEquipe').value;

  setConfig('atletas', atletas);
  fecharModalEditarAtleta();
  renderizarListaAtletas('todos');
  showToast('Atleta atualizado com sucesso!', 'sucesso');
}

function excluirAtleta(idAtleta) {
  if (!confirm('Deseja excluir este atleta?')) return;
  const atletas = getConfig('atletas', []);
  const novos = atletas.filter(function (a) { return a.id !== idAtleta; });
  setConfig('atletas', novos);
  renderizarListaAtletas('todos');
  showToast('Atleta excluído com sucesso!', 'sucesso');
}

// ────────────────────────────────────────────
// 21. Modal de Equipes
// ────────────────────────────────────────────
function trocarAbaEquipe(aba) {
  document.querySelectorAll('.aba-equipe').forEach(function (el) { el.style.display = 'none'; });
  document.querySelectorAll('.btn-aba-equipe').forEach(function (el) { el.classList.remove('active'); });
  const alvo = document.getElementById('abaEquipe' + aba);
  if (alvo) alvo.style.display = 'block';
  const btn = document.querySelector('[data-aba-equipe="' + aba + '"]');
  if (btn) btn.classList.add('active');
  renderizarListaEquipes();
}

function renderizarListaEquipes() {
  const container = document.getElementById('listaEquipes');
  if (!container) return;

  const equipes = getEquipesDoStorage();
  container.innerHTML = '';

  if (equipes.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;">Nenhuma equipe cadastrada.</p>';
    return;
  }

  equipes.forEach(function (eq) {
    const card = document.createElement('div');
    card.style.cssText = 'background:#fff;border-radius:10px;padding:14px 18px;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;justify-content:space-between;align-items:center;border-left:4px solid var(--primary,#d32f2f);';
    card.innerHTML =
      '<div style="display:flex;align-items:center;gap:12px;">' +
        (eq.logo ? '<img src="' + eq.logo + '" alt="' + eq.nome + '" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #ddd;">' : '') +
        '<div><strong style="font-size:15px;">' + eq.nome + '</strong></div>' +
      '</div>' +
      '<div><button class="btn-sm btn-primary" onclick="abrirModalEditarEquipe(' + (eq.id || 0) + ')">✏️ Editar</button> <button class="btn-sm btn-danger" onclick="excluirEquipe(' + (eq.id || 0) + ')">🗑️ Excluir</button></div>';
    container.appendChild(card);
  });
}

function abrirModalEquipe() {
  const modal = document.getElementById('modalEquipe');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('formEquipeIndice').value = '-1';
    document.getElementById('inputEquipeNome').value = '';
    document.getElementById('inputEquipeLogo').value = '';
  }
}

function fecharModalEquipe() {
  const modal = document.getElementById('modalEquipe');
  if (modal) modal.style.display = 'none';
}

function salvarEquipe() {
  const nome = document.getElementById('inputEquipeNome').value.trim();
  const logo = document.getElementById('inputEquipeLogo').value.trim();

  if (!nome) {
    showToast('Informe o nome da equipe!', 'erro');
    return;
  }

  const equipes = getEquipesDoStorage();
  const novoId = equipes.length > 0 ? Math.max.apply(null, equipes.map(function (e) { return e.id || 0; })) + 1 : 1;

  const novaEquipe = {
    id: novoId,
    nome: nome,
    logo: logo || ''
  };

  equipes.push(novaEquipe);
  setConfig('equipes', equipes);
  fecharModalEquipe();
  renderizarListaEquipes();
  popularSelectsEquipesGlobais();
  showToast('Equipe cadastrada com sucesso!', 'sucesso');
}

// ────────────────────────────────────────────
// 22. Editar / Excluir Equipe
// ────────────────────────────────────────────
function abrirModalEditarEquipe(idEquipe) {
  const equipes = getEquipesDoStorage();
  const equipe = equipes.find(function (e) { return e.id === idEquipe; });
  if (!equipe) return;

  const modal = document.getElementById('modalEditarEquipe');
  if (!modal) return;

  modal.style.display = 'flex';
  document.getElementById('editarEquipeId').value = equipe.id;
  document.getElementById('editarEquipeNome').value = equipe.nome;
  document.getElementById('editarEquipeLogo').value = equipe.logo || '';
}

function fecharModalEditarEquipe() {
  const modal = document.getElementById('modalEditarEquipe');
  if (modal) modal.style.display = 'none';
}

function salvarEdicaoEquipe() {
  const id = parseInt(document.getElementById('editarEquipeId').value);
  const equipes = getEquipesDoStorage();
  const idx = equipes.findIndex(function (e) { return e.id === id; });
  if (idx === -1) return;

  equipes[idx].nome = document.getElementById('editarEquipeNome').value.trim();
  equipes[idx].logo = document.getElementById('editarEquipeLogo').value.trim();

  setConfig('equipes', equipes);
  fecharModalEditarEquipe();
  renderizarListaEquipes();
  popularSelectsEquipesGlobais();
  showToast('Equipe atualizada com sucesso!', 'sucesso');
}

function excluirEquipe(idEquipe) {
  if (!confirm('Deseja excluir esta equipe?')) return;
  const equipes = getEquipesDoStorage();
  const novas = equipes.filter(function (e) { return e.id !== idEquipe; });
  setConfig('equipes', novas);
  renderizarListaEquipes();
  popularSelectsEquipesGlobais();
  showToast('Equipe excluída com sucesso!', 'sucesso');
}

// ────────────────────────────────────────────
// 23. Cadastro de Profissionais (Árbitros e Jurados)
// ────────────────────────────────────────────
function abrirModalProfissional() {
  const modal = document.getElementById('modalProfissional');
  if (modal) {
    modal.style.display = 'flex';
    limparFormProfissional();
    trocarAbaProfissional('lista');
    renderizarListaProfissionais();
  }
}

function fecharModalProfissional() {
  const modal = document.getElementById('modalProfissional');
  if (modal) modal.style.display = 'none';
}

function trocarAbaProfissional(aba) {
  document.querySelectorAll('.aba-profissional').forEach(function (el) { el.style.display = 'none'; });
  document.querySelectorAll('.btn-aba-profissional').forEach(function (el) { el.classList.remove('active'); });
  const alvo = document.getElementById('abaProfissional' + aba.charAt(0).toUpperCase() + aba.slice(1));
  if (alvo) alvo.style.display = 'block';
  const btn = document.querySelector('[data-aba-profissional="' + aba + '"]');
  if (btn) btn.classList.add('active');
}

function limparFormProfissional() {
  document.getElementById('formProfissionalIndice').value = '-1';
  document.getElementById('inputProfissionalNome').value = '';
  document.getElementById('inputProfissionalCidade').value = '';
  document.getElementById('inputProfissionalCategoria').value = 'Árbitro';
  document.getElementById('inputProfissionalFuncao').value = 'Técnico';
  document.getElementById('inputProfissionalCREF').value = '';
}

function importarProfissionais() {
  const texto = document.getElementById('importarProfissionaisTexto');
  if (!texto || !texto.value.trim()) {
    showToast('Cole os dados dos profissionais no campo de texto!', 'erro');
    return;
  }

  const linhas = texto.value.trim().split('\n');
  const profissionais = getConfig('profissionais', []);
  let importados = 0;

  linhas.forEach(function (linha) {
    linha = linha.trim();
    if (!linha) return;
    let partes;
    if (linha.indexOf('\t') !== -1) {
      partes = linha.split('\t');
    } else if (linha.indexOf('|') !== -1) {
      partes = linha.split('|');
    } else {
      partes = linha.split('\t');
    }
    if (partes.length < 3) return;

    const nome = (partes[1] || '').trim();
    const funcao = (partes[2] || '').trim();
    const categoria = (partes[3] || '').trim();
    const cidade = (partes[4] || '').trim();
    const cref = (partes[5] || '').trim();

    if (!nome) return;

    const novoId = profissionais.length > 0 ? Math.max.apply(null, profissionais.map(function (p) { return p.id || 0; })) + 1 : 1;

    profissionais.push({
      id: novoId,
      nome: nome,
      cidade: cidade,
      categoria: categoria || 'Estadual',
      funcao: funcao || 'Mesario (A)',
      cref: cref
    });
    importados++;
  });

  setConfig('profissionais', profissionais);
  texto.value = '';
  renderizarListaProfissionais();
  showToast(importados + ' profissional(is) importado(s) com sucesso!', 'sucesso');
}

function salvarProfissional() {
  const indice = parseInt(document.getElementById('formProfissionalIndice').value);
  const nome = document.getElementById('inputProfissionalNome').value.trim();
  const cidade = document.getElementById('inputProfissionalCidade').value.trim();
  const categoria = document.getElementById('inputProfissionalCategoria').value;
  const funcao = document.getElementById('inputProfissionalFuncao').value;
  const cref = document.getElementById('inputProfissionalCREF').value.trim();

  if (!nome) {
    showToast('Informe o nome do profissional!', 'erro');
    return;
  }

  const profissionais = getConfig('profissionais', []);

  if (indice >= 0) {
    profissionais[indice].nome = nome;
    profissionais[indice].cidade = cidade;
    profissionais[indice].categoria = categoria;
    profissionais[indice].funcao = funcao;
    profissionais[indice].cref = cref;
    showToast('Profissional atualizado com sucesso!', 'sucesso');
  } else {
    const novoId = profissionais.length > 0 ? Math.max.apply(null, profissionais.map(function (p) { return p.id || 0; })) + 1 : 1;
    profissionais.push({
      id: novoId,
      nome: nome,
      cidade: cidade,
      categoria: categoria,
      funcao: funcao,
      cref: cref
    });
    showToast('Profissional cadastrado com sucesso!', 'sucesso');
  }

  setConfig('profissionais', profissionais);
  limparFormProfissional();
  trocarAbaProfissional('lista');
  renderizarListaProfissionais();
}

function renderizarListaProfissionais() {
  const container = document.getElementById('listaProfissionais');
  if (!container) return;

  const profissionais = getConfig('profissionais', []);
  container.innerHTML = '';

  if (profissionais.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;">Nenhum profissional cadastrado.</p>';
    return;
  }

  const agrupado = {};
  profissionais.forEach(function (p) {
    const chave = p.categoria || 'Outros';
    if (!agrupado[chave]) agrupado[chave] = [];
    agrupado[chave].push(p);
  });

  Object.keys(agrupado).forEach(function (cat) {
    const titulo = document.createElement('h4');
    titulo.style.cssText = 'color:var(--primary,#d32f2f);margin:14px 0 8px 0;font-size:14px;';
    titulo.textContent = cat + 's (' + agrupado[cat].length + ')';
    container.appendChild(titulo);

    agrupado[cat].forEach(function (p) {
      const card = document.createElement('div');
      card.style.cssText = 'background:#fff;border-radius:8px;padding:10px 14px;margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,.06);display:flex;justify-content:space-between;align-items:center;border-left:3px solid var(--primary,#d32f2f);';
      card.innerHTML =
        '<div><strong>' + p.nome + '</strong><br><small style="color:#666;">Cidade: ' + (p.cidade || '—') + ' | Função: ' + (p.funcao || '—') + ' | CREF: ' + (p.cref || '—') + '</small></div>' +
        '<div><button class="btn-sm btn-primary" onclick="editarProfissional(' + p.id + ')">✏️</button> <button class="btn-sm btn-danger" onclick="excluirProfissional(' + p.id + ')">🗑️</button></div>';
      container.appendChild(card);
    });
  });
}

function editarProfissional(id) {
  const profissionais = getConfig('profissionais', []);
  const idx = profissionais.findIndex(function (p) { return p.id === id; });
  if (idx === -1) return;

  const p = profissionais[idx];
  document.getElementById('formProfissionalIndice').value = idx;
  document.getElementById('inputProfissionalNome').value = p.nome;
  document.getElementById('inputProfissionalCidade').value = p.cidade || '';
  document.getElementById('inputProfissionalCategoria').value = p.categoria || 'Árbitro';
  document.getElementById('inputProfissionalFuncao').value = p.funcao || 'Técnico';
  document.getElementById('inputProfissionalCREF').value = p.cref || '';
  trocarAbaProfissional('form');
}

function excluirProfissional(id) {
  if (!confirm('Deseja excluir este profissional?')) return;
  const profissionais = getConfig('profissionais', []);
  const novos = profissionais.filter(function (p) { return p.id !== id; });
  setConfig('profissionais', novos);
  renderizarListaProfissionais();
  showToast('Profissional excluído com sucesso!', 'sucesso');
}

// ────────────────────────────────────────────
// 24. Renderizar Escala de Árbitros
// ────────────────────────────────────────────
function renderizarEscalaArbitros() {
  const container = document.getElementById('listaEscalasArbitros');
  if (!container) return;

  const escalas = getConfig('escalas', []);
  const jogos = getConfig('jogos', []);
  container.innerHTML = '';

  if (escalas.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;">Nenhuma escala de árbitros registrada.</p>';
    return;
  }

  escalas.forEach(function (escala) {
    const jogo = jogos.find(function (j) { return j.id === escala.jogoId; });
    const nomeJogo = jogo ? (jogo.equipeCasa + ' vs ' + jogo.equipeFora) : 'Jogo #' + escala.jogoId;
    const dataJogo = jogo ? jogo.data : '—';

    const card = document.createElement('div');
    card.style.cssText = 'background:#fff;border-radius:10px;padding:14px 18px;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,.08);border-left:4px solid var(--primary,#d32f2f);';
    card.innerHTML =
      '<strong>' + nomeJogo + '</strong> — 📅 ' + dataJogo + '<br>' +
      '<small style="color:#666;">Árbitros: ' + (escala.arbitros ? escala.arbitros.join(', ') : '—') + '</small><br>' +
      '<small style="color:#666;">Jurados: ' + (escala.jurados ? escala.jurados.join(', ') : '—') + '</small>';
    container.appendChild(card);
  });
}

// ────────────────────────────────────────────
// 25. FCBCR Logo Base64 & Geração de PDF
// ────────────────────────────────────────────
const FCBCR_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

function gerarPdfEscala(idJogo) {
  const escalas = getConfig('escalas', []);
  const escala = escalas.find(function (e) { return e.jogoId === idJogo; });
  if (!escala) {
    showToast('Nenhuma escala encontrada para este jogo!', 'erro');
    return;
  }

  const jogos = getConfig('jogos', []);
  const jogo = jogos.find(function (j) { return j.id === idJogo; });
  const nomeJogo = jogo ? (jogo.equipeCasa + ' vs ' + jogo.equipeFora) : 'Jogo #' + idJogo;
  const dataJogo = jogo ? (jogo.data + ' às ' + jogo.hora) : '—';

  const win = window.open('', '_blank', 'width=800,height=600');
  if (!win) {
    showToast('Bloqueador de popup ativo! Permita popups para gerar o PDF.', 'aviso');
    return;
  }

  let html = '<!DOCTYPE html><html><head><title>Escala - ' + nomeJogo + '</title>';
  html += '<style>body{font-family:Arial,sans-serif;padding:40px;color:#333;}';
  html += 'h1{text-align:center;color:#d32f2f;font-size:20px;}';
  html += 'h2{text-align:center;color:#555;font-size:14px;margin-bottom:30px;}';
  html += 'table{width:100%;border-collapse:collapse;margin-top:20px;}';
  html += 'th,td{border:1px solid #ccc;padding:10px 14px;text-align:left;font-size:13px;}';
  html += 'th{background:#d32f2f;color:#fff;}';
  html += '.logo{text-align:center;margin-bottom:10px;}';
  html += '.logo img{width:80px;height:80px;border-radius:50%;}';
  html += '.assinatura{margin-top:40px;display:flex;justify-content:space-around;}';
  html += '.assinatura div{text-align:center;width:200px;border-top:1px solid #333;padding-top:8px;font-size:12px;}';
  html += '@media print{body{padding:20px;}}</style></head><body>';

  html += '<div class="logo"><img src="' + FCBCR_LOGO_BASE64 + '" alt="FCBCR"></div>';
  html += '<h1>FCBCR – Federação Catarinense de Basquetebol em Cadeira de Rodas</h1>';
  html += '<h2>Escala de Oficiais de Jogo</h2>';
  html += '<p style="text-align:center;"><strong>Partida:</strong> ' + nomeJogo + '</p>';
  html += '<p style="text-align:center;"><strong>Data:</strong> ' + dataJogo + '</p>';

  if (escala.arbitros && escala.arbitros.length > 0) {
    html += '<h3 style="color:#d32f2f;margin-top:30px;">Árbitros</h3>';
    html += '<table><tr><th>#</th><th>Nome</th><th>Cidade</th><th>CREF</th></tr>';
    escala.arbitros.forEach(function (nome, i) {
      html += '<tr><td>' + (i + 1) + '</td><td>' + nome + '</td><td>' + (escala.arbitrosCidades ? escala.arbitrosCidades[i] : '—') + '</td><td>' + (escala.arbitrosCrefs ? escala.arbitrosCrefs[i] : '—') + '</td></tr>';
    });
    html += '</table>';
  }

  if (escala.jurados && escala.jurados.length > 0) {
    html += '<h3 style="color:#d32f2f;margin-top:30px;">Jurados</h3>';
    html += '<table><tr><th>#</th><th>Nome</th><th>Cidade</th><th>CREF</th></tr>';
    escala.jurados.forEach(function (nome, i) {
      html += '<tr><td>' + (i + 1) + '</td><td>' + nome + '</td><td>' + (escala.juradosCidades ? escala.juradosCidades[i] : '—') + '</td><td>' + (escala.juradosCrefs ? escala.juradosCrefs[i] : '—') + '</td></tr>';
    });
    html += '</table>';
  }

  html += '<div class="assinatura">';
  html += '<div>Árbitro Principal</div>';
  html += '<div>Árbitro Auxiliar</div>';
  html += '<div>Delegado</div>';
  html += '</div>';

  html += '<script>window.onload=function(){window.print();}<\/script>';
  html += '</body></html>';

  win.document.write(html);
  win.document.close();
  showToast('Gerando PDF da escala...', 'info');
}

// ────────────────────────────────────────────
// 26. Modal Escala de Jogo
// ────────────────────────────────────────────
function abrirModalEscalaJogo() {
  const modal = document.getElementById('modalEscalaJogo');
  if (modal) {
    modal.style.display = 'flex';
    renderizarListaJogosEscala();
  }
}

function fecharModalEscalaJogo() {
  const modal = document.getElementById('modalEscalaJogo');
  if (modal) modal.style.display = 'none';
}

function renderizarListaJogosEscala() {
  const container = document.getElementById('listaJogosEscala');
  const passo2 = document.getElementById('escalaPasso2');
  if (passo2) passo2.style.display = 'none';
  if (container) container.style.display = 'block';

  if (!container) return;

  const jogos = getConfig('jogos', []);
  const escalas = getConfig('escalas', []);
  container.innerHTML = '';

  if (jogos.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;">Nenhum jogo disponível para escalar.</p>';
    return;
  }

  jogos.forEach(function (jogo) {
    const escalado = escalas.some(function (e) { return e.jogoId === jogo.id; });
    const card = document.createElement('div');
    card.style.cssText = 'padding:12px 16px;border-bottom:1px solid #e9ecef;background:#fff;border-radius:8px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;';

    card.innerHTML =
      '<div><strong>' + jogo.equipeCasa + ' vs ' + jogo.equipeFora + '</strong><br><small style="color:#666;">📅 ' + jogo.data + ' | ' + jogo.fase + '</small></div>' +
      '<div>' +
        (escalado ? '<span style="color:#28a745;font-size:12px;margin-right:8px;">✓ Escalado</span>' : '') +
        '<button class="btn-sm btn-primary" onclick="abrirFormEscala(' + jogo.id + ')">📋 Escalar</button>' +
      '</div>';
    container.appendChild(card);
  });
}

function abrirFormEscala(idJogo) {
  const container = document.getElementById('listaJogosEscala');
  const passo2 = document.getElementById('escalaPasso2');
  if (container) container.style.display = 'none';
  if (passo2) passo2.style.display = 'block';

  document.getElementById('escalaJogoId').value = idJogo;

  const jogos = getConfig('jogos', []);
  const jogo = jogos.find(function (j) { return j.id === idJogo; });
  if (jogo) {
    document.getElementById('escalaJogoInfo').textContent = jogo.equipeCasa + ' vs ' + jogo.equipeFora + ' — ' + jogo.data;
  }

  popularSelectsProfissionais();

  const escalas = getConfig('escalas', []);
  const existente = escalas.find(function (e) { return e.jogoId === idJogo; });
  if (existente) {
    document.getElementById('escalaJurado1').value = existente.jurados && existente.jurados[0] ? existente.jurados[0] : '';
    document.getElementById('escalaJurado2').value = existente.jurados && existente.jurados[1] ? existente.jurados[1] : '';
    document.getElementById('escalaJurado3').value = existente.jurados && existente.jurados[2] ? existente.jurados[2] : '';
    document.getElementById('escalaJurado4').value = existente.jurados && existente.jurados[3] ? existente.jurados[3] : '';
    document.getElementById('escalaArbitro1').value = existente.arbitros && existente.arbitros[0] ? existente.arbitros[0] : '';
    document.getElementById('escalaArbitro2').value = existente.arbitros && existente.arbitros[1] ? existente.arbitros[1] : '';
    document.getElementById('escalaDelegado').value = existente.delegado || '';
  } else {
    document.getElementById('escalaJurado1').value = '';
    document.getElementById('escalaJurado2').value = '';
    document.getElementById('escalaJurado3').value = '';
    document.getElementById('escalaJurado4').value = '';
    document.getElementById('escalaArbitro1').value = '';
    document.getElementById('escalaArbitro2').value = '';
    document.getElementById('escalaDelegado').value = '';
  }
}

function voltarPasso1Escala() {
  const container = document.getElementById('listaJogosEscala');
  const passo2 = document.getElementById('escalaPasso2');
  if (container) container.style.display = 'block';
  if (passo2) passo2.style.display = 'none';
  renderizarListaJogosEscala();
}

function popularSelectsProfissionais() {
  const profissionais = getConfig('profissionais', []);

  const selectsJurados = ['escalaJurado1', 'escalaJurado2', 'escalaJurado3', 'escalaJurado4'];
  const selectsArbitros = ['escalaArbitro1', 'escalaArbitro2'];
  const selectDelegado = 'escalaDelegado';

  const jurados = profissionais.filter(function (p) { return p.categoria === 'Jurado'; });
  const arbitros = profissionais.filter(function (p) { return p.categoria === 'Árbitro'; });

  selectsJurados.forEach(function (id) {
    const sel = document.getElementById(id);
    if (!sel) return;
    const val = sel.value;
    sel.innerHTML = '<option value="">Selecione</option>';
    jurados.forEach(function (j) {
      const opt = document.createElement('option');
      opt.value = j.nome;
      opt.textContent = j.nome + ' (' + (j.cidade || '—') + ')';
      sel.appendChild(opt);
    });
    if (val) sel.value = val;
  });

  selectsArbitros.forEach(function (id) {
    const sel = document.getElementById(id);
    if (!sel) return;
    const val = sel.value;
    sel.innerHTML = '<option value="">Selecione</option>';
    arbitros.forEach(function (a) {
      const opt = document.createElement('option');
      opt.value = a.nome;
      opt.textContent = a.nome + ' (' + (a.cidade || '—') + ')';
      sel.appendChild(opt);
    });
    if (val) sel.value = val;
  });

  const selDel = document.getElementById(selectDelegado);
  if (selDel) {
    const val = selDel.value;
    selDel.innerHTML = '<option value="">Selecione</option>';
    const todos = profissionais;
    todos.forEach(function (p) {
      const opt = document.createElement('option');
      opt.value = p.nome;
      opt.textContent = p.nome + ' (' + p.categoria + ' - ' + (p.cidade || '—') + ')';
      selDel.appendChild(opt);
    });
    if (val) selDel.value = val;
  }
}

function salvarEscalaJogo() {
  const jogoId = parseInt(document.getElementById('escalaJogoId').value);
  const profissionais = getConfig('profissionais', []);

  function buscarProf(nome) {
    return profissionais.find(function (p) { return p.nome === nome; }) || null;
  }

  const j1 = document.getElementById('escalaJurado1').value;
  const j2 = document.getElementById('escalaJurado2').value;
  const j3 = document.getElementById('escalaJurado3').value;
  const j4 = document.getElementById('escalaJurado4').value;
  const a1 = document.getElementById('escalaArbitro1').value;
  const a2 = document.getElementById('escalaArbitro2').value;
  const delegado = document.getElementById('escalaDelegado').value;

  const jurados = [j1, j2, j3, j4].filter(function (n) { return n !== ''; });
  const arbitros = [a1, a2].filter(function (n) { return n !== ''; });

  if (jurados.length === 0 && arbitros.length === 0) {
    showToast('Selecione ao menos um profissional para a escala!', 'aviso');
    return;
  }

  const juradosCidades = jurados.map(function (n) { const p = buscarProf(n); return p ? (p.cidade || '—') : '—'; });
  const juradosCrefs = jurados.map(function (n) { const p = buscarProf(n); return p ? (p.cref || '—') : '—'; });
  const arbitrosCidades = arbitros.map(function (n) { const p = buscarProf(n); return p ? (p.cidade || '—') : '—'; });
  const arbitrosCrefs = arbitros.map(function (n) { const p = buscarProf(n); return p ? (p.cref || '—') : '—'; });

  const escala = {
    jogoId: jogoId,
    jurados: jurados,
    arbitros: arbitros,
    delegado: delegado,
    juradosCidades: juradosCidades,
    juradosCrefs: juradosCrefs,
    arbitrosCidades: arbitrosCidades,
    arbitrosCrefs: arbitrosCrefs,
    dataCriacao: new Date().toISOString()
  };

  const escalas = getConfig('escalas', []);
  const idx = escalas.findIndex(function (e) { return e.jogoId === jogoId; });
  if (idx >= 0) {
    escalas[idx] = escala;
  } else {
    escalas.push(escala);
  }
  setConfig('escalas', escalas);

  voltarPasso1Escala();
  renderizarEscalaArbitros();
  showToast('Escala salva com sucesso!', 'sucesso');
}

// ────────────────────────────────────────────
// Inicialização automática ao carregar a página
// ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  inicializarBancoDados();
  aplicarControleAcesso();

  popularSelectsEquipesGlobais();
  renderizarFilaJogos();
  renderizarEscalaArbitros();

  document.querySelectorAll('.sidebar-overlay').forEach(function (el) {
    el.addEventListener('click', toggleMobileMenu);
  });
});
