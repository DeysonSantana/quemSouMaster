/**
 * Quem Sou Eu? - Cadeira Quente Tech
 * Versão Offline com LocalStorage, Gerenciador de Palavras e Sistema de Rodadas
 */

// CHAVES DO LOCALSTORAGE
const STORAGE_KEYS = {
    WORDS: 'qse_tech_words',
    CONFIG: 'qse_tech_config'
};

// PALAVRAS PADRÃO INICIAIS
const DEFAULT_TECH_WORDS = [
    { word: 'Docker', category: 'DevOps & Containers' },
    { word: 'API REST', category: 'Desenvolvimento Web' },
    { word: 'Machine Learning', category: 'Inteligência Artificial' },
    { word: 'Git & GitHub', category: 'Controle de Versão' },
    { word: 'Banco de Dados NoSQL', category: 'Banco de Dados' },
    { word: 'Kubernetes', category: 'DevOps & Nuvem' },
    { word: 'Scrum & Kanban', category: 'Metodologias Ágeis' },
    { word: 'TypeScript', category: 'Linguagem de Programação' },
    { word: 'SQL Injection', category: 'Segurança da Informação' },
    { word: 'Clean Code', category: 'Boas Práticas de Engenharia' },
    { word: 'Recursividade', category: 'Algoritmos' },
    { word: 'Microsserviços', category: 'Arquitetura de Software' }
];

// ESTADO GLOBAL DO JOGO
const GAME = {
    words: [],
    deck: [],
    currentIndex: 0,
    
    // Configurações
    totalRounds: 3,
    roundDuration: 60,
    teamNames: { A: 'Equipe Alpha', B: 'Equipe Beta' },

    // Controle de Rodadas e Turnos
    currentRound: 1,
    currentTeam: 'A', // 'A' ou 'B'
    turnStep: 1, // 1 = Turno Time A, 2 = Turno Time B (por rodada)
    timeLeft: 60,
    timerInterval: null,
    isRunning: false,
    isGameOver: false,

    // Pontuações
    scores: {
        A: { correct: 0, skips: 0 },
        B: { correct: 0, skips: 0 }
    }
};

// ELEMENTOS DO DOM
const dom = {
    body: document.body,
    timer: document.getElementById('timer'),
    word: document.getElementById('mystery-word'),
    category: document.getElementById('word-category'),
    feedback: document.getElementById('round-feedback'),
    statusBadge: document.getElementById('game-status-badge'),
    
    currentRoundNum: document.getElementById('current-round-num'),
    totalRoundsNum: document.getElementById('total-rounds-num'),
    totalWordsCount: document.getElementById('total-words-count'),
    modalWordsCount: document.getElementById('modal-words-count'),

    teamAScore: document.getElementById('team-a-score'),
    teamBScore: document.getElementById('team-b-score'),
    teamACard: document.getElementById('team-a-card'),
    teamBCard: document.getElementById('team-b-card'),
    teamANameBadge: document.getElementById('team-a-name-badge'),
    teamBNameBadge: document.getElementById('team-b-name-badge'),
    teamATurnStatus: document.getElementById('team-a-turn-status'),
    teamBTurnStatus: document.getElementById('team-b-turn-status'),

    // Modais & Formulários
    wordsList: document.getElementById('words-list'),
    addWordForm: document.getElementById('add-word-form'),
    newWordInput: document.getElementById('new-word-input'),
    newCategoryInput: document.getElementById('new-category-input'),
    batchWordsInput: document.getElementById('batch-words-input'),
    btnImportBatch: document.getElementById('btn-import-batch'),
    btnResetDefaultWords: document.getElementById('btn-reset-default-words'),
    
    gameConfigForm: document.getElementById('game-config-form'),
    configRounds: document.getElementById('config-rounds'),
    configTimerDuration: document.getElementById('config-timer-duration'),
    configTeamAName: document.getElementById('config-team-a-name'),
    configTeamBName: document.getElementById('config-team-b-name'),

    winnerModalEl: document.getElementById('winnerModal'),
    winnerTeamName: document.getElementById('winner-team-name'),
    winnerTeamAPts: document.getElementById('winner-team-a-pts'),
    winnerTeamBPts: document.getElementById('winner-team-b-pts'),
    winnerScoreTeamALabel: document.getElementById('winner-score-team-a-label'),
    winnerScoreTeamBLabel: document.getElementById('winner-score-team-b-label'),
    btnPlayAgain: document.getElementById('btn-play-again')
};

