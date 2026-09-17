/**
 * Quem Sou Eu? - Share Manager & Import/Export Engine
 * Suporte a compartilhamento via URL compactada, importação/exportação CSV e JSON.
 */
class ShareManager {
    constructor() {}

    // Codifica um deck para URL Hash
    encodeDeckToUrl(deck) {
        try {
            const jsonStr = JSON.stringify({
                title: deck.title,
                discipline: deck.discipline || 'Geral',
                cards: deck.cards
            });
            const base64 = btoa(encodeURIComponent(jsonStr));
            const url = `${window.location.origin}${window.location.pathname}#deck=${base64}`;
            return url;
        } catch (e) {
            console.error('Erro ao codificar deck:', e);
            return null;
        }
    }

    // Decodifica um deck a partir da URL Hash
    decodeDeckFromUrl() {
        try {
            const hash = window.location.hash;
            if (!hash || !hash.includes('#deck=')) return null;

            const base64 = hash.replace('#deck=', '');
            const jsonStr = decodeURIComponent(atob(base64));
            const data = JSON.parse(jsonStr);

            if (data && data.title && Array.isArray(data.cards)) {
                return {
                    id: 'deck_url_' + Date.now(),
                    title: data.title,
                    discipline: data.discipline || 'Compartilhado',
                    description: 'Baralho recebido via link compartilhado.',
                    color: '#0dcaf0',
                    icon: 'bi-share-fill',
                    cards: data.cards
                };
            }
        } catch (e) {
            console.warn('URL hash não continha um deck válido:', e);
        }
        return null;
    }

    // Exportar Deck como JSON
    exportDeckToJson(deck) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deck, null, 2));
        const downloadAnchor = document.createElement('a');
        const filename = `${deck.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", filename);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    // Exportar Deck como CSV
    exportDeckToCsv(deck) {
        let csvContent = "data:text/csv;charset=utf-8,Palavra,Categoria,Dica\n";
        deck.cards.forEach(c => {
            const word = `"${(c.word || '').replace(/"/g, '""')}"`;
            const cat = `"${(c.category || '').replace(/"/g, '""')}"`;
            const tip = `"${(c.tip || '').replace(/"/g, '""')}"`;
            csvContent += `${word},${cat},${tip}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        const filename = `${deck.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.csv`;
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    // Baixar Modelo CSV em Branco
    downloadCsvTemplate() {
        const csvContent = "data:text/csv;charset=utf-8,Palavra,Categoria,Dica\n" +
            "Fotossíntese,Biologia,Processo de produção de energia pelas plantas\n" +
            "Revolução Francesa,História,Movimento de 1789 na França\n" +
            "Metáfora,Português,Figura de linguagem comparativa\n";

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "modelo_baralho_quem_sou_eu.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    // Fazer parse de arquivo CSV enviado pelo usuário
    parseCsvText(text) {
        const lines = text.split(/\r\n|\n/);
        const cards = [];

        lines.forEach((line, index) => {
            const clean = line.trim();
            if (!clean || (index === 0 && clean.toLowerCase().startsWith('palavra'))) return;

            // Suporta separador por vírgula ou ponto e vírgula
            let parts = clean.split(';');
            if (parts.length < 2) {
                parts = clean.split(',');
            }

            const word = parts[0] ? parts[0].replace(/^"|"$/g, '').trim() : '';
            const category = parts[1] ? parts[1].replace(/^"|"$/g, '').trim() : 'Geral';
            const tip = parts[2] ? parts[2].replace(/^"|"$/g, '').trim() : '';

            if (word) {
                cards.push({ word, category, tip });
            }
        });

        return cards;
    }
}

window.shareManager = new ShareManager();
