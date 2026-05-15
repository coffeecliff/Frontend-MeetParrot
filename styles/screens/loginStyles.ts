import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const loginStyles = StyleSheet.create({
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

        paddingHorizontal: 30,

    },

    parrot: {
        width: 200,
        height: 200,

        marginBottom: -8,
    },

    logo: {
        width: 220,
        height: 70,
        marginTop: -10,
        marginBottom: 60,
    },

    title: {
        textAlign: 'center',

        fontSize: 30,
        fontWeight: '700',

        color: colors.titleSecondary,

        lineHeight: 30,

        marginBottom: 20,
    },

    inputContainer: {
        width: '100%',
        gap: 22,
    },

    label: {
        color: colors.titleSecondary,

        fontSize: 13,
        fontWeight: '700',

        letterSpacing: 2,

        marginBottom: 2,
    },

    inputBackground: {
        width: '100%',
        height: 58,

        justifyContent: 'center',

        paddingHorizontal: 16,
    },

    inputImage: {
        borderRadius: 999,
    },

    input: {
        fontSize: 16,
        color: '#333',
    },

    forgotText: {
        alignSelf: 'flex-start',
        textAlign: 'left',

        marginTop: 10,
        marginBottom: 26,

        fontSize: 11,
        fontStyle: 'italic',

        color: '#555',

        textDecorationLine: 'underline',
    },
    forgotButton: {
        marginLeft: 10,
        width: '100%',
        alignItems: 'flex-start',
    },

    loginButton: {
        width: 280,
        height: 62,

        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 24,
    },

    loginButtonImage: {
        borderRadius: 999,
    },

    loginButtonText: {
        color: '#FFFFFF',

        fontSize: 20,
        fontWeight: '900',

        marginBottom: 4,
    },

    registerText: {
        marginTop: 4,

        fontSize: 12,
        color: colors.titleSecondary,
        marginBottom: 60,
    },

    registerLink: {
        fontWeight: '900',
        textDecorationLine: 'underline',
    },
});