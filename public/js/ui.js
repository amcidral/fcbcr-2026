// ==========================================
// FCBCR - UI Helpers
// Toast, mobile menu, modais, selects dinamicos
// ==========================================

function showToast(message, type) {
    type = type || 'info';
    var t = document.createElement('div');
    var icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    var colors = { success: 'bg-emerald-600', error: 'bg-red-600', warning: 'bg-amber-500', info: 'bg-blue-600' };
    t.className = 'fixed bottom-5 right-5 z-[200] flex items-center gap-3 ' + (colors[type] || colors.info) + ' text-white px-5 py-3 rounded-xl shadow-2xl font-semibold text-sm transition-all duration-300 translate-y-4 opacity-0 max-w-sm';
    t.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.info) + ' shrink-0"></i><span>' + message + '</span>';
    document.body.appendChild(t);
    requestAnimationFrame(function() { t.classList.remove('translate-y-4', 'opacity-0'); });
    setTimeout(function() { t.classList.add('translate-y-4', 'opacity-0'); setTimeout(function() { t.remove(); }, 300); }, 3500);
}

function toggleMobileMenu() {
    var sidebar = document.getElementById('adminSidebar');
    var overlay = document.getElementById('mobileSidebarOverlay');
    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
        sidebar.classList.toggle('translate-x-0');
    }
    if (overlay) overlay.classList.toggle('hidden');
}

function getEquipesDoStorage() {
    var atletasLocais = JSON.parse(localStorage.getItem('atletasPorEquipe')) || {};
    return Object.keys(atletasLocais);
}

function popularSelectsEquipesGlobais(selectIds) {
    var equipes = getEquipesDoStorage();
    (selectIds || []).forEach(function(id) {
        var sel = document.getElementById(id);
        if (!sel) return;
        var valorAtual = sel.value;
        var placeholder = sel.querySelector('option') ? sel.querySelector('option').textContent : 'Selecione...';
        sel.innerHTML = '<option value="">' + placeholder + '</option>';
        equipes.forEach(function(eq) {
            sel.innerHTML += '<option value="' + eq + '">' + eq + '</option>';
        });
        if (valorAtual) sel.value = valorAtual;
    });
}

function abrirModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(function() {
        modal.classList.remove('opacity-0');
        var transform = modal.querySelector('.transform');
        if (transform) transform.classList.remove('scale-95');
    }, 10);
}

function fecharModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('opacity-0');
    var transform = modal.querySelector('.transform');
    if (transform) transform.classList.add('scale-95');
    setTimeout(function() { modal.classList.add('hidden'); }, 300);
}

function getLogoUrl(nome) {
    var classificacao = JSON.parse(localStorage.getItem('classificacao')) || [];
    var cl = classificacao.find(function(t) { return t.time === nome; });
    return cl && cl.logo ? cl.logo : '';
}

function getCidadeTime(nome) {
    var classificacao = JSON.parse(localStorage.getItem('classificacao')) || [];
    var cl = classificacao.find(function(t) { return t.time === nome; });
    return cl ? cl.cidade : '';
}
