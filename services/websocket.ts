import asyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from './config';
import {
    ServerToClientEvents,
    ClientToServerEvents,
    MessageDTO,
    MatchDTO,
} from '../constants/api-types';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// Chaves de persistência no AsyncStorage
const STORAGE_KEYS = {
    TOKEN:    'authToken',
    ROOM_ID:  'session:roomId',
    CATEGORY: 'session:category',
    PARTNER:  'session:partner',
} as const;

class WebSocketService {
    public socket: AppSocket | null = null;
    private isConnected = false;
    private isAuthenticated = false;
    private isReconnecting = false;

    // ─── Persistência de sessão ───────────────────────────────────────────────

    async saveSession(roomId: string, category: string, partnerUsername: string): Promise<void> {
        await asyncStorage.multiSet([
            [STORAGE_KEYS.ROOM_ID,  roomId],
            [STORAGE_KEYS.CATEGORY, category],
            [STORAGE_KEYS.PARTNER,  partnerUsername],
        ]);
    }

    async clearSession(): Promise<void> {
        await asyncStorage.multiRemove([
            STORAGE_KEYS.ROOM_ID,
            STORAGE_KEYS.CATEGORY,
            STORAGE_KEYS.PARTNER,
        ]);
    }

    async getSession(): Promise<{ roomId: string | null; category: string | null; partner: string | null }> {
        const pairs = await asyncStorage.multiGet([
            STORAGE_KEYS.ROOM_ID,
            STORAGE_KEYS.CATEGORY,
            STORAGE_KEYS.PARTNER,
        ]);
        return {
            roomId:   pairs[0][1],
            category: pairs[1][1],
            partner:  pairs[2][1],
        };
    }

    // ─── Conexão principal ────────────────────────────────────────────────────

    async connect(): Promise<void> {
        const token = await asyncStorage.getItem(STORAGE_KEYS.TOKEN);

        this.socket = io(API_CONFIG.SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        this.setupLifecycleListeners(token);

        return new Promise((resolve, reject) => {
            this.socket!.once('connect', () => resolve());
            this.socket!.once('auth_error', (err) => reject(new Error(err.message)));
            this.socket!.once('connect_error', (err) => reject(err));
        });
    }

    // ─── Listeners de lifecycle (reconnect incluído) ──────────────────────────

    private setupLifecycleListeners(initialToken: string | null): void {
        const socket = this.socket!;

        socket.on('connect', async () => {
            this.isConnected = true;
            this.isReconnecting = false;
            console.log('WebSocket connected:', socket.id);

            const token = await asyncStorage.getItem(STORAGE_KEYS.TOKEN) ?? initialToken;
            if (token) {
                socket.emit('authenticate', { token });
            }
        });

        socket.on('authenticated', async (data) => {
            this.isAuthenticated = true;
            console.log('Authenticated, userId:', data.userId);

            // Rejoin automático da sala após reconnect
            const { roomId } = await this.getSession();
            if (roomId) {
                console.log('Rejoining room after reconnect:', roomId);
                socket.emit('join-room', { roomId });
            }
        });

        socket.on('auth_error', (error) => {
            this.isAuthenticated = false;
            console.warn('Auth error:', error.message);
        });

        socket.on('disconnect', (reason) => {
            this.isConnected = false;
            this.isAuthenticated = false;
            console.log('WebSocket disconnected, reason:', reason);
        });

        socket.on('reconnect', (attempt) => {
            console.log('Reconnected after', attempt, 'attempt(s)');
            this.isReconnecting = false;
        });

        socket.on('reconnect_attempt', (attempt) => {
            this.isReconnecting = true;
            console.log('Reconnect attempt:', attempt);
        });

        socket.on('connect_error', (error) => {
            console.warn('Connection error:', error.message);
        });

        // Responde ao heartbeat do servidor
        socket.on('ping', () => {
            socket.emit('pong');
        });
    }

    // ─── Desconexão ───────────────────────────────────────────────────────────

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.isAuthenticated = false;
        }
    }

    // Alias mantido para compatibilidade com useAuth.tsx
    disconnected(): void {
        this.disconnect();
    }

    // ─── Ações ────────────────────────────────────────────────────────────────

    joinRoom(roomId: string): void {
        this.socket?.emit('join-room', { roomId });
    }

    leaveRoom(roomId: string): void {
        this.socket?.emit('leave-room', { roomId });
    }

    sendMessage(roomId: string, message: string): void {
        this.socket?.emit('send-message', { roomId, message });
    }

    findMatch(category: string): void {
        this.socket?.emit('find-match', { category });
    }

    cancelMatch(): void {
        this.socket?.emit('cancel-matching');
    }

    // ─── Listeners de eventos ─────────────────────────────────────────────────

    onMessage(callback: (data: MessageDTO) => void): void {
        this.socket?.on('new-message', callback);
    }

    onMatchingFound(callback: (data: MatchDTO) => void): void {
        this.socket?.on('match-found', callback);
    }

    onUserLeft(callback: (data: { roomId: string; message: string }) => void): void {
        this.socket?.on('partner_left', callback);
    }

    onPartnerDisconnected(callback: (data: { message: string }) => void): void {
        this.socket?.on('partner_disconnected', callback);
    }

    onQueueJoined(callback: (data: { category: string; position: number }) => void): void {
        this.socket?.on('queue-joined', callback);
    }

    onQueueLeft(callback: (data: { success: boolean }) => void): void {
        this.socket?.on('queue-left', callback);
    }

    onQueueTimeout(callback: (data: { message: string; category: string }) => void): void {
        this.socket?.on('queue-timeout', callback);
    }

    onSessionState(callback: (data: { inQueue: boolean; category: string | null; currentRoom: string | null }) => void): void {
        this.socket?.on('session-state', callback);
    }

    requestSessionState(): void {
        this.socket?.emit('get-session-state');
    }

    removeAllListeners(): void {
        this.socket?.removeAllListeners();
    }

    // ─── Getters de estado ────────────────────────────────────────────────────

    get connected(): boolean        { return this.isConnected; }
    get authenticated(): boolean    { return this.isAuthenticated; }
    get reconnecting(): boolean     { return this.isReconnecting; }
}

export const wsService = new WebSocketService();