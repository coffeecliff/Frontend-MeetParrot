import { StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';

export const chatSelectStyles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },

    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.9,
    },

    title: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.titlePrimary,
        marginTop: 20,
        marginBottom: 50,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },

    card: {
        width: '45%',
        alignItems: 'center',
        marginBottom: 30,
    },

    cardIcon: {
        width: 80,
        height: 80,
        marginBottom: 6,
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.titlePrimary,
    },

    cardSubtitle: {
        fontSize: 14,
        color: colors.titleSecondary,
        marginTop: 2,
        fontWeight: '600',
    },
});