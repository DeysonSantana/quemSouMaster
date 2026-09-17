/**
 * Quem Sou Eu? - Deck Builder & Library Manager
 * Gerencia o catálogo de baralhos, criação e edição de baralhos customizados.
 */
class DeckBuilder {
    constructor() {
        this.storageKey = 'qse_custom_decks';
        this.selectedDeckKey = 'qse_active_deck_id';
        this.customDecks = [];
        this.activeDeck = null;
        this.editingDeckId = null;
    }

    init() {
        this.loadCustomDecks();
        
        const sharedDeck = window.shareManager.decodeDeckFromUrl();
        if (sharedDeck) {
            this.saveDeck(sharedDeck);
            this.setActiveDeck(sharedDeck.id);
            alert(`🎉 Baralho "${sharedDeck.title}" importado com sucesso via link!`);
            window.location.hash = '';
        } else {
            const savedActiveId = localStorage.getItem(this.selectedDeckKey);
            this.setActiveDeck(savedActiveId || 'deck_tech');
        }

        this.renderDecksGrid();
        this.setupEventListeners();
    }

    loadCustomDecks() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                this.customDecks = JSON.parse(stored);
            } catch (e) {
                this.customDecks = [];
            }
        }
    }

    saveCustomDecks() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.customDecks));
    }

    getAllDecks() {
        return [...window.DEFAULT_DECKS, ...this.customDecks];
    }

    getDeckById(id) {
        return this.getAllDecks().find(d => d.id === id) || window.DEFAULT_DECKS[0];
    }

    setActiveDeck(deckId) {
        const deck = this.getDeckById(deckId);
        this.activeDeck = deck;
        localStorage.setItem(this.selectedDeckKey, deck.id);
        
        if (window.gameEngine) {
            window.gameEngine.loadDeck(deck);
        }

        this.renderDecksGrid();
        this.updateActiveDeckBadge();
    }

    updateActiveDeckBadge() {
        const badge = document.getElementById('active-deck-indicator');
        if (badge && this.activeDeck) {
            badge.innerHTML = `<i class="bi ${this.activeDeck.icon || 'bi-collection-play'} me-1"></i> ${this.activeDeck.title}`;
        }
    }

    renderDecksGrid() {
        const container = document.getElementById('decks-grid-container');
        if (!container) return;

        const all = this.getAllDecks();
        container.innerHTML = all.map(deck => {
            const isActive = this.activeDeck && this.activeDeck.id === deck.id;
            const isCustom = !window.DEFAULT_DECKS.some(d => d.id === deck.id);

            return `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card deck-card h-100 ${isActive ? 'active-deck' : ''}" style="border-left: 6px solid ${deck.color || '#0d6efd'};">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <span class="badge" style="background-color: ${deck.color || '#0d6efd'}">${deck.discipline || 'Geral'}</span>
                                    <span class="badge bg-secondary"><i class="bi bi-collection me-1"></i> ${deck.cards.length} cartas</span>
                                </div>
                                <h5 class="card-title text-light fw-bold">${deck.title}</h5>
                                <p class="card-text text-white-50 small mb-3">${deck.description || 'Baralho educativo para cadeira quente.'}</p>
                            </div>
                            
                            <div class="d-flex gap-2 flex-wrap pt-2 border-top border-secondary">
                                <button class="btn btn-sm ${isActive ? 'btn-success' : 'btn-outline-primary'} flex-grow-1 fw-bold" onclick="deckBuilder.setActiveDeck('${deck.id}')">
                                    ${isActive ? '<i class="bi bi-check-circle-fill me-1"></i> Selecionado' : '<i class="bi bi-play-circle me-1"></i> Jogar Este'}
                                </button>
                                
                                <div class="btn-group">
                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-three-dots"></i>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
                                        <li><a class="dropdown-item" href="#" onclick="deckBuilder.openShareDeckModal('${deck.id}')"><i class="bi bi-share me-2 text-info"></i>Compartilhar Link</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="shareManager.exportDeckToJson(deckBuilder.getDeckById('${deck.id}'))"><i class="bi bi-filetype-json me-2 text-warning"></i>Exportar JSON</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="shareManager.exportDeckToCsv(deckBuilder.getDeckById('${deck.id}'))"><i class="bi bi-filetype-csv me-2 text-success"></i>Exportar CSV</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="deckBuilder.duplicateDeck('${deck.id}')"><i class="bi bi-copy me-2 text-light"></i>Duplicar / Copiar</a></li>
                                        ${isCustom ? `
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item" href="#" onclick="deckBuilder.openEditDeckModal('${deck.id}')"><i class="bi bi-pencil me-2 text-warning"></i>Editar Baralho</a></li>
                                            <li><a class="dropdown-item text-danger" href="#" onclick="deckBuilder.deleteDeck('${deck.id}')"><i class="bi bi-trash me-2"></i>Excluir Baralho</a></li>
                                        ` : ''}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    openCreateDeckModal() {
        this.editingDeckId = null;
        document.getElementById('edit-deck-modal-title').textContent = '✨ Criar Novo Baralho Educativo';
        document.getElementById('deck-form-title').value = '';
        document.getElementById('deck-form-discipline').value = 'História';
        document.getElementById('deck-form-desc').value = '';
        document.getElementById('deck-form-color').value = '#0d6efd';
        document.getElementById('deck-cards-input').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('editDeckModal'));
        modal.show();
    }

    openEditDeckModal(deckId) {
        const deck = this.getDeckById(deckId);
        if (!deck) return;

        this.editingDeckId = deck.id;
        document.getElementById('edit-deck-modal-title').textContent = `✏️ Editar: ${deck.title}`;
        document.getElementById('deck-form-title').value = deck.title;
        document.getElementById('deck-form-discipline').value = deck.discipline || 'Geral';
        document.getElementById('deck-form-desc').value = deck.description || '';
        document.getElementById('deck-form-color').value = deck.color || '#0d6efd';
        
        const cardsText = deck.cards.map(c => `${c.word}, ${c.category || 'Geral'}, ${c.tip || ''}`).join('\n');
        document.getElementById('deck-cards-input').value = cardsText;

        const modal = new bootstrap.Modal(document.getElementById('editDeckModal'));
        modal.show();
    }

    saveDeckFromForm() {
        const title = document.getElementById('deck-form-title').value.trim();
        const discipline = document.getElementById('deck-form-discipline').value.trim();
        const description = document.getElementById('deck-form-desc').value.trim();
        const color = document.getElementById('deck-form-color').value;
        const rawCards = document.getElementById('deck-cards-input').value.trim();

        if (!title) {
            alert('Por favor, informe o título do baralho.');
            return;
        }

        const cards = [];
        rawCards.split('\n').forEach(line => {
            const clean = line.trim();
            if (!clean) return;
            const parts = clean.split(',');
            const word = parts[0] ? parts[0].trim() : '';
            const category = parts[1] ? parts[1].trim() : (discipline || 'Geral');
            const tip = parts[2] ? parts[2].trim() : '';

            if (word) {
                cards.push({ word, category, tip });
            }
        });

        if (cards.length === 0) {
            alert('Insira pelo menos 1 palavra para o baralho.');
            return;
        }

        const deckId = this.editingDeckId || ('deck_custom_' + Date.now());
        const newDeck = {
            id: deckId,
            title,
            discipline,
            description: description || `Baralho de ${discipline} criado pelo professor.`,
            color,
            icon: 'bi-mortarboard-fill',
            cards
        };

        this.saveDeck(newDeck);
        this.setActiveDeck(newDeck.id);

        const modalEl = document.getElementById('editDeckModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        alert(`✅ Baralho "${title}" salvo com sucesso (${cards.length} cartas)!`);
    }

    saveDeck(deck) {
        const index = this.customDecks.findIndex(d => d.id === deck.id);
        if (index >= 0) {
            this.customDecks[index] = deck;
        } else {
            this.customDecks.push(deck);
        }
        this.saveCustomDecks();
        this.renderDecksGrid();
    }

    duplicateDeck(deckId) {
        const original = this.getDeckById(deckId);
        if (!original) return;

        const copy = {
            ...JSON.parse(JSON.stringify(original)),
            id: 'deck_copy_' + Date.now(),
            title: `${original.title} (Cópia)`
        };

        this.customDecks.push(copy);
        this.saveCustomDecks();
        this.setActiveDeck(copy.id);
        alert(`📋 Cópia criada: "${copy.title}"!`);
    }

    deleteDeck(deckId) {
        if (!confirm('Tem certeza de que deseja excluir este baralho customizado?')) return;
        this.customDecks = this.customDecks.filter(d => d.id !== deckId);
        this.saveCustomDecks();
        if (this.activeDeck && this.activeDeck.id === deckId) {
            this.setActiveDeck(window.DEFAULT_DECKS[0].id);
        } else {
            this.renderDecksGrid();
        }
    }

    openShareDeckModal(deckId) {
        const deck = this.getDeckById(deckId);
        if (!deck) return;

        const url = window.shareManager.encodeDeckToUrl(deck);
        document.getElementById('share-deck-title').textContent = deck.title;
        document.getElementById('share-deck-url').value = url;

        const modal = new bootstrap.Modal(document.getElementById('shareDeckModal'));
        modal.show();
    }

    setupEventListeners() {
        const fileInput = document.getElementById('import-deck-file');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    const content = event.target.result;
                    try {
                        if (file.name.endsWith('.json')) {
                            const parsed = JSON.parse(content);
                            if (parsed.title && Array.isArray(parsed.cards)) {
                                parsed.id = 'deck_imported_' + Date.now();
                                this.saveDeck(parsed);
                                this.setActiveDeck(parsed.id);
                                alert(`✅ Baralho JSON "${parsed.title}" importado com sucesso!`);
                            }
                        } else {
                            const cards = window.shareManager.parseCsvText(content);
                            if (cards.length > 0) {
                                const newDeck = {
                                    id: 'deck_csv_' + Date.now(),
                                    title: file.name.replace(/\.[^/.]+$/, ""),
                                    discipline: 'Importado',
                                    description: 'Importado de arquivo CSV.',
                                    color: '#198754',
                                    icon: 'bi-filetype-csv',
                                    cards
                                };
                                this.saveDeck(newDeck);
                                this.setActiveDeck(newDeck.id);
                                alert(`✅ ${cards.length} cartas importadas do arquivo CSV!`);
                            }
                        }
                    } catch (err) {
                        alert('❌ Erro ao ler arquivo: Verifique a formatação do arquivo.');
                    }
                    fileInput.value = '';
                };
                reader.readAsText(file);
            });
        }
    }
}

window.deckBuilder = new DeckBuilder();
