import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage as ChatMessageType } from '../constants/types';
import { colors } from '../constants/colors';

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={[styles.row, message.isUser ? styles.ownRow : styles.partnerRow]}>
            <View style={[styles.bubble, message.isUser ? styles.ownBubble : styles.partnerBubble]}>
                {!message.isUser && message.userName && (
                    <Text style={styles.username}>{message.userName}</Text>
                )}
                <Text style={[styles.text, message.isUser ? styles.ownText : styles.partnerText]}>
                    {message.text}
                </Text>
                <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginVertical: 4,
        paddingHorizontal: 12,
    },
    ownRow: {
        justifyContent: 'flex-end',
    },
    partnerRow: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '75%',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    ownBubble: {
        backgroundColor: colors.ownBubble,
        borderBottomRightRadius: 4,
    },
    partnerBubble: {
        backgroundColor: colors.partnerBubble,
        borderBottomLeftRadius: 4,
    },
    username: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
        opacity: 0.8,
    },
    text: {
        fontSize: 15,
        fontWeight: '500',
    },
    ownText: {
        color: '#fff',
    },
    partnerText: {
        color: '#fff',
    },
    time: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
});
