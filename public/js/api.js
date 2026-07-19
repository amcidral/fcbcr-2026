// ==========================================
// FCBCR - API Layer
// Comunicação com Netlify Functions + fallback localStorage
// ==========================================

const API_BASE = '/.netlify/functions';

const api = {
    async get(endpoint) {
        try {
            const res = await fetch(`${API_BASE}/${endpoint}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn(`API GET ${endpoint} failed, using localStorage:`, e.message);
            return JSON.parse(localStorage.getItem(endpoint)) || [];
        }
    },

    async post(endpoint, data) {
        try {
            const res = await fetch(`${API_BASE}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn(`API POST ${endpoint} failed, saving to localStorage:`, e.message);
            const items = JSON.parse(localStorage.getItem(endpoint)) || [];
            if (data.id) {
                const idx = items.findIndex(i => i.id === data.id);
                if (idx !== -1) items[idx] = data; else items.push(data);
            } else {
                data.id = items.length > 0 ? Math.max(...items.map(i => i.id || 0)) + 1 : 1;
                items.push(data);
            }
            localStorage.setItem(endpoint, JSON.stringify(items));
            return { success: true, data };
        }
    },

    async delete(endpoint, id) {
        try {
            const res = await fetch(`${API_BASE}/${endpoint}?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn(`API DELETE ${endpoint} failed, removing from localStorage:`, e.message);
            let items = JSON.parse(localStorage.getItem(endpoint)) || [];
            items = items.filter(i => i.id !== id);
            localStorage.setItem(endpoint, JSON.stringify(items));
            return { success: true };
        }
    },

    async put(endpoint, data) {
        return this.post(endpoint, data);
    }
};

function getConfig(key) {
    try {
        const saved = localStorage.getItem('config_' + key);
        return saved ? JSON.parse(saved) : CONFIG_DEFAULTS[key];
    } catch(e) { return CONFIG_DEFAULTS[key]; }
}

function setConfig(key, value) {
    localStorage.setItem('config_' + key, JSON.stringify(value));
}
