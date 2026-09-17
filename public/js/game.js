/**
 * Quem Sou Eu? - Core Game Engine (Multi-Disciplinary Edition)
 * 100% Offline SPA para GitHub Pages
 */

class GameEngine {
    constructor() {
        this.deck = [];
        this.currentIndex = 0;
        
        this.config = {
            totalRounds: 3,
            roundDuration: 60,
            gameMode: 'combo_streak',
            showPedagogicalPill: true,
            teamA: { name: 'Equipe Alpha', avatar: '🚀' },
            teamB: { name: 'Equipe Beta', avatar: '🦁' }
        };

        this.state = {
            currentRound: 1,
            currentTeam: 'A',
            timeLeft: 60,
            timerInterval: null,
            isRunning: false,
            isGameOver: false,
            streak: 0,
            maxStreak: { A: 0, B: 0 },
            scores: {
                A: { correct: 0, skips: 0, points: 0 },
                B: { correct: 0, skips: 0, points: 0 }
            }
        };

        this.dom = {};
    }

    init() {
        this.cacheDom();
        this.loadConfig();
        this.bindEvents();
        this.applyConfigToUI();
    }

    cacheDom() {
        this.dom = {
            body: document.body,
            viewGame: document.getElementById('view-game-arena'),
            viewDecks: document.getElementById('view-decks-library'),
            
            timer: document.getElementById('timer'),
            word: document.getElementById('mystery-word'),
            category: document.getElementById('word-category'),
            curiosityPill: document.getElementById('curiosity-pill'),
            feedback: document.getElementById('round-feedback'),
            statusBadge: document.getElementById('game-status-badge'),
            streakBadge: document.getElementById('streak-indicator'),
            streakCount: document.getElementById('streak-count'),
            currentRoundNum: document.getElementById('current-round-num'),
            totalRoundsNum: document.getElementById('total-rounds-num'),
            gameModeBadge: document.getElementById('game-mode-badge'),
            
            teamAScore: document.getElementById('team-a-score'),
            teamBScore: document.getElementById('team-b-score'),
            teamACard: document.getElementById('team-a-card'),
            teamBCard: document.getElementById('team-b-card'),
            teamANameBadge: document.getElementById('team-a-name-badge'),
            teamBNameBadge: document.getElementById('team-b-name-badge'),
            teamATurnStatus: document.getElementById('team-a-turn-status'),
            teamBTurnStatus: document.getElementById('team-b-turn-status'),

            winnerModalEl: document.getElementById('winnerModal'),
            winnerTeamName: document.getElementById('winner-team-name'),
            winnerTeamAPts: document.getElementById('winner-team-a-pts'),
            winnerTeamBPts: document.getElementById('winner-team-b-pts'),
            winnerScoreTeamALabel: document.getElementById('winner-score-team-a-label'),
            winnerScoreTeamBLabel: document.getElementById('winner-score-team-b-label'),
            winnerDetails: document.getElementById('winner-details')
        };
    }

    ensureDom() {
        if (!this.dom || !this.dom.timer) {
            this.cacheDom();
        }
    }

    loadConfig() {
        const stored = localStorage.getItem('qse_match_config');
        if (stored) {
            try {
                this.config = { ...this.config, ...JSON.parse(stored) };
            } catch (e) {}
        }
    }

    saveConfig() {
        localStorage.setItem('qse_match_config', JSON.stringify(this.config));
    }

    loadDeck(deck) {
        if (!deck || !deck.cards || deck.cards.length === 0) return;
        this.activeDeckRef = deck;
        this.shuffleDeck();
        this.resetGame(true);
    }

    shuffleDeck() {
        if (!this.activeDeckRef) return;
        const arr = [...this.activeDeckRef.cards];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        this.deck = arr;
        this.currentIndex = 0;
    }

