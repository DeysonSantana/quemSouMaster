# 👑 Quem Sou Master - Games Master (SPA Offline / PWA)

Uma Single Page Application (SPA) moderna, rápida e gamificada para engajamento em sala de aula através do jogo **"Quem Sou Master"** (Cadeira Quente Educacional), parte da família **Games Master** (ao lado do *QuizMaster*).

---

## 🌟 Destaques da Aplicação

- **👑 Família Games Master**: Arquitetura modular padronizada com o QuizMaster (Framework MDA de gamificação e interface imersiva).
- **100% Offline & PWA**: Funciona sem internet após o primeiro acesso com Service Worker nativo.
- **GitHub Pages Ready**: Basta habilitar o GitHub Pages no repositório para rodar instantaneamente.
- **Zero Fricção & Sem Backend**: Não requer banco de dados ou servidor ativo; tudo persiste no `localStorage`.
- **Framework MDA de Gamificação**: Modos de pontuação (Combos & Streaks 🔥, Corrida contra o Tempo ⚡ e Clássico 🎯).
- **Projetor de Alta Legibilidade**: Tipografia massiva (`clamp()`), alto contraste e 6 temas visuais.
- **Áudio Procedural**: Sons de clique, acerto, combo, tempo e fanfarra sintetizados via **Web Audio API** (0 arquivos MP3 externos).
- **Biblioteca Multi-Disciplinar**: Decks prontos de História, Geografia, Ciências/Biologia, Literatura/Português, Matemática, Tecnologia e Artes.
- **Editor & Compartilhamento**: Crie baralhos personalizados, importe/exporte CSV e JSON, ou compartilhe via link compactado (`#deck=...`).

---

## 🚀 Como Publicar no GitHub Pages (1 Minuto)

1. Faça o commit e push de todos os arquivos para a branch principal (`main`) do seu repositório no GitHub:
   ```bash
   git add .
   git commit -m "feat: Quem Sou Master - Games Master"
   git push origin main
   ```
2. No seu repositório no GitHub, acesse **Settings** ➔ **Pages**.
3. Em **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / Folder: `/ (root)`
4. Clique em **Save**. Em instantes o link estará disponível (ex: `https://seu-usuario.github.io/quem-sou-master/`).

---

## ⌨️ Atalhos de Teclado para o Professor

| Tecla | Ação |
| :--- | :--- |
| <kbd>Barra de Espaço</kbd> | Iniciar / Pausar Cronômetro |
| <kbd>Seta Direita (➡️)</kbd> | Acerto (+Pontos, Som de Vitória, Incrementa Combo) |
| <kbd>Seta Esquerda (⬅️)</kbd> | Pular Palavra (Zera Combo, Som de Skip) |
| <kbd>Tab</kbd> | Alternar Turno da Equipe Manualmente |
| <kbd>F</kbd> | Alternar Modo Tela Cheia (Fullscreen) |
| <kbd>R</kbd> | Reiniciar a Partida |

---

## 📂 Estrutura do Repositório

```text
├── index.html            # SPA Principal (HTML5 + Bootstrap 5)
├── manifest.json         # Manifesto PWA com caminhos relativos
├── sw.js                 # Service Worker com estratégia Cache-First
├── css/
│   └── style.css         # 6 Temas Visuais (Dark Neon, Lousa, Emerald, Sunset, AMOLED, Light)
├── js/
│   ├── audio.js          # Síntese de áudio procedural (Web Audio API)
│   ├── themeManager.js   # Gerenciador de temas dinâmicos
│   ├── decks.js          # Decks padrão de História, Geo, Bio, Português, Matemática e Tech
│   ├── shareManager.js   # Importador/Exportador CSV/JSON e URL Encoder
│   ├── deckBuilder.js    # Construtor visual de baralhos e gerenciador de biblioteca
│   └── game.js           # Orquestrador do jogo, game loop e regras MDA
└── README.md
```
