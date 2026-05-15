import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const coinsStyles = StyleSheet.create({

    container: {
        flex: 1,

        overflow: 'hidden',

        backgroundColor: '#F3F3F3',
    },

    background: {
        position: 'absolute',

        width: '100%',
        height: '100%',
    },

    content: {
        flex: 1,

        alignItems: 'center',

        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 110,
    },

    parrot: {
        width: 240,
        height: 200,

        marginTop: -20,
        marginBottom: -10,
    },

    card: {
        width: '100%',

        borderRadius: 30,

        overflow: 'hidden',

        paddingHorizontal: 22,
        paddingVertical: 20,
    },

    cardImage: {
        width: '100%',
        height: '100%',
    },

    titleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 14,
        marginBottom: 10,
    },

    title: {
        color: colors.titlePrimary,

        fontSize: 28,
        fontWeight: '900',
    },

    infoIcon: {
        width: 20,
        height: 20,

        marginLeft: 6,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    coinButton: {
        width: '48%',

        alignItems: 'center',

        marginBottom: 26,
    },

    coinAmount: {
        color: '#4E4E4E',

        fontSize: 20,
        fontWeight: '700',

        
    },

    coinImage: {
        width: 80,
        height: 80,

        marginBottom: -4,
    },

    price: {
        color: '#4E4E4E',

        fontSize: 26,
        fontWeight: '400',
    },

});