/**
 * Quem Sou Eu? - Decks Padrão Multi-Disciplinares
 * Baralhos pré-carregados para diversas disciplinas escolares e acadêmicas.
 */
const DEFAULT_DECKS = [
    {
        id: 'deck_tech',
        title: '💻 Tecnologia, Programação & IA',
        discipline: 'Tecnologia',
        description: 'Conceitos de desenvolvimento de software, infraestrutura, banco de dados e inteligência artificial.',
        color: '#0d6efd',
        icon: 'bi-laptop',
        cards: [
            { word: 'Docker', category: 'DevOps & Containers', tip: 'Permite empacotar aplicações em contêineres leves e isolados.' },
            { word: 'API REST', category: 'Desenvolvimento Web', tip: 'Interface de comunicação entre sistemas usando verbos HTTP (GET, POST, etc).' },
            { word: 'Machine Learning', category: 'Inteligência Artificial', tip: 'Subcampo da IA onde algoritmos aprendem padrões a partir de dados.' },
            { word: 'Git & GitHub', category: 'Controle de Versão', tip: 'Ferramenta para rastrear alterações no código e hospedar repositórios.' },
            { word: 'Banco de Dados NoSQL', category: 'Banco de Dados', tip: 'Bancos não-relacionais como MongoDB, Redis e Cassandra.' },
            { word: 'Kubernetes', category: 'DevOps & Nuvem', tip: 'Orquestrador de contêineres em larga escala criado pelo Google.' },
            { word: 'TypeScript', category: 'Linguagem de Programação', tip: 'Superset do JavaScript que adiciona tipagem estática.' },
            { word: 'Clean Code', category: 'Engenharia de Software', tip: 'Filosofia de escrever código legível, testável e manutenível.' },
            { word: 'SQL Injection', category: 'Segurança da Informação', tip: 'Ataque que insere comandos maliciosos em consultas ao banco.' },
            { word: 'Computação em Nuvem', category: 'Infraestrutura', tip: 'Acesso sob demanda a servidores e armazenamento (AWS, Azure, GCP).' },
            { word: 'Recursividade', category: 'Algoritmos', tip: 'Quando uma função chama a si mesma até atingir uma condição de parada.' },
            { word: 'Microsserviços', category: 'Arquitetura', tip: 'Padrão arquitetural que divide um sistema em pequenos serviços autônomos.' }
        ]
    },
    {
        id: 'deck_historia',
        title: '🏛️ História Geral & do Brasil',
        discipline: 'História',
        description: 'Eventos históricos marcantes, civilizações antigas, revoluções e figuras históricas.',
        color: '#ffc107',
        icon: 'bi-bank',
        cards: [
            { word: 'Revolução Francesa', category: 'Idade Moderna', tip: 'Movimento de 1789 com o lema Liberdade, Igualdade e Fraternidade.' },
            { word: 'Império Romano', category: 'Antiguidade Clássica', tip: 'Civilização que dominou o Mediterrâneo com generais como Júlio César.' },
            { word: 'Era Vargas', category: 'História do Brasil', tip: 'Período presidencial de 1930 a 1945 marcado pela CLT e industrialização.' },
            { word: 'Guerra Fria', category: 'Século XX', tip: 'Disputa ideológica e geopolítica entre Estados Unidos (EUA) e União Soviética (URSS).' },
            { word: 'Antigo Egito', category: 'Antiguidade Oriental', tip: 'Civilização do Rio Nilo famosa por pirâmides, faraós e hieróglifos.' },
            { word: 'Inconfidência Mineira', category: 'Brasil Colônia', tip: 'Movimento separatista de 1789 em Minas Gerais liderado por Tiradentes.' },
            { word: 'Revolução Industrial', category: 'Século XVIII', tip: 'Surgimento das máquinas a vapor e transformação da produção nas fábricas.' },
            { word: 'Queda do Muro de Berlim', category: 'Século XX', tip: 'Marco histórico de 1989 que simbolizou o fim iminente da Guerra Fria.' },
            { word: 'Guerra de Canudos', category: 'Brasil República', tip: 'Conflito no sertão baiano liderado pelo líder religioso Antônio Conselheiro.' },
            { word: 'Renascimento Cultural', category: 'Idade Moderna', tip: 'Movimento europeu de valorização do humanismo e da arte clássica.' }
        ]
    },
    {
        id: 'deck_geografia',
        title: '🌍 Geografia & Geopolítica',
        discipline: 'Geografia',
        description: 'Biomas, relevo, capitais mundiais, placas tectônicas e geopolítica global.',
        color: '#198754',
        icon: 'bi-globe-americas',
        cards: [
            { word: 'Floresta Amazônica', category: 'Biomas & Ecologia', tip: 'Maior floresta tropical do planeta com gigantesca biodiversidade.' },
            { word: 'Placas Tectônicas', category: 'Geologia & Relevo', tip: 'Blocos da crosta terrestre cuja movimentação causa terremotos e vulcões.' },
            { word: 'Canal de Suez', category: 'Geopolítica & Comércio', tip: 'Canal artificial no Egito que liga o Mediterrâneo ao Mar Vermelho.' },
            { word: 'Cerrado Brasileiro', category: 'Biomas Nacionais', tip: 'A savana brasileira com vegetação de troncos retorcidos e berço das águas.' },
            { word: 'Efeito Estufa', category: 'Climatologia', tip: 'Fenômeno natural de retenção de calor intensificado pela emissão de gases.' },
            { word: 'Cordilheira dos Andes', category: 'Relevo Mundial', tip: 'Maior cadeia de montanhas contínua da Terra, localizada na América do Sul.' },
            { word: 'Globalização', category: 'Geografia Humana', tip: 'Processo de integração econômica, cultural e tecnológica mundial.' },
            { word: 'Linha do Equador', category: 'Cartografia', tip: 'Paralelo de latitude 0° que divide o planeta em hemisférios Norte e Sul.' },
            { word: 'Fossa das Marianas', category: 'Oceanografia', tip: 'O ponto mais profundo conhecido dos oceanos terrestres.' }
        ]
    },
    {
        id: 'deck_ciencias',
        title: '🧬 Ciências da Natureza & Biologia',
        discipline: 'Ciências',
        description: 'Citologia, corpo humano, química fundamental, física e astronomia.',
        color: '#0dcaf0',
        icon: 'bi-virus',
        cards: [
            { word: 'Fotossíntese', category: 'Botânica & Bioquímica', tip: 'Processo pelo qual plantas usam luz solar, água e CO2 para produzir glicose.' },
            { word: 'Molécula de DNA', category: 'Genética', tip: 'Ácido desoxirribonucleico em formato de dupla hélice com nosso código genético.' },
            { word: 'Tabela Periódica', category: 'Química Geral', tip: 'Organização sistemática dos elementos químicos por número atômico.' },
            { word: 'Mitocôndria', category: 'Citologia', tip: 'Organela celular responsável pela respiração celular e produção de ATP.' },
            { word: 'Gravidade', category: 'Física Clássica', tip: 'Força de atração mútua entre massas formulada por Isaac Newton.' },
            { word: 'Buraco Negro', category: 'Astronomia', tip: 'Região do espaço com gravidade tão intensa que nem a luz consegue escapar.' },
            { word: 'Neurônio', category: 'Anatomia Humana', tip: 'Célula do sistema nervoso especializada em conduzir impulsos elétricos.' },
            { word: 'Vacinas', category: 'Imunologia & Saúde', tip: 'Substâncias biológicas que estimulam o sistema imune a combater patógenos.' },
            { word: 'Teoria da Relatividade', category: 'Física Moderna', tip: 'Teoria de Albert Einstein que unificou espaço e tempo.' }
        ]
    },
    {
        id: 'deck_literatura',
        title: '📚 Literatura & Língua Portuguesa',
        discipline: 'Língua Portuguesa',
        description: 'Grandes autores, figuras de linguagem, escolas literárias e gramática.',
        color: '#d63384',
        icon: 'bi-book-half',
        cards: [
            { word: 'Machado de Assis', category: 'Literatura Brasileira', tip: 'Fundador da ABL e mestre do Realismo, autor de Dom Casmurro.' },
            { word: 'Metáfora', category: 'Figuras de Linguagem', tip: 'Comparação implícita entre dois elementos sem o uso de conectivos comparativos.' },
            { word: 'Modernismo de 1922', category: 'Movimentos Literários', tip: 'Semana de Arte Moderna no Theatro Municipal de São Paulo.' },
            { word: 'Guimarães Rosa', category: 'Literatura Brasileira', tip: 'Autor mineiro célebre por Grande Sertão: Veredas.' },
            { word: 'Ironia', category: 'Figuras de Linguagem', tip: 'Afirmação em que se diz o oposto do que realmente se quer expressar.' },
            { word: 'O Cortiço (Aluísio Azevedo)', category: 'Naturalismo', tip: 'Romance naturalista que retrata as condições sociais de habitações coletivas.' },
            { word: 'Sujeito e Predicado', category: 'Sintaxe', tip: 'Os dois termos essenciais da oração na gramática normativa.' },
            { word: 'Trovadorismo', category: 'História Literária', tip: 'Primeiro movimento literário em língua portuguesa com cantigas medievais.' }
        ]
    },
    {
        id: 'deck_matematica',
        title: '📐 Matemática & Lógica',
        discipline: 'Matemática',
        description: 'Geometria, álgebra, teoremas célebres e raciocínio lógico.',
        color: '#fd7e14',
        icon: 'bi-calculator-fill',
        cards: [
            { word: 'Teorema de Pitágoras', category: 'Geometria Plana', tip: 'Em todo triângulo retângulo: a hipotenusa ao quadrado é a soma dos catetos ao quadrado.' },
            { word: 'Número Pi (π)', category: 'Constantes Matemáticas', tip: 'Razão entre o perímetro de uma circunferência e seu diâmetro (~3,14159).' },
            { word: 'Sequência de Fibonacci', category: 'Aritmética & Padrões', tip: 'Sequência onde cada número é a soma dos dois anteriores (0, 1, 1, 2, 3, 5, 8...).' },
            { word: 'Equação de 2º Grau (Bhaskara)', category: 'Álgebra', tip: 'Fórmula resolutiva que calcula raízes através do discriminante Delta (b² - 4ac).' },
            { word: 'Probabilidade', category: 'Estatística', tip: 'Ramo que calcula as chances de ocorrência de eventos em experimentos aleatórios.' },
            { word: 'Plano Cartesiano', category: 'Geometria Analítica', tip: 'Sistema de coordenadas com eixos perpendiculares X (abscissas) e Y (ordenadas).' },
            { word: 'Números Primos', category: 'Teoria dos Números', tip: 'Números inteiros maiores que 1 que só são divisíveis por 1 e por si mesmos.' },
            { word: 'Fatorial (n!)', category: 'Análise Combinatória', tip: 'Produto de todos os inteiros positivos menores ou iguais a n.' }
        ]
    },
    {
        id: 'deck_pop_cultura',
        title: '🎬 Cinema, Artes & Cultura Pop',
        discipline: 'Artes & Conhecimentos',
        description: 'Cinema mundial, obras de arte históricas, mitologia e cultura contemporânea.',
        color: '#6f42c1',
        icon: 'bi-film',
        cards: [
            { word: 'Mona Lisa (Leonardo da Vinci)', category: 'Artes Plásticas', tip: 'Famosa pintura no Museu do Louvre de sorriso enigmático.' },
            { word: 'Star Wars (Guerra nas Estrelas)', category: 'Cinema de Ficção', tip: 'Saga espacial criada por George Lucas com sabres de luz e a Força.' },
            { word: 'Mitologia Grega', category: 'Mitologia & Culturas', tip: 'Conjunto de mitos sobre deuses do Olimpo como Zeus, Atena e Poseidon.' },
            { word: 'Noite Estrelada (Van Gogh)', category: 'Pós-Impressionismo', tip: 'Obra icônica com céu espiralado e tons azuis e amarelos vibrantes.' },
            { word: 'Prêmio Oscar', category: 'Cinema Mundial', tip: 'Mais prestigiada premiação da indústria cinematográfica hollywoodiana.' },
            { word: 'O Senhor dos Anéis (J.R.R. Tolkien)', category: 'Literatura Fantástica', tip: 'Trilogia épica ambientada na Terra Média.' }
        ]
    }
];

window.DEFAULT_DECKS = DEFAULT_DECKS;
