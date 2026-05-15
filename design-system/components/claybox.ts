export const clay = {
    softBox: {
        backgroundColor: '#E6E9F0', // Tom base sutilmente mais escuro para o brilho branco destacar
        borderRadius: 35,

        // SIMULAÇÃO DE GRADIENTE INTERNO (Efeito 3D)
        // Luz no topo e esquerda, sombra na base e direita
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 5, // Mais grossa embaixo para dar peso
        
        borderTopColor: 'rgba(255, 255, 255, 0.9)', // Brilho intenso
        borderLeftColor: 'rgba(255, 255, 255, 0.4)', // Brilho médio
        borderRightColor: 'rgba(0, 0, 0, 0.05)',    // Sombra interna sutil
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',    // Sombra interna profunda

        // SOMBRA EXTERNA (Projeção no fundo)
        shadowColor: '#A3B1C6', // Sombra colorida (suave) em vez de preto puro
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 15,

        // Android
        elevation: 12,

        padding: 20,
        overflow: 'visible', 
    },
};