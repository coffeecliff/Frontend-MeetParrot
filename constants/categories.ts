// Categorias válidas do backend: 'movies' | 'games' | 'series' | 'books'
// IMPORTANTE: os IDs devem ser exatamente iguais ao que o backend aceita (minúsculo)

export const CATEGORIES = [
    {
        id: 'movies',
        name: 'Filmes',
        description: 'Fale sobre filmes, cenas favoritas e recomendações.',
        icon: '🎬',
    },
    {
        id: 'games',
        name: 'Games',
        description: 'Partidas, ranks e próximos lançamentos.',
        icon: '🎮',
    },
    {
        id: 'series',
        name: 'Séries',
        description: 'Episódios, spoilers e séries favoritas.',
        icon: '📺',
    },
    {
        id: 'books',
        name: 'Livros',
        description: 'Leituras, autores e recomendações literárias.',
        icon: '📚',
    },
] as const;

export const VALID_CATEGORY_IDS =
    CATEGORIES.map(
        (c) => c.id
    );