    showView(viewName) {
        this.ensureDom();
        if (!this.dom.viewGame || !this.dom.viewDecks) return;

        if (viewName === 'decks') {
            if (this.state.isRunning) this.toggleStartPause();
            this.dom.viewGame.classList.add('d-none');
            this.dom.viewDecks.classList.remove('d-none');
        } else {
            this.dom.viewDecks.classList.add('d-none');
            this.dom.viewGame.classList.remove('d-none');
        }
    }

    applyConfigToUI() {
        this.ensureDom();
        if (!this.dom.totalRoundsNum) return;

        this.dom.totalRoundsNum.textContent = this.config.totalRounds;
        this.dom.currentRoundNum.textContent = this.state.currentRound;
        
        if (this.dom.teamANameBadge) this.dom.teamANameBadge.innerHTML = `${this.config.teamA.avatar} ${this.config.teamA.name}`;
        if (this.dom.teamBNameBadge) this.dom.teamBNameBadge.innerHTML = `${this.config.teamB.avatar} ${this.config.teamB.name}`;

        const modesMap = {
            'classic': '🎯 Modo Clássico',
            'combo_streak': '🔥 Modo Combo / Streaks',
            'speed_rush': '⚡ Corrida Contra o Tempo'
        };
        if (this.dom.gameModeBadge) {
            this.dom.gameModeBadge.textContent = modesMap[this.config.gameMode] || '🎯 Clássico';
        }
    }

    renderCurrentWord() {
        this.ensureDom();
        if (!this.dom.word) return;

        if (this.deck.length === 0) {
            this.dom.word.textContent = 'SEM CARTAS';
            if (this.dom.category) this.dom.category.textContent = 'Selecione ou crie um baralho na Biblioteca!';
            if (this.dom.curiosityPill) this.dom.curiosityPill.classList.add('d-none');
            return;
        }

        if (this.currentIndex >= this.deck.length) {
            this.shuffleDeck();
        }

        const current = this.deck[this.currentIndex];
        if (current) {
            this.dom.word.textContent = current.word;
            if (this.dom.category) this.dom.category.textContent = current.category || 'Geral';
            
            if (this.config.showPedagogicalPill && current.tip && this.dom.curiosityPill) {
                this.dom.curiosityPill.innerHTML = `💡 <strong>Dica Pedagógica:</strong> ${current.tip}`;
                this.dom.curiosityPill.classList.remove('d-none');
            } else if (this.dom.curiosityPill) {
                this.dom.curiosityPill.classList.add('d-none');
            }
        }
    }

    flashScreen(type) {
        this.ensureDom();
        const cls = type === 'correct' ? 'flash-correct' : 'flash-skip';
        if (this.dom.body) {
            this.dom.body.classList.add(cls);
            setTimeout(() => this.dom.body.classList.remove(cls), 200);
        }
    }

    handleCorrect() {
        if (!this.state.isRunning || this.state.isGameOver) return;

        this.state.streak++;
        const currentTeamKey = this.state.currentTeam;
        
        if (this.state.streak > this.state.maxStreak[currentTeamKey]) {
            this.state.maxStreak[currentTeamKey] = this.state.streak;
        }

        let pointsEarned = 10;
        if (this.config.gameMode === 'combo_streak' && this.state.streak > 1) {
            pointsEarned += (this.state.streak - 1) * 5;
        }

        if (this.config.gameMode === 'speed_rush') {
            this.state.timeLeft = Math.min(120, this.state.timeLeft + 3);
            if (this.dom.timer) this.dom.timer.textContent = this.state.timeLeft;
        }

        this.state.scores[currentTeamKey].correct++;
        this.state.scores[currentTeamKey].points += pointsEarned;

        if (this.state.streak >= 3) {
            window.soundEngine.playCombo();
            this.triggerSmallConfetti();
        } else {
            window.soundEngine.playCorrect(this.state.streak);
        }

        this.flashScreen('correct');
        this.updateStreakDisplay();
        this.updateScoresDisplay();

        this.currentIndex++;
        this.renderCurrentWord();
    }

