import React from "react";
import { StyleSheet } from "react-native";
import { ChatBubble as DSChatBubble } from "../design-system";
import { ChatMessage as ChatMessageType } from "../constants/types";

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return (
        <DSChatBubble
            message={message.text}
            position={message ? 'right' : 'left'}
            timestamp={formatTime(message.timestamp)}
            username={message.userName}
            showUsername={!message.isUser}

        />
    );
}