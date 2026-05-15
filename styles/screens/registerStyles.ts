import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const registerStyles = StyleSheet.create({
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
        width: 260,
        height: 56,
        marginTop: -10,
        marginBottom: 20,
    },

    title: {
        textAlign: 'center',

        fontSize: 24,
        fontWeight: '700',

        color: colors.titleSecondary,

        lineHeight: 30,

        marginBottom: 10,
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

    dateRow: {
        width: '100%',

        flexDirection: 'row',
        alignItems: 'center',

        gap: 10,
    },

    calendarButton: {
        width: 58,
        height: 58,
    },

    calendarBg: {
        width: '100%',
        height: '100%',

        justifyContent: 'center',
        alignItems: 'center',
    },

    calendarImage: {
        borderRadius: 999,
       
    },

    dateInputBackground: {
        flex: 1,
        height: 60,
        width: '100%',

        justifyContent: 'center',
        alignItems: 'center',

        paddingHorizontal: 16,
    },

    registerButton: {
        width: 280,
        height: 62,

        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 10,
    },

    registerButtonImage: {
        borderRadius: 999,
    },

    registerButtonText: {
        color: '#FFFFFF',

        fontSize: 20,
        fontWeight: '900',

        marginBottom: 4,
    },

    checkboxContainer: {
        width: '100%',

        flexDirection: 'row',
        alignItems: 'center',

        marginTop: 14,
        marginBottom: 6,
    },

    checkbox: {
        width: 24,
        height: 24,

        borderRadius: 8,

        borderWidth: 4,
        borderColor: colors.borderColor,

       

        marginRight: 10,

        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },

    checkboxChecked: {
        backgroundColor: colors.borderColor,
    },

    checkboxText: {
        flex: 1,

        color: colors.titleSecondary,

        fontSize: 13,
        fontWeight: '700',
    },

    checkIcon: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
    },

    loginText: {
        marginTop: 4,
        marginBottom: 20,
        fontSize: 12,
        color: colors.titleSecondary,
    },

    loginLink: {
        fontWeight: '900',
        textDecorationLine: 'underline',
    },
});