    handleSkip() {
        if (!this.state.isRunning || this.state.isGameOver) return;

        this.state.streak = 0;
        this.state.scores[this.state.currentTeam].skips++;

        window.soundEngine.playSkip();
        this.flashScreen('skip');
        this.updateStreakDisplay();

        this.currentIndex++;
        this.renderCurrentWord();
    }

    updateStreakDisplay() {
        this.ensureDom();
        if (!this.dom.streakBadge || !this.dom.streakCount) return;

        if (this.state.streak >= 2 && this.config.gameMode === 'combo_streak') {
            this.dom.streakCount.textContent = `${this.state.streak}x`;
            this.dom.streakBadge.classList.remove('d-none');
            this.dom.streakBadge.classList.add('animate-pulse');
        } else {
            this.dom.streakBadge.classList.add('d-none');
        }
    }

    toggleStartPause() {
        if (this.state.isGameOver) return;
        this.ensureDom();
        window.soundEngine.init();

        if (this.state.isRunning) {
            clearInterval(this.state.timerInterval);
            this.state.isRunning = false;
            if (this.dom.statusBadge) {
                this.dom.statusBadge.textContent = 'PAUSADO';
                this.dom.statusBadge.className = 'badge bg-warning text-dark fs-5 align-self-center';
            }
        } else {
            if (this.state.timeLeft <= 0) {
                this.state.timeLeft = this.config.roundDuration;
                if (this.dom.timer) this.dom.timer.textContent = this.state.timeLeft;
            }

            this.state.isRunning = true;
            const team = this.state.currentTeam === 'A' ? this.config.teamA : this.config.teamB;
            if (this.dom.statusBadge) {
                this.dom.statusBadge.textContent = `VEZ DE: ${team.avatar} ${team.name.toUpperCase()}`;
                this.dom.statusBadge.className = 'badge bg-success fs-5 align-self-center';
            }
            this.renderCurrentWord();
            if (this.dom.feedback) this.dom.feedback.textContent = 'Turma: Dê dicas sem falar a palavra!';

            this.state.timerInterval = setInterval(() => {
                this.state.timeLeft--;
                if (this.dom.timer) {
                    this.dom.timer.textContent = this.state.timeLeft;
                    if (this.state.timeLeft <= 10 && this.state.timeLeft > 0) {
                        this.dom.timer.classList.add('text-danger');
                        this.dom.timer.classList.remove('text-warning');
                        window.soundEngine.playWarning();
                    } else {
                        this.dom.timer.classList.add('text-warning');
                        this.dom.timer.classList.remove('text-danger');
                    }
                }

                if (this.state.timeLeft <= 0) {
                    this.endTurn();
                }
            }, 1000);
        }
    }

    endTurn() {
        clearInterval(this.state.timerInterval);
        this.state.isRunning = false;
        this.state.streak = 0;
        this.updateStreakDisplay();
        window.soundEngine.playTimeout();
        this.ensureDom();

        if (this.dom.statusBadge) {
            this.dom.statusBadge.textContent = 'TEMPO ESGOTADO!';
            this.dom.statusBadge.className = 'badge bg-danger fs-5 align-self-center';
        }
        if (this.dom.word) this.dom.word.textContent = 'FIM DO TURNO!';

        if (this.state.currentTeam === 'A') {
            if (this.dom.category) this.dom.category.textContent = `Próximo turno: ${this.config.teamB.avatar} ${this.config.teamB.name}`;
            if (this.dom.feedback) this.dom.feedback.textContent = `Troque o aluno na cadeira quente. Pressione ESPAÇO para começar!`;
            this.setTeam('B');
        } else {
            if (this.state.currentRound < this.config.totalRounds) {
                this.state.currentRound++;
                if (this.dom.currentRoundNum) this.dom.currentRoundNum.textContent = this.state.currentRound;
                if (this.dom.category) this.dom.category.textContent = `Rodada ${this.state.currentRound} de ${this.config.totalRounds}!`;
                if (this.dom.feedback) this.dom.feedback.textContent = `Vez de ${this.config.teamA.avatar} ${this.config.teamA.name}. Pressione ESPAÇO!`;
                this.setTeam('A');
            } else {
                this.endGame();
                return;
            }
        }

        this.state.timeLeft = this.config.roundDuration;
        if (this.dom.timer) this.dom.timer.textContent = this.state.timeLeft;
    }

