// app/chat/searching.tsx
//
// Tela de Searching — renderizada como overlay ABSOLUTO dentro de room.tsx.
// Recebe queuePosition e estimatedWait como props para exibir junto ao loading.

import React from 'react';

import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

interface SearchingScreenProps {
    onBack?: () => void;
    queuePosition?: number | string | null;
    estimatedWait?: number | string | null;
}

export default function SearchingScreen({ onBack, queuePosition, estimatedWait }: SearchingScreenProps) {

    return (
        <View style={styles.container}>

            {/* BACKGROUND */}
            <Image
                source={require('../../assets/backgrounds/bg1.png')}
                style={styles.background}
                resizeMode="cover"
            />

            {/* HEADER com botão voltar */}
            <View style={styles.header}>
                {onBack && (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onBack}
                        style={styles.backButton}
                    >
                        <Image
                            source={require('../../assets/buttons/back_bt.png')}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* CONTENT */}
            <View style={styles.content}>

                {/* TITLE */}
                <Text style={styles.title}>
                    Procurando por{'\n'}usuário
                </Text>

                {/* DOTS GIF */}
                <Image
                    source={require('../../assets/loading.gif')}
                    style={styles.dots}
                    resizeMode="contain"
                />

                {/* QUEUE INFO — posição na fila e tempo estimado */}
                {(queuePosition || estimatedWait) && (
                    <View style={styles.queueContainer}>
                        {!!queuePosition && (
                            <Text style={styles.queueText}>
                                🔢 Posição na fila: {queuePosition}
                            </Text>
                        )}
                        {!!estimatedWait && (
                            <Text style={styles.queueText}>
                                ⏱ Tempo estimado: {estimatedWait}
                            </Text>
                        )}
                    </View>
                )}

                {/* PARROT */}
                <Image
                    source={require('../../assets/logos/parrot_logo4.png')}
                    style={styles.parrot}
                    resizeMode="contain"
                />

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    // Ocupa TODO o espaço disponível do pai (room.tsx posiciona como absolute)
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    header: {
        zIndex: 9999,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 25,
        paddingHorizontal: 20,
        paddingBottom: 12,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        overflow: 'visible',
    },

    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    backIcon: {
        width: 50,
        height: 50,
    },

    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    title: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '800',
        color: '#6C63FF',
        lineHeight: 36,
        marginBottom: 20,
    },

    dots: {
        width: 130,
        height: 70,
        marginBottom: 16,
    },

    queueContainer: {
        alignItems: 'center',
        marginBottom: 40,
        gap: 6,
    },

    queueText: {
        color: '#6B6B6B',
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
    },

    parrot: {
        width: 260,
        height: 260,
    },
});
