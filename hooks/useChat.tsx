import { useCallback, useEffect, useState } from 'react';
import { ChatMessage } from '../constants/types';
import { MessageDTO, MatchDTO, QueueStatusDTO } from '../constants/api-types';
import { wsService } from '../services/websocket';

export function useChat(category: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isMatching, setIsMatching] = useState(true);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
    const [partnerName, setPartnerName] = useState<string>('Procurando...');

    const handleNewMessage = useCallback((data: MessageDTO) => {
        const newMessage: ChatMessage = {
            id: data.id,
            text: data.message,
            isUser: false,
            timestamp: new Date(data.timestamp),
            userName: data.username || 'Desconhecido',
        };
        setMessages(prev => [...prev, newMessage]);
    }, []);

    const handleMatchFound = useCallback((data: MatchDTO) => {
        console.log('Match found:', data);

        const partner = data.partner?.username || 'Stranger';

        setCurrentRoomId(data.roomId);
        setIsConnected(true);
        setIsReconnecting(false);
        setMessages([]);
        setPartnerName(partner);

        // Persiste a sessão para sobreviver a reconnects
        wsService.saveSession(data.roomId, data.category, partner);

        setTimeout(() => {
            setIsMatching(false);
        }, 800);

        wsService.joinRoom(data.roomId);
    }, []);

    const handleUserLeft = useCallback(() => {
        console.log('Partner left the chat');

        // Limpa sessão persistida pois a sala encerrou
        wsService.clearSession();

        setIsConnected(false);
        setCurrentRoomId(null);
        setPartnerName('Procurando...');
        setIsMatching(true);

        setTimeout(() => {
            wsService.findMatch(category);
        }, 1000);
    }, [category]);

    const handleQueueStatus = useCallback((data: QueueStatusDTO) => {
        console.log('Queue status:', data);
        setIsMatching(true);
    }, []);

    const handleQueueJoined = useCallback((data: { category: string; position: number }) => {
        console.log('Queue joined confirmed:', data);
        setIsMatching(true);
    }, []);

    const handleQueueTimeout = useCallback((data: { message: string; category: string }) => {
        console.warn('Queue timeout:', data.message);
        // Tenta novamente automaticamente após timeout
        setIsMatching(true);
        setTimeout(() => {
            wsService.findMatch(category);
        }, 2000);
    }, [category]);

    const handleSessionState = useCallback((data: { inQueue: boolean; category: string | null; currentRoom: string | null }) => {
        console.log('Session state from server:', data);
        // Se o servidor diz que não há sala ativa, limpa o estado local
        if (!data.currentRoom) {
            wsService.clearSession();
            setCurrentRoomId(null);
            setIsConnected(false);
            if (!data.inQueue) {
                setIsMatching(true);
                wsService.findMatch(category);
            }
        }
    }, [category]);

    // Listener de reconnect para atualizar estado visual
    const handleReconnectAttempt = useCallback(() => {
        setIsReconnecting(true);
    }, []);

    const handleReconnected = useCallback(() => {
        setIsReconnecting(false);
        // Solicita estado real ao servidor após reconexão para sincronizar
        wsService.requestSessionState();
    }, []);

    useEffect(() => {
        const initializeWebSocket = async () => {
            try {
                if (!wsService.connected) {
                    await wsService.connect();
                }

                wsService.onMessage(handleNewMessage);
                wsService.onMatchingFound(handleMatchFound);
                wsService.onUserLeft(handleUserLeft);
                wsService.onPartnerDisconnected(handleUserLeft);
                wsService.onQueueJoined(handleQueueJoined);
                wsService.onQueueTimeout(handleQueueTimeout);
                wsService.onSessionState(handleSessionState);

                wsService.socket?.on('queue-status', handleQueueStatus);
                wsService.socket?.on('reconnect_attempt', handleReconnectAttempt);
                wsService.socket?.on('reconnect', handleReconnected);

                console.log('Starting match search for category:', category);
                wsService.findMatch(category);
                setIsMatching(true);
            } catch (error) {
                console.error('WebSocket connection error:', error);
            }
        };

        initializeWebSocket();

        return () => {
            wsService.removeAllListeners();
        };
    }, [category, handleNewMessage, handleMatchFound, handleUserLeft, handleQueueStatus, handleQueueJoined, handleQueueTimeout, handleSessionState, handleReconnectAttempt, handleReconnected]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || !currentRoomId) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            text: text.trim(),
            isUser: true,
            timestamp: new Date(),
            userName: 'Você',
        };

        setMessages(prev => [...prev, newMessage]);

        try {
            wsService.sendMessage(currentRoomId, text.trim());
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const findNewPartner = () => {
        if (currentRoomId) {
            wsService.leaveRoom(currentRoomId);
        }

        wsService.clearSession();

        setIsConnected(false);
        setIsMatching(true);
        setMessages([]);
        setCurrentRoomId(null);
        setPartnerName('Procurando...');

        try {
            wsService.findMatch(category);
        } catch (error) {
            console.error('Error finding match:', error);
            setIsMatching(false);
        }
    };

    useEffect(() => {
        return () => {
            if (currentRoomId) {
                wsService.leaveRoom(currentRoomId);
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