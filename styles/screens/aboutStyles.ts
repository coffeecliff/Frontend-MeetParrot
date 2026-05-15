import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const aboutStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F5FB',
    },

    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 40,
        zIndex: 2,
    },

    icon: {
        width: 50,
        height: 50,
    },

    content: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 10,
    },

    logo: {
        width: 200,
        height: 200,
        marginBottom: 50,
    },

    logoText: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#5A6CF3',
    },

    logoHighlight: {
        color: '#6EDC8C',
    },

    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: colors.titlePrimary,
        marginBottom: 20,
    },

    description: {
        fontSize: 20,
        color: colors.descriptionColor,
        textAlign: 'center',
        marginBottom: 15,
        paddingHorizontal: 10,
        fontWeight: '500',
    },
});