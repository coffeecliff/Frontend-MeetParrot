import { AVATARS } from '../../context/AvatarShopContext';
// app/chat/room.tsx

import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
} from "react";

import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    ImageBackground,
    StyleSheet,
} from "react-native";

import { ChatRoomHeader } from "../../components/ChatHeader";
import SearchingScreen from '../chat/searching';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useChat } from "../../hooks/useChat";
import { useAvatarShop } from "../../context/AvatarShopContext";
import { AnimalAvatar } from "../../components/AnimalAvatar";
import { Input } from "../../components/Input";
import { CATEGORIES } from "../../constants/categories";

const VALID_IDS = CATEGORIES.map(c => c.id);

export default function ChatRoom() {
    const router = useRouter();

    const { category } =
        useLocalSearchParams<{ category: string }>();

    const safeCategory = VALID_IDS.includes(category ?? '')
        ? (category as string)
        : 'movies';

    const [inputText, setInputText] = useState("");
    const flatListRef = useRef<FlatList>(null);

    const { equippedAvatar } = useAvatarShop();

    const {
        messages,
        isConnected,
        sendMessage,
        skipToNext,
        cancelMatch,
        startMatch,
        partnerName,
        partnerAvatarId,
        isMatching,
        partnerTyping,
        queuePosition,
        estimatedWait,
    } = useChat(safeCategory);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 50);
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (inputText.trim() === "") return;
        sendMessage(inputText);
        setInputText("");
    };

    /**
     * handleNext — funciona em dois cenários:
     * 1. isMatching=true: cancela o match atual e reinicia a busca
     * 2. isMatching=false (chat ativo): chama skipToNext normalmente
     */
    const handleNext = useCallback(() => {
        if (isMatching) {
            // Está na fila de busca — cancela e reinicia
            cancelMatch();
            // Pequeno delay para o servidor processar o cancelamento antes de reentrar
            setTimeout(() => {
                startMatch();
            }, 300);
        } else {
            // Está em um chat ativo — pula para o próximo
            skipToNext();
        }
    }, [isMatching, cancelMatch, startMatch, skipToNext]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === 'android' ? -85 : 0}
        >

            {/* BACKGROUND */}
            <Image
                source={require('../../assets/backgrounds/default_bg.png')}
                style={styles.background}
                resizeMode="cover"
            />

            <ChatRoomHeader
                partnerName={isMatching ? 'Searching...' : partnerName}
                onNext={handleNext}
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
                        const isOwn = item.isUser;

                        return (
                            <View
                                style={[
                                    styles.messageRow,
                                    isOwn ? styles.ownRow : styles.partnerRow
                                ]}
                            >
                                {!isOwn && (() => {
                                    const partnerAvatar = AVATARS.find(a => a.id === partnerAvatarId) ?? AVATARS[0];
                                    return (
                                        <AnimalAvatar
                                            size={42}
                                            source={partnerAvatar.image}
                                            style={styles.messageProfile}
                                        />
                                    );
                                })()}

                                <View
                                    style={[
                                        styles.messageBubble,
                                        isOwn ? styles.ownBubble : styles.partnerBubble
                                    ]}
                                >
                                    {!isOwn && item.userName && (
                                        <Text style={styles.senderName}>
                                            {item.userName}
                                        </Text>
                                    )}

                                    <Text style={styles.messageText}>
                                        {item.text}
                                    </Text>

                                    {item.timestamp && (
                                        <Text style={styles.timestamp}>
                                            {typeof item.timestamp === 'string'
                                                ? item.timestamp
                                                : new Date(item.timestamp)
                                                    .toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                        </Text>
                                    )}
                                </View>

                                {isOwn && (
                                    <AnimalAvatar
                                        size={42}
                                        source={equippedAvatar.image}
                                        style={styles.messageProfile}
                                    />
                                )}
                            </View>
                        );
                    }}
                />

                {/* PARTNER TYPING */}
                {partnerTyping && (
                    <Text style={styles.typingText}>
                        typing...
                    </Text>
                )}

                {/* INPUT AREA */}
                <View style={styles.bottomArea}>
                    <View style={styles.inputContainer}>

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

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.emojiButton}
                        >
                            <Image
                                source={require('../../assets/buttons/emoji_bt.png')}
                                style={styles.emojiIcon}
                            />
                        </TouchableOpacity>

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

            {/* ============================================================
                SEARCHING OVERLAY
                Quando isMatching=true, cobre TODA a tela (position: absolute)
                acima de todos os elementos. Passa queue/wait como props.
            ============================================================ */}
            {isMatching && (
                <View style={styles.searchingOverlay}>
                    <SearchingScreen
                        onBack={() => router.push('/chat/select')}
                        queuePosition={queuePosition}
                        estimatedWait={estimatedWait}
                    />
                </View>
            )}

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    // Overlay absoluto sobre toda a tela
    searchingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        elevation: 999,
    },

    chatArea: {
        flex: 1,
    },

    messagesContainer: {
        paddingVertical: 12,
        paddingHorizontal: 8,
    },

    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 4,
        paddingHorizontal: 8,
    },

    ownRow: {
        justifyContent: 'flex-end',
    },

    partnerRow: {
        justifyContent: 'flex-start',
    },

    messageProfile: {
        marginHorizontal: 6,
    },

    messageBubble: {
        maxWidth: '70%',
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },

    ownBubble: {
        backgroundColor: '#73D85B',
        borderBottomRightRadius: 4,
    },

    partnerBubble: {
        backgroundColor: '#7C8CF8',
        borderBottomLeftRadius: 4,
    },

    senderName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
        opacity: 0.85,
    },

    messageText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '500',
    },

    timestamp: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 5,
        alignSelf: 'flex-end',
    },

    typingText: {
        marginLeft: 20,
        marginBottom: 10,
        color: '#7A7DF0',
        fontWeight: '700',
    },

    bottomArea: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 6,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    inputWrapper: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        borderRadius: 20,
        paddingHorizontal: 14,
        minHeight: 44,
        justifyContent: 'center',
    },

    input: {
        fontSize: 15,
        color: '#333',
    },

    emojiButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emojiIcon: {
        width: 36,
        height: 36,
    },

    sendButtonWrapper: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    sendButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    sendButtonImage: {
        borderRadius: 999,
    },
});
