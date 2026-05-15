import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const welcomeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },

    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    content: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 24,
    },

    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.titlePrimary,

        marginBottom: -20,
    },

    logo: {
        width: 260,
        height: 90,

        marginBottom: 20,
    },

    parrot: {
        width: 250,
        height: 250,

        marginBottom: 30,
    },

    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 2,
        marginBottom: 100,
    },

    button: {
        width: 300,
        height: 80,

        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonImage: {
        borderRadius: 999,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '800',

        marginBottom: 8,
    },
});