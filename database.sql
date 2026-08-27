-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS quem_sou_eu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quem_sou_eu_db;

-- Tabela de Palavras / Conceitos de Tecnologia
CREATE TABLE IF NOT EXISTS words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'Médio',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserção de 5 exemplos da área de TI
INSERT INTO words (word, category, difficulty) VALUES
('Docker', 'DevOps & Infraestrutura', 'Médio'),
('API REST', 'Desenvolvimento Web', 'Fácil'),
('Machine Learning', 'Inteligência Artificial', 'Difícil'),
('Git', 'Controle de Versão', 'Fácil'),
('Banco de Dados Não-Relacional (NoSQL)', 'Banco de Dados', 'Médio');

-- Tabela de Histórico de Pontuações (Opcional para persistência das partidas)
CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(50) NOT NULL,
    score INT NOT NULL DEFAULT 0,
    skips INT NOT NULL DEFAULT 0,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