    setTeam(team) {
        this.ensureDom();
        this.state.currentTeam = team;
        this.state.streak = 0;
        this.updateStreakDisplay();

        if (team === 'A') {
            if (this.dom.teamACard) this.dom.teamACard.classList.add('active-team');
            if (this.dom.teamBCard) this.dom.teamBCard.classList.remove('active-team');
            if (this.dom.teamATurnStatus) {
                this.dom.teamATurnStatus.textContent = 'TURNO ATUAL';
                this.dom.teamATurnStatus.className = 'mt-2 small text-warning fw-bold';
            }
            if (this.dom.teamBTurnStatus) {
                this.dom.teamBTurnStatus.textContent = 'AGUARDANDO';
                this.dom.teamBTurnStatus.className = 'mt-2 small text-white-50';
            }
        } else {
            if (this.dom.teamBCard) this.dom.teamBCard.classList.add('active-team');
            if (this.dom.teamACard) this.dom.teamACard.classList.remove('active-team');
            if (this.dom.teamBTurnStatus) {
                this.dom.teamBTurnStatus.textContent = 'TURNO ATUAL';
                this.dom.teamBTurnStatus.className = 'mt-2 small text-warning fw-bold';
            }
            if (this.dom.teamATurnStatus) {
                this.dom.teamATurnStatus.textContent = 'AGUARDANDO';
                this.dom.teamATurnStatus.className = 'mt-2 small text-white-50';
            }
        }
    }

    switchTeamManual() {
        if (this.state.isRunning || this.state.isGameOver) return;
        this.setTeam(this.state.currentTeam === 'A' ? 'B' : 'A');
        const active = this.state.currentTeam === 'A' ? this.config.teamA : this.config.teamB;
        if (this.dom.statusBadge) this.dom.statusBadge.textContent = `PREPARADO: ${active.name.toUpperCase()}`;
    }

    endGame() {
        this.ensureDom();
        this.state.isGameOver = true;
        clearInterval(this.state.timerInterval);
        window.soundEngine.playFanfare();
        this.triggerBigConfetti();

        const ptsA = this.state.scores.A.points;
        const ptsB = this.state.scores.B.points;
        const hitsA = this.state.scores.A.correct;
        const hitsB = this.state.scores.B.correct;

        if (this.dom.winnerTeamAPts) this.dom.winnerTeamAPts.textContent = ptsA;
        if (this.dom.winnerTeamBPts) this.dom.winnerTeamBPts.textContent = ptsB;
        if (this.dom.winnerScoreTeamALabel) this.dom.winnerScoreTeamALabel.textContent = `${this.config.teamA.avatar} ${this.config.teamA.name}`;
        if (this.dom.winnerScoreTeamBLabel) this.dom.winnerScoreTeamBLabel.textContent = `${this.config.teamB.avatar} ${this.config.teamB.name}`;

        if (this.dom.winnerTeamName) {
            if (ptsA > ptsB) {
                this.dom.winnerTeamName.textContent = `🏆 ${this.config.teamA.name.toUpperCase()} CAMPEÃ!`;
                this.dom.winnerTeamName.className = 'display-6 fw-bold text-primary mb-3';
            } else if (ptsB > ptsA) {
                this.dom.winnerTeamName.textContent = `🏆 ${this.config.teamB.name.toUpperCase()} CAMPEÃ!`;
                this.dom.winnerTeamName.className = 'display-6 fw-bold text-danger mb-3';
            } else {
                this.dom.winnerTeamName.textContent = '🤝 EMPATE HISTÓRICO!';
                this.dom.winnerTeamName.className = 'display-6 fw-bold text-warning mb-3';
            }
        }

        if (this.dom.winnerDetails) {
            this.dom.winnerDetails.innerHTML = `
                <div class="small text-white-50 mb-1">Estatísticas Finais da Partida:</div>
                <div class="d-flex justify-content-around text-light small">
                    <div><strong>${this.config.teamA.name}:</strong> ${hitsA} acertos | Combo Máx: ${this.state.maxStreak.A}x</div>
                    <div><strong>${this.config.teamB.name}:</strong> ${hitsB} acertos | Combo Máx: ${this.state.maxStreak.B}x</div>
                </div>
            `;
        }

        if (this.dom.winnerModalEl && typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(this.dom.winnerModalEl);
            modal.show();
        }
    }

