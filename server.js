const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Pool de conexão com MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'quem_sou_eu_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Palavras de fallback caso o banco esteja inacessível (resiliência para aula)
const fallbackWords = [
    { id: 1, word: 'Docker', category: 'DevOps & Infraestrutura' },
    { id: 2, word: 'API REST', category: 'Desenvolvimento Web' },
    { id: 3, word: 'Machine Learning', category: 'Inteligência Artificial' },
    { id: 4, word: 'java', category: 'Controle de Versão' },
    { id: 5, word: 'Banco de Dados Não-Relacional (NoSQL)', category: 'Banco de Dados' },
    { id: 6, word: 'Kubernetes', category: 'DevOps' },
    { id: 7, word: 'Node.js', category: 'Linguagem' },
    { id: 8, word: 'Clean Architecture', category: 'Arquitetura' }
];

// Endpoint: Buscar baralho de palavras
app.get('/api/words', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, word, category FROM words');
        if (rows.length > 0) {
            return res.json(rows);
        }
        res.json(fallbackWords);
    } catch (err) {
        console.warn('⚠️ MySQL inacessível. Usando fallback offline/local:', err.message);
        res.json(fallbackWords);
    }
});

// Endpoint: Salvar pontuação da partida
app.post('/api/scores', async (req, res) => {
    const { team, score, skips } = req.body;
    try {
        await pool.query('INSERT INTO matches (team_name, score, skips) VALUES (?, ?, ?)', [
            team || 'Equipe',
            score || 0,
            skips || 0
        ]);
        res.status(201).json({ message: 'Pontuação salva com sucesso!' });
    } catch (err) {
        console.warn('⚠️ Não foi possível gravar pontuação no MySQL:', err.message);
        res.status(200).json({ message: 'Aviso: Pontuação registrada apenas localmente.' });
    }
});

app.listen(PORT, () => {
    console.log(`🎮 Servidor 'Quem Sou Master' rodando em: http://localhost:${PORT}`);
});
