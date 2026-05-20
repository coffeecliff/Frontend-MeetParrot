import { useCallback, useEffect, useRef, useState } from 'react';

import { ChatMessage } from '../constants/types';

import {
    MessageDTO,
    MatchDTO,
    QueueStatusDTO,
} from '../constants/api_types';

import { wsService } from '../services/websocket';


type ChatMessageWithStatus =
    ChatMessage & {
        status?: 'sending' | 'sent' | 'failed'
    };

export function useChat(category: string) {
    const [messages, setMessages] = useState<
        ChatMessageWithStatus[]
    >([]);

    const [isConnected, setIsConnected] =
        useState(false);

    const [isMatching, setIsMatching] =
        useState(true);

    const [isReconnecting, setIsReconnecting] =
        useState(false);

    const [currentRoomId, setCurrentRoomId] =
        useState<string | null>(null);

    const [partnerName, setPartnerName] =
        useState<string>('Procurando...');

    const initializedRef = useRef(false);

    // ─────────────────────────────────────────────────────────────
    // Eventos
    // ─────────────────────────────────────────────────────────────

    const handleNewMessage = useCallback(
        (data: MessageDTO) => {
            const newMessage: ChatMessageWithStatus = {
                id: data.id,
                text: data.message,
                isUser: false,
                timestamp: new Date(data.timestamp),
                username:
                    data.username || 'Desconhecido',
                status: 'sent',
            };

            setMessages((prev) => [
                ...prev,
                newMessage,
            ]);
        },
        []
    );

    const handleMatchFound = useCallback(
        async (data: MatchDTO) => {
            console.log('Match found:', data);

            const partner =
                data.partner?.username ||
                'Stranger';

            setCurrentRoomId(data.roomId);

            setIsConnected(true);

            setIsReconnecting(false);

            setMessages([]);

            setPartnerName(partner);

            await wsService.saveSession(
                data.roomId,
                data.category,
                partner
            );

            const joinResponse =
                await wsService.joinRoom(
                    data.roomId
                );

            if (!joinResponse.success) {
                console.error(
                    'Failed to join room:',
                    joinResponse.error
                );

                await wsService.clearSession();

                setCurrentRoomId(null);

                setIsConnected(false);

                return;
            }

            setIsMatching(false);
        },
        []
    );

    const handleUserLeft = useCallback(
        async () => {
            console.log('Partner left');

            await wsService.clearSession();

            setIsConnected(false);

            setCurrentRoomId(null);

            setPartnerName('Procurando...');

            setMessages([]);

            setIsMatching(true);

            setTimeout(async () => {
                const response =
                    await wsService.findMatch(
                        category
                    );

                if (!response.success) {
                    console.error(
                        'Rematch failed:',
                        response.error
                    );

                    setIsMatching(false);
                }
            }, 1000);
        },
        [category]
    );

    const handleQueueStatus = useCallback(
        (data: QueueStatusDTO) => {
            console.log(
                'Queue status:',
                data
            );

            setIsMatching(true);
        },
        []
    );

    const handleQueueJoined = useCallback(
        (data: {
            category: string;
            position: number;
        }) => {
            console.log(
                'Queue joined:',
                data
            );

            setIsMatching(true);
        },
        []
    );

    const handleQueueTimeout = useCallback(
        async (data: {
            message: string;
            category: string;
        }) => {
            console.warn(
                'Queue timeout:',
                data.message
            );

            setIsMatching(true);

            setTimeout(async () => {
                const response =
                    await wsService.findMatch(
                        category
                    );

                if (!response.success) {
                    console.error(
                        'Retry queue failed:',
                        response.error
                    );

                    setIsMatching(false);
                }
            }, 2000);
        },
        [category]
    );

    const handleSessionState = useCallback(
        async (data: {
            inQueue: boolean;
            category: string | null;
            currentRoom: string | null;
        }) => {
            console.log(
                'Session state:',
                data
            );

            if (!data.currentRoom) {
                await wsService.clearSession();

                setCurrentRoomId(null);

                setIsConnected(false);

                if (!data.inQueue) {
                    setIsMatching(true);

                    const response =
                        await wsService.findMatch(
                            category
                        );

                    if (!response.success) {
                        console.error(
                            'Session recovery failed:',
                            response.error
                        );

                        setIsMatching(false);
                    }
                }
            }
        },
        [category]
    );

    const handleReconnectAttempt =
        useCallback(() => {
            setIsReconnecting(true);
        }, []);

    const handleReconnected =
        useCallback(async () => {
            setIsReconnecting(false);

            await wsService.requestSessionState();
        }, []);

    // ─────────────────────────────────────────────────────────────
    // Inicialização
    // ─────────────────────────────────────────────────────────────

    useEffect(() => {
        if (initializedRef.current) {
            return;
        }

        initializedRef.current = true;

        const initialize =
            async (): Promise<void> => {
                try {
                    if (
                        !wsService.connected
                    ) {
                        await wsService.connect();
                    }

                    wsService.onMessage(
                        handleNewMessage
                    );

                    wsService.onMatchingFound(
                        handleMatchFound
                    );

                    wsService.onUserLeft(
                        handleUserLeft
                    );

                    wsService.onPartnerDisconnected(
                        handleUserLeft
                    );

                    wsService.onQueueJoined(
                        handleQueueJoined
                    );

                    wsService.onQueueTimeout(
                        handleQueueTimeout
                    );

                    wsService.onSessionState(
                        handleSessionState
                    );

                    if (
                        !wsService.authenticated
                    ) {
                        return;
                    }

                    const session =
                        await wsService.getSession();

                    if (
                        session.roomId
                    ) {
                        console.log(
                            'Existing session restored'
                        );

                        setCurrentRoomId(
                            session.roomId
                        );

                        setPartnerName(
                            session.partner ||
                            'Stranger'
                        );

                        setIsConnected(
                            true
                        );

                        setIsMatching(
                            false
                        );

                        return;
                    }

                    const response =
                        await wsService.findMatch(
                            category
                        );

                    if (!response.success) {
                        console.error(
                            'Find match failed:',
                            response.error
                        );

                        setIsMatching(false);

                        return;
                    }

                    setIsMatching(true);
                } catch (error) {
                    console.error(
                        'WebSocket init error:',
                        error
                    );

                    setIsMatching(false);
                }
            };

        initialize();

        return () => {
            initializedRef.current =
                false;
        };
    }, [
        category,
        handleMatchFound,
        handleNewMessage,
        handleQueueJoined,
        handleQueueStatus,
        handleQueueTimeout,
        handleReconnectAttempt,
        handleReconnected,
        handleSessionState,
        handleUserLeft,
    ]);

    // ─────────────────────────────────────────────────────────────
    // Send Message
    // ─────────────────────────────────────────────────────────────

    const sendMessage = async (
        text: string
    ) => {
        if (
            !text.trim() ||
            !currentRoomId ||
            !wsService.connected
        ) {
            return;
        }

        const tempId =
            crypto.randomUUID();

        const optimisticMessage: ChatMessageWithStatus =
        {
            id: tempId,
            text: text.trim(),
            isUser: true,
            timestamp: new Date(),
            username: 'Você',
            status: 'sending',
        };

        setMessages((prev) => [
            ...prev,
            optimisticMessage,
        ]);

        const response =
            await wsService.sendMessage(
                currentRoomId,
                text.trim(),
            );

        setMessages((prev) =>
            prev.map((msg) => {
                if (msg.id !== tempId) {
                    return msg;
                }

                return {
                    ...msg,
                    status:
                        response.success
                            ? 'sent'
                            : 'failed',
                };
            })
        );

        if (!response.success) {
            console.error(
                'Message failed:',
                response.error
            );
        }
    };

    // ─────────────────────────────────────────────────────────────
    // Retry manual
    // ─────────────────────────────────────────────────────────────

    const retryMessage = async (
        messageId: string
    ) => {
        const target =
            messages.find(
                (msg) =>
                    msg.id === messageId
            );

        if (
            !target ||
            !currentRoomId
        ) {
            return;
        }

        setMessages((prev) =>
            prev.map((msg) => {
                if (
                    msg.id !== messageId
                ) {
                    return msg;
                }

                return {
                    ...msg,
                    status: 'sending',
                };
            })
        );

        const response =
            await wsService.sendMessage(
                currentRoomId,
                target.text
            );

        setMessages((prev) =>
            prev.map((msg) => {
                if (
                    msg.id !== messageId
                ) {
                    return msg;
                }

                return {
                    ...msg,
                    status:
                        response.success
                            ? 'sent'
                            : 'failed',
                };
            })
        );
    };

    // ─────────────────────────────────────────────────────────────
    // Novo parceiro
    // ─────────────────────────────────────────────────────────────

    const findNewPartner =
        async (): Promise<void> => {
            try {
                if (currentRoomId) {
                    await wsService.leaveRoom(
                        currentRoomId
                    );
                }

                await wsService.clearSession();

                setMessages([]);

                setCurrentRoomId(null);

                setPartnerName(
                    'Procurando...'
                );

                setIsConnected(false);

                setIsMatching(true);

                const response =
                    await wsService.findMatch(
                        category
                    );

                if (!response.success) {
                    console.error(
                        'Find partner failed:',
                        response.error
                    );

                    setIsMatching(false);
                }
            } catch (error) {
                console.error(
                    'Find partner error:',
                    error
                );
            }
        };

    return {
        messages,
        isConnected,
        isMatching,
        isReconnecting,
        partnerName,
        sendMessage,
        retryMessage,
        findNewPartner,
    };
}

