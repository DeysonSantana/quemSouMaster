/**
 * Quem Sou Eu? - Theme Manager
 * Gerencia os temas visuais da aplicação com persistência no LocalStorage.
 */
class ThemeManager {
    constructor() {
        this.storageKey = 'qse_theme';
        this.themes = [
            { id: 'dark-neon', name: '🌌 Dark Neon (Padrão)', icon: 'bi-moon-stars-fill' },
            { id: 'chalkboard', name: '🏛️ Lousa / Projetor (Alto Contraste)', icon: 'bi-easel-fill' },
            { id: 'emerald', name: '🍃 Emerald Nature (Ciências/Bio)', icon: 'bi-tree-fill' },
            { id: 'sunset', name: '🌅 Sunset Gradient (Acolhedor)', icon: 'bi-sunset-fill' },
            { id: 'amoled', name: '🖤 Midnight AMOLED (Preto Puro)', icon: 'bi-circle-fill' },
            { id: 'light', name: '☀️ Light Modern (Sala Iluminada)', icon: 'bi-sun-fill' }
        ];
        this.currentTheme = localStorage.getItem(this.storageKey) || 'dark-neon';
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.renderThemeSelector();
    }

    applyTheme(themeId) {
        if (!this.themes.find(t => t.id === themeId)) {
            themeId = 'dark-neon';
        }
        this.currentTheme = themeId;
        document.documentElement.setAttribute('data-theme', themeId);
        localStorage.setItem(this.storageKey, themeId);
        
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === themeId);
        });
    }

    renderThemeSelector() {
        const container = document.getElementById('theme-options-container');
        if (!container) return;

        container.innerHTML = this.themes.map(t => `
            <button type="button" class="btn btn-outline-light btn-sm text-start theme-btn d-flex align-items-center gap-2 mb-2 w-100 ${t.id === this.currentTheme ? 'active' : ''}" 
                    data-theme="${t.id}" onclick="themeManager.applyTheme('${t.id}')">
                <i class="bi ${t.icon}"></i>
                <span>${t.name}</span>
            </button>
        `).join('');
    }
}

window.themeManager = new ThemeManager();
