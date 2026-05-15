// styles/screens/chatRoomStyles.ts

import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const chatRoomStyles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        width: '100%',
    },

    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    chatArea: {
        flex: 1,

        marginHorizontal: 14,
        marginTop: 15,
        marginBottom: 50,

        backgroundColor: 'rgba(255,255,255,0.92)',

        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,

        overflow: 'hidden',
    },

    messagesContainer: {
        paddingHorizontal: 14,
        paddingTop: 16,
        paddingBottom: 16,
    },

    messageRow: {
        width: '100%',

        flexDirection: 'row',
        alignItems: 'flex-end',

        marginBottom: 16,
    },

    partnerRow: {
        justifyContent: 'flex-start',
    },

    ownRow: {
        justifyContent: 'flex-end',
    },

    messageProfile: {
        width: 32,
        height: 32,

        borderRadius: 999,

        marginHorizontal: 6,
    },

    messageBubble: {
        maxWidth: '68%',

        paddingHorizontal: 14,
        paddingVertical: 10,

        borderRadius: 18,
    },

    partnerBubble: {
        backgroundColor: colors.partnerBubble,

        borderTopLeftRadius: 6,
    },

    ownBubble: {
        backgroundColor: colors.ownBubble,

        borderTopRightRadius: 6,
    },

    messageText: {
        color: '#FFFFFF',

        fontSize: 14,
        fontWeight: '600',
    },

    bottomArea: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingTop: 4,
    },

    inputContainer: {
        width: '100%',
        minHeight: 58,
        maxHeight: 130,

        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: '#F3F3F3',

        borderRadius: 999,

        borderWidth: 1.5,
        borderColor: '#D7D7D7',

        paddingLeft: 16,
        paddingRight: 6,
        paddingVertical: 4,
    },

    inputWrapper: {
        flex: 1,

        justifyContent: 'center',
        marginRight: 6,
    },

    input: {
        width: '100%',

        color: '#444',

        fontSize: 15,

        minHeight: 42,
        maxHeight: 100,

        paddingTop: 10,
        paddingBottom: 10,

        margin: 0,

        textAlignVertical: 'center',
    },

    emojiButton: {
        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 8,
    },

    emojiIcon: {
        width: 28,
        height: 28,

        opacity: 0.7,
    },

    sendButtonWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    sendButton: {
        width: 46,
        height: 46,

        justifyContent: 'center',
        alignItems: 'center',
    },

    sendButtonImage: {
        borderRadius: 999,
    },
});