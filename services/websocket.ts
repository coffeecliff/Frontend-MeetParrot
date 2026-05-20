import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';

import { API_CONFIG } from './config';

import {
    ServerToClientEvents,
    ClientToServerEvents,
    MessageDTO,
    MatchDTO,
} from '../constants/api_types';

type AppSocket = Socket<
    ServerToClientEvents,
    ClientToServerEvents
>;

export type AckResponse<T = unknown> = {
    success: boolean;
    error?: string;
    data?: T;
};

const STORAGE_KEYS = {
    TOKEN: 'authToken',
    ROOM_ID: 'session:roomId',
    CATEGORY: 'session:category',
    PARTNER: 'session:partner',
} as const;

class WebSocketService {
    public socket: AppSocket | null = null;

    private isConnected = false;
    private isAuthenticated = false;
    private isReconnecting = false;

    // ─────────────────────────────────────────────────────────────
    // Persistência de sessão
    // ─────────────────────────────────────────────────────────────

    async saveSession(
        roomId: string,
        category: string,
        partnerUsername: string
    ): Promise<void> {
        await AsyncStorage.multiSet([
            [STORAGE_KEYS.ROOM_ID, roomId],
            [STORAGE_KEYS.CATEGORY, category],
            [STORAGE_KEYS.PARTNER, partnerUsername],
        ]);
    }

