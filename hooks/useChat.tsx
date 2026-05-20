import { useCallback, useEffect, useState } from 'react';

import { ChatMessage } from '../constants/types';

import {
    MessageDTO,
    MatchDTO,
    QueueStatusDTO,
} from '../constants/api-types';

import { wsService } from '../services/websocket';

type MessageStatus =
    | 'sending'
    | 'sent'
    | 'failed';

export function useChat(category: string) {
    const [messages, setMessages] = useState<
        (ChatMessage & {
            status?: MessageStatus;
        })[]
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

    // ─────────────────────────────────────────────────────────────
    // Eventos
    // ─────────────────────────────────────────────────────────────

    const handleNewMessage = useCallback(
        (data: MessageDTO) => {
            const newMessage: ChatMessage = {
                id: data.id,
                text: data.message,
                isUser: false,
                timestamp: new Date(data.timestamp),
                userName:
                    data.username || 'Desconhecido',
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

            const response =
                await wsService.joinRoom(
                    data.roomId
                );

            if (!response.success) {
                console.error(
                    'Failed to join room:',
                    response.error
                );

                return;
            }

            setTimeout(() => {
                setIsMatching(false);
            }, 800);
        },
        []
    );

    const handleUserLeft = useCallback(() => {
        console.log('Partner left');

        wsService.clearSession();

        setIsConnected(false);
        setCurrentRoomId(null);
        setPartnerName('Procurando...');
        setIsMatching(true);

        setTimeout(async () => {
            await wsService.findMatch(category);
        }, 1000);
    }, [category]);

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

            setTimeout(async () => {
                await wsService.findMatch(
                    category
                );
            }, 2000);
        },
        [category]
    );

    const handleSessionState = useCallback(
        (data: {
            inQueue: boolean;
            category: string | null;
            currentRoom: string | null;
        }) => {
            console.log(
                'Session state:',
                data
            );

            if (!data.currentRoom) {
                wsService.clearSession();

                setCurrentRoomId(null);
                setIsConnected(false);

                if (!data.inQueue) {
                    setIsMatching(true);

                    wsService.findMatch(
                        category
                    );
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
        useCallback(() => {
            setIsReconnecting(false);

            wsService.requestSessionState();
        }, []);

    // ─────────────────────────────────────────────────────────────
    // Inicialização
    // ─────────────────────────────────────────────────────────────

    useEffect(() => {
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

                    wsService.socket?.on(
                        'queue-status',
                        handleQueueStatus
                    );

                    wsService.socket?.on(
                        'reconnect_attempt',
                        handleReconnectAttempt
                    );

                    wsService.socket?.on(
                        'reconnect',
                        handleReconnected
                    );

                    const response =
                        await wsService.findMatch(
                            category
                        );

                    if (!response.success) {
                        console.error(
                            'Failed to join queue:',
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
                }
            };

        initialize();

        return () => {
            wsService.removeAllListeners();
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
            !currentRoomId
        ) {
            return;
        }

        const tempId =
            Date.now().toString();

        const optimisticMessage: ChatMessage & {
            status?: MessageStatus;
        } = {
            id: tempId,
            text: text.trim(),
            isUser: true,
            timestamp: new Date(),
            userName: 'Você',
            status: 'sending',
        };

        setMessages((prev) => [
            ...prev,
            optimisticMessage,
        ]);

        const response =
            await wsService.sendMessage(
                currentRoomId,
                text.trim()
            );

        setMessages((prev) =>
            prev.map((msg) => {
                if (msg.id !== tempId) {
                    return msg;
                }

                return {
                    ...msg,
                    status: response.success
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

                setIsConnected(false);
                setIsMatching(true);
                setMessages([]);
                setCurrentRoomId(null);
                setPartnerName(
                    'Procurando...'
                );

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
                }
            } catch (error) {
                console.error(
                    'Find new partner error:',
                    error
                );
            }
        };

    // ─────────────────────────────────────────────────────────────
    // Cleanup
    // ─────────────────────────────────────────────────────────────

    useEffect(() => {
        return () => {
            if (currentRoomId) {
                wsService.leaveRoom(
                    currentRoomId
                );
            }
        };
    }, [currentRoomId]);

    return {
        messages,
        isConnected,
        isMatching,
        isReconnecting,
        partnerName,
        sendMessage,
        findNewPartner,
    };
}
