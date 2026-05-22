// styles/screens/settingsStyles.ts

import { StyleSheet } from 'react-native';

export const settingsStyles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#FFFFFF',
    },

    background: {
        position: 'absolute',

        width: '100%',
        height: '100%',
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

        paddingHorizontal: 24,
        paddingTop: 10,
    },

    settingsIcon: {
        width: 90,
        height: 90,

        alignSelf: 'center',

        marginTop: 10,
        marginBottom: 30,
    },

    infoBox: {
        width: '100%',

        borderTopWidth: 1,
        borderBottomWidth: 1,

        borderColor: 'rgba(0,0,0,0.08)',

        paddingVertical: 14,

        gap: 28,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    infoText: {
        color: '#3A3A3A',

        fontSize: 17,
        fontWeight: '500',
    },

    editIcon: {
        width: 24,
        height: 24,

        tintColor: '#555',
    },

    contactBox: {
        marginTop: 35,

        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',

        paddingBottom: 35,
    },

    contactTitle: {
        color: '#3A3A3A',

        fontSize: 18,
        fontWeight: '500',

        marginBottom: 22,
    },

    contactEmail: {
        color: '#3A3A3A',

        fontSize: 16,
    },

    actionsContainer: {
        marginTop: 'auto',

        paddingBottom: 50,
    },

    signOutButton: {
        marginBottom: 18,
    },

    signOutText: {
        color: '#3A3A3A',

        fontSize: 17,
        fontStyle: 'italic',
    },

    deleteButton: {
        alignSelf: 'flex-start',

        backgroundColor: '#FFA7A7',

        paddingHorizontal: 12,
        paddingVertical: 6,

        borderRadius: 10,
    },

    deleteText: {
        color: '#6B1F1F',

        fontSize: 16,
        fontStyle: 'italic',
    },
});