// Bootstrap Modal Instances
let winnerModalInstance = null;

// ==========================================
// 🔊 SÍNTESE DE ÁUDIO (Web Audio API - Offline)
// ==========================================
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playSound(type) {
    try {
        initAudio();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'skip') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.linearRampToValueAtTime(140, now + 0.18);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'timeout') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(330, now + 0.15);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } else if (type === 'fanfare') {
            // Fanfarra de vitória
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - C
            notes.forEach((freq, idx) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.connect(g);
                g.connect(audioCtx.destination);
                o.frequency.value = freq;
                const start = now + (idx * 0.12);
                g.gain.setValueAtTime(0.3, start);
                g.gain.exponentialRampToValueAtTime(0.01, start + 0.35);
                o.start(start);
                o.stop(start + 0.35);
            });
        }
    } catch (e) {
        console.warn('Erro áudio:', e);
    }
}

// ==========================================
// 💾 GERENCIAMENTO DE DADOS (LOCALSTORAGE)
// ==========================================
function loadStorageData() {
    // Carregar Palavras
    const storedWords = localStorage.getItem(STORAGE_KEYS.WORDS);
    if (storedWords) {
        try {
            GAME.words = JSON.parse(storedWords);
        } catch (e) {
            GAME.words = [...DEFAULT_TECH_WORDS];
        }
    } else {
        GAME.words = [...DEFAULT_TECH_WORDS];
        saveWordsToStorage();
    }

    // Carregar Configurações
    const storedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (storedConfig) {
        try {
            const config = JSON.parse(storedConfig);
            GAME.totalRounds = parseInt(config.totalRounds) || 3;
            GAME.roundDuration = parseInt(config.roundDuration) || 60;
            if (config.teamNames) {
                GAME.teamNames.A = config.teamNames.A || 'Equipe Alpha';
                GAME.teamNames.B = config.teamNames.B || 'Equipe Beta';
            }
        } catch (e) {}
    }

    applyConfigToUI();
    renderWordsListModal();
    shuffleDeck();
}

function saveWordsToStorage() {
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(GAME.words));
    updateWordCounts();
}

function saveConfigToStorage() {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify({
        totalRounds: GAME.totalRounds,
        roundDuration: GAME.roundDuration,
        teamNames: GAME.teamNames
    }));
}

function updateWordCounts() {
    dom.totalWordsCount.textContent = GAME.words.length;
    dom.modalWordsCount.textContent = GAME.words.length;
}

function shuffleDeck() {
    const arr = [...GAME.words];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    GAME.deck = arr;
    GAME.currentIndex = 0;
}

// ==========================================
// 🛠️ GERENCIAMENTO MANUAL DE PALAVRAS (MODAL)
// ==========================================
function renderWordsListModal() {
    updateWordCounts();
    dom.wordsList.innerHTML = '';

    if (GAME.words.length === 0) {
        dom.wordsList.innerHTML = '<div class="text-center text-white-50 py-3">Nenhuma palavra cadastrada. Adicione acima!</div>';
        return;
    }

    GAME.words.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'word-item';
        row.innerHTML = `
            <div>
                <strong class="text-light fs-6">${escapeHtml(item.word)}</strong>
                <span class="badge bg-secondary ms-2">${escapeHtml(item.category || 'Geral')}</span>
            </div>
            <button class="btn btn-outline-danger btn-sm border-0" onclick="deleteWord(${index})" title="Excluir palavra">
                <i class="bi bi-trash"></i>
            </button>
        `;
        dom.wordsList.appendChild(row);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.deleteWord = function(index) {
    GAME.words.splice(index, 1);
    saveWordsToStorage();
    renderWordsListModal();
    shuffleDeck();
};

dom.addWordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = dom.newWordInput.value.trim();
    const category = dom.newCategoryInput.value.trim() || 'Tecnologia Geral';
    if (!word) return;

    GAME.words.unshift({ word, category });
    saveWordsToStorage();
    renderWordsListModal();
    shuffleDeck();

    dom.newWordInput.value = '';
    dom.newCategoryInput.value = '';
    dom.newWordInput.focus();
});