    updateScoresDisplay() {
        this.ensureDom();
        if (this.dom.teamAScore) this.dom.teamAScore.textContent = this.state.scores.A.points;
        if (this.dom.teamBScore) this.dom.teamBScore.textContent = this.state.scores.B.points;
    }

    resetGame(fullReset = true) {
        this.ensureDom();
        clearInterval(this.state.timerInterval);
        this.state.isRunning = false;
        this.state.isGameOver = false;
        this.state.streak = 0;
        this.state.timeLeft = this.config.roundDuration;

        if (this.dom.timer) {
            this.dom.timer.textContent = this.state.timeLeft;
            this.dom.timer.classList.add('text-warning');
            this.dom.timer.classList.remove('text-danger');
        }

        if (fullReset) {
            this.state.currentRound = 1;
            this.state.scores.A = { correct: 0, skips: 0, points: 0 };
            this.state.scores.B = { correct: 0, skips: 0, points: 0 };
            this.state.maxStreak = { A: 0, B: 0 };
            this.updateScoresDisplay();
            this.shuffleDeck();
            this.setTeam('A');
        }

        this.updateStreakDisplay();
        if (this.dom.currentRoundNum) this.dom.currentRoundNum.textContent = this.state.currentRound;
        if (this.dom.statusBadge) {
            this.dom.statusBadge.textContent = 'AGUARDANDO';
            this.dom.statusBadge.className = 'badge bg-secondary fs-5 align-self-center';
        }
        if (this.dom.word) this.dom.word.textContent = 'QUEM SOU EU?';
        if (this.dom.category) this.dom.category.textContent = 'Pressione ESPAÇO para Iniciar';
        if (this.dom.feedback) this.dom.feedback.textContent = 'Turma: Dê dicas sem falar a palavra misteriosa!';
        if (this.dom.curiosityPill) this.dom.curiosityPill.classList.add('d-none');
    }

    triggerSmallConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 25,
                spread: 60,
                origin: { y: 0.85 }
            });
        }
    }

    triggerBigConfetti() {
        if (typeof confetti === 'function') {
            const end = Date.now() + 3000;
            const interval = setInterval(() => {
                if (Date.now() > end) return clearInterval(interval);
                confetti({ startVelocity: 30, spread: 360, ticks: 60, origin: { x: Math.random(), y: Math.random() - 0.2 } });
            }, 250);
        }
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            const isModalOpen = document.body.classList.contains('modal-open');
            const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
            if (isModalOpen || isInput) return;

            if (['Space', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) {
                e.preventDefault();
            }

            switch (e.code) {
                case 'Space':
                    this.toggleStartPause();
                    break;
                case 'ArrowRight':
                    this.handleCorrect();
                    break;
                case 'ArrowLeft':
                    this.handleSkip();
                    break;
                case 'Tab':
                    this.switchTeamManual();
                    break;
                case 'KeyR':
                    if (confirm('Deseja reiniciar a partida?')) this.resetGame(true);
                    break;
                case 'KeyF':
                    this.toggleFullscreen();
                    break;
            }
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    }
}

window.gameEngine = new GameEngine();

window.addEventListener('DOMContentLoaded', () => {
    window.themeManager.init();
    window.gameEngine.init();
    window.deckBuilder.init();
});
