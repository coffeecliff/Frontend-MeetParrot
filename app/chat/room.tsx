// app/chat/room.tsx

import React, { useState, useRef, useEffect } from "react";

import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    ImageBackground,
} from "react-native";

import { ChatRoomHeader } from "../../components/ChatHeader";
import SearchingScreen from '../chat/searching';

import { useLocalSearchParams } from "expo-router";

import { useChat } from "../../hooks/useChat";

import { chatRoomStyles as styles } from "../../styles/screens/chatRoomStyles";

import { Input } from "../../components/Input";

export default function ChatRoom() {

    const { category } =
        useLocalSearchParams<{ category: string }>();

    const [inputText, setInputText] = useState("");

    const flatListRef = useRef<FlatList>(null);

    const {
        messages,
        isConnected,
        sendMessage,
        findNewPartner,
        partnerName,
        isMatching,
    } = useChat(category || 'Movies');

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({
                    animated: true
                });
            }, 50);
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (inputText.trim() === "") return;

        sendMessage(inputText);

        setInputText("");
    };

    return (

        isMatching ? (

            <SearchingScreen />

        ) : (

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={
                    Platform.OS === 'android' ? -85 : 0
                }
            >

                {/* BACKGROUND */}
                <Image
                    source={require('../../assets/backgrounds/default_bg.png')}
                    style={styles.background}
                    resizeMode="cover"
                />

                <ChatRoomHeader
                    partnerName={
                        isMatching
                            ? 'Procurando...'
                            : partnerName
                    }
                    onNext={findNewPartner}
                />

                {/* CHAT AREA */}
                <View style={styles.chatArea}>

                    {/* MESSAGES */}
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item, index) =>
                            item.id?.toString() || index.toString()
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.messagesContainer}
                        renderItem={({ item }) => {

                            const isOwn =
                                item.sender === 'me' ||
                                item.isOwnMessage ||
                                item.isMine;

                            return (
                                <View
                                    style={[
                                        styles.messageRow,
                                        isOwn
                                            ? styles.ownRow
                                            : styles.partnerRow
                                    ]}
                                >

                                    {!isOwn && (
                                        <Image
                                            source={require('../../assets/profile_icons/parrot.png')}
                                            style={styles.messageProfile}
                                        />
                                    )}

                                    <View
                                        style={[
                                            styles.messageBubble,
                                            isOwn
                                                ? styles.ownBubble
                                                : styles.partnerBubble
                                        ]}
                                    >
                                        <Text style={styles.messageText}>
                                            {item.text}
                                        </Text>
                                    </View>

                                    {isOwn && (
                                        <Image
                                            source={require('../../assets/profile_icons/parrot.png')}
                                            style={styles.messageProfile}
                                        />
                                    )}

                                </View>
                            );
                        }}
                    />

                    {/* INPUT AREA */}
                    <View style={styles.bottomArea}>

                        <View style={styles.inputContainer}>

                            {/* INPUT */}
                            <View style={styles.inputWrapper}>
                                <Input
                                    value={inputText}
                                    onChangeText={setInputText}
                                    placeholder="Send a message"
                                    placeholderTextColor="#B5B5B5"
                                    style={styles.input}
                                    multiline
                                    maxLength={500}
                                />
                            </View>

                            {/* EMOJI BUTTON */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.emojiButton}
                            >
                                <Image
                                    source={require('../../assets/buttons/emoji_bt.png')}
                                    style={styles.emojiIcon}
                                />
                            </TouchableOpacity>

                            {/* SEND BUTTON */}
                            <TouchableOpacity
                                onPress={handleSendMessage}
                                disabled={!isConnected}
                                activeOpacity={0.8}
                                style={styles.sendButtonWrapper}
                            >
                                <ImageBackground
                                    source={require('../../assets/buttons/send_bt.png')}
                                    style={styles.sendButton}
                                    imageStyle={styles.sendButtonImage}
                                />
                            </TouchableOpacity>

                        </View>

                    </View>

                </View>

            </KeyboardAvoidingView>

        )
    );
}