dom.btnImportBatch.addEventListener('click', () => {
    const rawText = dom.batchWordsInput.value.trim();
    if (!rawText) return;

    const lines = rawText.split('\n');
    let count = 0;

    lines.forEach(line => {
        const clean = line.trim();
        if (!clean) return;
        
        let [word, category] = clean.split(',').map(s => s.trim());
        if (!category) category = 'Tecnologia Geral';
        
        if (word) {
            GAME.words.unshift({ word, category });
            count++;
        }
    });

    if (count > 0) {
        saveWordsToStorage();
        renderWordsListModal();
        shuffleDeck();
        dom.batchWordsInput.value = '';
        alert(`✅ ${count} palavras importadas com sucesso!`);
    }
});

dom.btnResetDefaultWords.addEventListener('click', () => {
    if (confirm('Deseja restaurar as palavras padrão de tecnologia? (Suas palavras atuais serão substituídas)')) {
        GAME.words = [...DEFAULT_TECH_WORDS];
        saveWordsToStorage();
        renderWordsListModal();
        shuffleDeck();
    }
});

// ==========================================
// ⚙️ CONFIGURAÇÕES DA PARTIDA E RODADAS
// ==========================================
function applyConfigToUI() {
    dom.totalRoundsNum.textContent = GAME.totalRounds;
    dom.currentRoundNum.textContent = GAME.currentRound;
    
    dom.configRounds.value = GAME.totalRounds;
    dom.configTimerDuration.value = GAME.roundDuration;
    dom.configTeamAName.value = GAME.teamNames.A;
    dom.configTeamBName.value = GAME.teamNames.B;

    dom.teamANameBadge.textContent = GAME.teamNames.A;
    dom.teamBNameBadge.textContent = GAME.teamNames.B;
    dom.winnerScoreTeamALabel.textContent = GAME.teamNames.A;
    dom.winnerScoreTeamBLabel.textContent = GAME.teamNames.B;
}

dom.gameConfigForm.addEventListener('submit', (e) => {
    e.preventDefault();
    GAME.totalRounds = parseInt(dom.configRounds.value) || 3;
    GAME.roundDuration = parseInt(dom.configTimerDuration.value) || 60;
    GAME.teamNames.A = dom.configTeamAName.value.trim() || 'Equipe Alpha';
    GAME.teamNames.B = dom.configTeamBName.value.trim() || 'Equipe Beta';

    saveConfigToStorage();
    applyConfigToUI();
    resetGame(true);

    const modal = bootstrap.Modal.getInstance(document.getElementById('configModal'));
    if (modal) modal.hide();
});

// ==========================================
// 🎮 GAME LOOP & CONTROLE DE RODADAS
// ==========================================
function renderCurrentWord() {
    if (GAME.deck.length === 0) {
        dom.word.textContent = 'SEM PALAVRAS';
        dom.category.textContent = 'Adicione palavras no menu superior!';
        return;
    }

    if (GAME.currentIndex >= GAME.deck.length) {
        shuffleDeck();
    }

    const current = GAME.deck[GAME.currentIndex];
    if (current) {
        dom.word.textContent = current.word;
        dom.category.textContent = current.category || 'Geral';
    }
}

function flashScreen(type) {
    const className = type === 'correct' ? 'flash-correct' : 'flash-skip';
    dom.body.classList.add(className);
    setTimeout(() => dom.body.classList.remove(className), 220);
}

function handleCorrect() {
    if (!GAME.isRunning || GAME.isGameOver) return;
    playSound('correct');
    flashScreen('correct');
    GAME.scores[GAME.currentTeam].correct += 1;
    updateScoresDisplay();
    GAME.currentIndex += 1;
    renderCurrentWord();
}