    async clearSession(): Promise<void> {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.ROOM_ID,
            STORAGE_KEYS.CATEGORY,
            STORAGE_KEYS.PARTNER,
        ]);
    }

    async getSession(): Promise<{
        roomId: string | null;
        category: string | null;
        partner: string | null;
    }> {
        const pairs = await AsyncStorage.multiGet([
            STORAGE_KEYS.ROOM_ID,
            STORAGE_KEYS.CATEGORY,
            STORAGE_KEYS.PARTNER,
        ]);

        return {
            roomId: pairs[0][1],
            category: pairs[1][1],
            partner: pairs[2][1],
        };
    }

    // ─────────────────────────────────────────────────────────────
    // Conexão
    // ─────────────────────────────────────────────────────────────


    async connect(): Promise<void> {
        if (this.socket?.connected) {
            return;
        }

        const token = await AsyncStorage.getItem(
            STORAGE_KEYS.TOKEN
        );

        this.socket = io(API_CONFIG.SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        this.setupLifecycleListeners(token);

        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject(
                    new Error('Socket not initialized')
                );

                return;
            }

            this.socket.once('connect', async () => {
                console.log(
                    '✅ Socket connected'
                );

                this.isConnected = true;

                if (!token) {
                    reject(
                        new Error('Token not found')
                    );

                    return;
                }

                const authResponse =
                    await this.authenticate(
                        token
                    );

                if (!authResponse.success) {
                    reject(
                        new Error(
                            authResponse.error
                        )
                    );

                    return;
                }

                this.isAuthenticated = true;

                resolve();
            });

            this.socket.once(
                'connect_error',
                (error) => {
                    reject(error);
                }
            );
        });
    }



    private setupLifecycleListeners(
        initialToken: string | null
    ): void {
        const socket = this.socket as Socket<any, any> | null;

        if (!socket) return;

        socket.on('connect', async () => {
            this.isConnected = true;
            this.isReconnecting = false;

            console.log(
                'WebSocket connected:',
                socket.id
            );

            const token =
                (await AsyncStorage.getItem(
                    STORAGE_KEYS.TOKEN
                )) ?? initialToken;


        });

        socket.on(
            'authenticated',
            async (data: { userId: string }) => {
                this.isAuthenticated = true;

                console.log(
                    'Socket authenticated:',
                    data.userId
                );

                const { roomId } =
                    await this.getSession();

                if (roomId) {
                    console.log(
                        'Rejoining room:',
                        roomId
                    );

                    const response =
                        await this.joinRoom(roomId);

                    if (!response.success) {
                        console.warn(
                            'Failed to rejoin room:',
                            response.error
                        );

                        await this.clearSession();
                    }
                }
            }
        );

        socket.on('auth_error', (error: { message?: string }) => {
            this.isAuthenticated = false;

            console.warn(
                'Socket auth error:',
                error.message
            );
        });

        socket.on('disconnect', (reason) => {
            this.isConnected = false;
            this.isAuthenticated = false;

            console.log(
                'Socket disconnected:',
                reason
            );
        });

        socket.on(
            'reconnect_attempt',
            (attempt: number) => {
                this.isReconnecting = true;

                console.log(
                    'Reconnect attempt:',
                    attempt
                );
            }
        );

        socket.on('reconnect', (attempt: number) => {
            this.isReconnecting = false;

            console.log(
                'Reconnected after attempts:',
                attempt
            );
        });

        socket.on('connect_error', (error) => {
            console.warn(
                'Socket connection error:',
                error.message
            );
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Desconexão
    // ─────────────────────────────────────────────────────────────

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }

        this.isConnected = false;
        this.isAuthenticated = false;
        this.isReconnecting = false;
    }

    disconnected(): void {
        this.disconnect();
    }

    // ─────────────────────────────────────────────────────────────
    // ACK Core
    // ─────────────────────────────────────────────────────────────

    private emitWithAck<T = unknown>(
        event: string,
        payload?: unknown,
        timeout = 5000
    ): Promise<AckResponse<T>> {
        return new Promise((resolve) => {
            if (!this.socket || !this.socket.connected) {
                resolve({
                    success: false,
                    error: 'Socket not connected',
                });

                return;
            }

            let resolved = false;

            const finish = (
                response: AckResponse<T>
            ) => {
                if (resolved) return;

                resolved = true;

                clearTimeout(timer);

                resolve(response);
            };

            const timer = setTimeout(() => {
                finish({
                    success: false,
                    error: 'ACK timeout',
                });
            }, timeout);

            this.socket.emit(
                event as any,
                payload,
                (response: AckResponse<T>) => {
                    finish(response);
                }
            );
        });
    }

    private async emitWithRetry<T = unknown>(
        event: string,
        payload?: unknown,
        retries = 3
    ): Promise<AckResponse<T>> {
        let attempt = 0;

        while (attempt < retries) {
            const response =
                await this.emitWithAck<T>(
                    event,
                    payload
                );

            if (response.success) {
                return response;
            }

            attempt++;

            console.warn(
                `[Socket Retry] ${event} attempt ${attempt}`,
                response.error
            );

            await new Promise((resolve) =>
                setTimeout(
                    resolve,
                    1000 * attempt
                )
            );
        }

        return {
            success: false,
            error: 'Max retries exceeded',
        };
    }

    // ─────────────────────────────────────────────────────────────
    // Eventos críticos com ACK
    // ─────────────────────────────────────────────────────────────

    async authenticate(token: string) {
        return this.emitWithRetry(
            'authenticate',
            { token }
        );
    }

    async joinRoom(roomId: string) {
        return this.emitWithRetry(
            'join-room',
            { roomId }
        );
    }

    async leaveRoom(roomId: string) {
        return this.emitWithRetry(
            'leave-room',
            { roomId }
        );
    }

    async sendMessage(
        roomId: string,
        message: string,
    ) {
        return this.emitWithRetry(
            'send-message',
            {
                roomId,
                message,
            }
        );
    }

    async findMatch(category: string) {
        return this.emitWithRetry(
            'find-match',
            { category }
        );
    }

    async cancelMatch() {
        return this.emitWithRetry(
            'cancel-matching'
        );
    }

    async requestSessionState() {
        return this.emitWithRetry(
            'get-session-state'
        );
    }

    // ─────────────────────────────────────────────────────────────
    // Eventos
    // ─────────────────────────────────────────────────────────────

    onMessage(
        callback: (data: MessageDTO) => void
    ): void {
        this.socket?.on(
            'new-message',
            callback
        );
    }

    onMatchingFound(
        callback: (data: MatchDTO) => void
    ): void {
        this.socket?.on(
            'match-found',
            callback
        );
    }

    onUserLeft(
        callback: (data: {
            roomId: string;
            message: string;
        }) => void
    ): void {
        this.socket?.on(
            'partner_left',
            callback
        );
    }

    onPartnerDisconnected(
        callback: (data: {
            message: string;
        }) => void
    ): void {
        this.socket?.on(
            'partner_disconnected',
            callback
        );
    }

    onQueueJoined(
        callback: (data: {
            category: string;
            position: number;
        }) => void
    ): void {
        this.socket?.on(
            'queue-joined',
            callback
        );
    }

    onQueueLeft(
        callback: (data: {
            success: boolean;
        }) => void
    ): void {
        this.socket?.on(
            'queue-left',
            callback
        );
    }

    onQueueTimeout(
        callback: (data: {
            message: string;
            category: string;
        }) => void
    ): void {
        this.socket?.on(
            'queue-timeout',
            callback
        );
    }

    onSessionState(
        callback: (data: {
            inQueue: boolean;
            category: string | null;
            currentRoom: string | null;
        }) => void
    ): void {
        this.socket?.on(
            'session-state',
            callback
        );
    }


    removeChatListeners(): void {
        this.socket?.off('new-message');

        this.socket?.off('match-found');

        this.socket?.off('partner_left');

        this.socket?.off(
            'partner_disconnected'
        );

        this.socket?.off('queue-joined');

        this.socket?.off('queue-left');

        this.socket?.off('queue-timeout');

        this.socket?.off('session-state');
    }



    // ─────────────────────────────────────────────────────────────
    // Getters
    // ─────────────────────────────────────────────────────────────

    get connected(): boolean {
        return this.isConnected;
    }

    get authenticated(): boolean {
        return this.isAuthenticated;
    }

    get reconnecting(): boolean {
        return this.isReconnecting;
    }
}

export const wsService =
    new WebSocketService();