function handleSkip() {
    if (!GAME.isRunning || GAME.isGameOver) return;
    playSound('skip');
    flashScreen('skip');
    GAME.scores[GAME.currentTeam].skips += 1;
    GAME.currentIndex += 1;
    renderCurrentWord();
}

function toggleStartPause() {
    if (GAME.isGameOver) return;
    initAudio();

    if (GAME.isRunning) {
        // Pausar
        clearInterval(GAME.timerInterval);
        GAME.isRunning = false;
        dom.statusBadge.textContent = 'PAUSADO';
        dom.statusBadge.className = 'badge bg-warning text-dark fs-5 align-self-center';
    } else {
        // Se tempo esgotou, reseta o tempo da rodada
        if (GAME.timeLeft <= 0) {
            GAME.timeLeft = GAME.roundDuration;
            dom.timer.textContent = GAME.timeLeft;
        }

        GAME.isRunning = true;
        const activeName = GAME.teamNames[GAME.currentTeam];
        dom.statusBadge.textContent = `VEZ DE: ${activeName.toUpperCase()}`;
        dom.statusBadge.className = 'badge bg-success fs-5 align-self-center';
        renderCurrentWord();
        dom.feedback.textContent = 'Atenção, turma: Proibido falar o nome da palavra!';

        GAME.timerInterval = setInterval(() => {
            GAME.timeLeft--;
            dom.timer.textContent = GAME.timeLeft;

            if (GAME.timeLeft <= 10) {
                dom.timer.classList.add('text-danger');
                dom.timer.classList.remove('text-warning');
            } else {
                dom.timer.classList.add('text-warning');
                dom.timer.classList.remove('text-danger');
            }

            if (GAME.timeLeft <= 0) {
                endTurn();
            }
        }, 1000);
    }
}

function endTurn() {
    clearInterval(GAME.timerInterval);
    GAME.isRunning = false;
    playSound('timeout');

    dom.statusBadge.textContent = 'TEMPO ESGOTADO!';
    dom.statusBadge.className = 'badge bg-danger fs-5 align-self-center';
    dom.word.textContent = 'FIM DO TURNO!';
    
    // Verificar avanço de turno ou de rodada
    if (GAME.currentTeam === 'A') {
        // Passa a vez para o Time B na mesma rodada
        dom.category.textContent = `Vez de ${GAME.teamNames.B}! Pressione ESPAÇO para iniciar.`;
        dom.feedback.textContent = `Troca de participante na cadeira quente para ${GAME.teamNames.B}.`;
        setTeam('B');
    } else {
        // Time B terminou -> Rodada concluída!
        if (GAME.currentRound < GAME.totalRounds) {
            GAME.currentRound++;
            dom.currentRoundNum.textContent = GAME.currentRound;
            dom.category.textContent = `Rodada ${GAME.currentRound} de ${GAME.totalRounds}! Pressione ESPAÇO.`;
            dom.feedback.textContent = `Próximo turno: ${GAME.teamNames.A}.`;
            setTeam('A');
        } else {
            // TODAS AS RODADAS CONCLUÍDAS -> FIM DO JOGO
            endGame();
            return;
        }
    }

    GAME.timeLeft = GAME.roundDuration;
    dom.timer.textContent = GAME.timeLeft;
}

function setTeam(team) {
    GAME.currentTeam = team;
    if (team === 'A') {
        dom.teamACard.classList.add('active-team');
        dom.teamBCard.classList.remove('active-team');
        dom.teamATurnStatus.textContent = 'TURNO ATUAL';
        dom.teamATurnStatus.className = 'mt-2 small text-warning';
        dom.teamBTurnStatus.textContent = 'AGUARDANDO';
        dom.teamBTurnStatus.className = 'mt-2 small text-secondary';
    } else {
        dom.teamBCard.classList.add('active-team');
        dom.teamACard.classList.remove('active-team');
        dom.teamBTurnStatus.textContent = 'TURNO ATUAL';
        dom.teamBTurnStatus.className = 'mt-2 small text-warning';
        dom.teamATurnStatus.textContent = 'AGUARDANDO';
        dom.teamATurnStatus.className = 'mt-2 small text-secondary';
    }
}

function switchTeamManual() {
    if (GAME.isRunning || GAME.isGameOver) return;
    setTeam(GAME.currentTeam === 'A' ? 'B' : 'A');
    dom.statusBadge.textContent = `PREPARADO: ${GAME.teamNames[GAME.currentTeam].toUpperCase()}`;
}

function endGame() {
    GAME.isGameOver = true;
    clearInterval(GAME.timerInterval);
    playSound('fanfare');

    const scoreA = GAME.scores.A.correct;
    const scoreB = GAME.scores.B.correct;

    dom.winnerTeamAPts.textContent = scoreA;
    dom.winnerTeamBPts.textContent = scoreB;

    if (scoreA > scoreB) {
        dom.winnerTeamName.textContent = `🏆 ${GAME.teamNames.A.toUpperCase()} CAMPEÃ!`;
        dom.winnerTeamName.className = 'display-6 fw-bold text-primary mb-4';
    } else if (scoreB > scoreA) {
        dom.winnerTeamName.textContent = `🏆 ${GAME.teamNames.B.toUpperCase()} CAMPEÃ!`;
        dom.winnerTeamName.className = 'display-6 fw-bold text-danger mb-4';
    } else {
        dom.winnerTeamName.textContent = '🤝 EMPATE HISTÓRICO!';
        dom.winnerTeamName.className = 'display-6 fw-bold text-warning mb-4';
    }

    if (!winnerModalInstance) {
        winnerModalInstance = new bootstrap.Modal(dom.winnerModalEl);
    }
    winnerModalInstance.show();
}

function updateScoresDisplay() {
    dom.teamAScore.textContent = GAME.scores.A.correct;
    dom.teamBScore.textContent = GAME.scores.B.correct;
}

function resetGame(fullReset = true) {
    clearInterval(GAME.timerInterval);
    GAME.isRunning = false;
    GAME.isGameOver = false;
    GAME.timeLeft = GAME.roundDuration;
    dom.timer.textContent = GAME.timeLeft;
    dom.timer.classList.add('text-warning');
    dom.timer.classList.remove('text-danger');

    if (fullReset) {
        GAME.currentRound = 1;
        GAME.scores.A = { correct: 0, skips: 0 };
        GAME.scores.B = { correct: 0, skips: 0 };
        updateScoresDisplay();
        shuffleDeck();
        setTeam('A');
    }

    dom.currentRoundNum.textContent = GAME.currentRound;
    dom.statusBadge.textContent = 'AGUARDANDO';
    dom.statusBadge.className = 'badge bg-secondary fs-5 align-self-center';
    dom.word.textContent = 'QUEM SOU EU?';
    dom.category.textContent = 'Pressione ESPAÇO para Iniciar';
    dom.feedback.textContent = 'Turma: Dê dicas sem falar o nome da palavra!';
}

dom.btnPlayAgain.addEventListener('click', () => {
    if (winnerModalInstance) winnerModalInstance.hide();
    resetGame(true);
});

// ==========================================
// ⌨️ MAPEAMENTO DE TECLADO (Keybindings)
// ==========================================
window.addEventListener('keydown', (e) => {
    // Ignorar keybindings se o usuário estiver digitando em campos de texto ou modais abertos
    const isModalOpen = document.body.classList.contains('modal-open');
    const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
    if (isModalOpen || isInputFocused) return;

    if (['Space', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) {
        e.preventDefault();
    }

    switch (e.code) {
        case 'Space':
            toggleStartPause();
            break;
        case 'ArrowRight':
            handleCorrect();
            break;
        case 'ArrowLeft':
            handleSkip();
            break;
        case 'Tab':
            switchTeamManual();
            break;
        case 'KeyR':
            if (confirm('Deseja reiniciar a partida atual?')) {
                resetGame(true);
            }
            break;
    }
});

// Inicialização da Aplicação
loadStorageData();
resetGame(true);
