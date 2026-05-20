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
    // SESSION
    // ─────────────────────────────────────────────────────────────

    async saveSession(
        roomId: string,
        category: string,
        partnerUsername: string
    ): Promise<void> {
        console.log(
            '💾 Saving session:',
            {
                roomId,
                category,
                partnerUsername,
            }
        );

        await AsyncStorage.multiSet([
            [STORAGE_KEYS.ROOM_ID, roomId],
            [STORAGE_KEYS.CATEGORY, category],
            [STORAGE_KEYS.PARTNER, partnerUsername],
        ]);
    }

    async clearSession(): Promise<void> {
        console.log('🗑️ Clearing session');

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

        const session = {
            roomId: pairs[0][1],
            category: pairs[1][1],
            partner: pairs[2][1],
        };

        console.log(
            '📦 Loaded session:',
            session
        );

        return session;
    }

    // ─────────────────────────────────────────────────────────────
    // CONNECT
    // ─────────────────────────────────────────────────────────────

    async connect(): Promise<void> {
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔌 CONNECT START');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');

            if (this.socket?.connected) {
                console.log(
                    '⚠️ Socket already connected'
                );

                return;
            }

            const token =
                await AsyncStorage.getItem(
                    STORAGE_KEYS.TOKEN
                );

            console.log(
                '🔑 TOKEN EXISTS:',
                !!token
            );

            this.socket = io(
                API_CONFIG.SOCKET_URL,
                {
                    auth: {
                        token,
                    },

                    transports: [
                        'websocket',
                    ],

                    reconnection: true,

                    reconnectionAttempts: 10,

                    reconnectionDelay: 1000,

                    reconnectionDelayMax: 5000,
                }
            );

            this.setupLifecycleListeners(
                token
            );

            return new Promise(
                (
                    resolve,
                    reject
                ) => {
                    if (!this.socket) {
                        reject(
                            new Error(
                                'Socket not initialized'
                            )
                        );

                        return;
                    }

                    this.socket.once(
                        'connect',
                        async () => {
                            console.log(
                                '✅ SOCKET CONNECTED'
                            );

                            this.isConnected =
                                true;

                            if (!token) {
                                console.log(
                                    '❌ TOKEN NOT FOUND'
                                );

                                reject(
                                    new Error(
                                        'Token not found'
                                    )
                                );

                                return;
                            }

                            console.log(
                                '🔐 AUTHENTICATING SOCKET...'
                            );

                            const authResponse =
                                await this.authenticate(
                                    token
                                );

                            console.log(
                                '📥 AUTH RESPONSE:',
                                authResponse
                            );

                            if (
                                !authResponse.success
                            ) {
                                reject(
                                    new Error(
                                        authResponse.error
                                    )
                                );

                                return;
                            }

                            this.isAuthenticated =
                                true;

                            console.log(
                                '✅ SOCKET AUTHENTICATED'
                            );

                            resolve();
                        }
                    );

                    this.socket.once(
                        'connect_error',
                        (
                            error
                        ) => {
                            console.log(
                                '❌ CONNECT ERROR:',
                                error.message
                            );

                            reject(
                                error
                            );
                        }
                    );
                }
            );
        } catch (error) {
            console.error(
                '❌ connect fatal error:',
                error
            );

            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // LISTENERS
    // ─────────────────────────────────────────────────────────────

    private setupLifecycleListeners(
        initialToken: string | null
    ): void {
        const socket =
            this.socket as Socket<
                any,
                any
            > | null;

        if (!socket) {
            return;
        }

        socket.on(
            'connect',
            async () => {
                this.isConnected =
                    true;

                this.isReconnecting =
                    false;

                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );

                console.log(
                    '🔌 SOCKET CONNECTED'
                );

                console.log(
                    'socket.id:',
                    socket.id
                );

                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );

                const token =
                    (await AsyncStorage.getItem(
                        STORAGE_KEYS.TOKEN
                    )) ??
                    initialToken;

                console.log(
                    '🔑 TOKEN EXISTS:',
                    !!token
                );
            }
        );

        socket.on(
            'authenticated',
            async (
                data: {
                    userId: string;
                }
            ) => {
                this.isAuthenticated =
                    true;

                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );

                console.log(
                    '✅ SOCKET AUTHENTICATED'
                );

                console.log(
                    'userId:',
                    data.userId
                );

                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );

                const {
                    roomId,
                } =
                    await this.getSession();

                if (
                    roomId
                ) {
                    console.log(
                        '♻️ REJOIN ROOM:',
                        roomId
                    );

                    const response =
                        await this.joinRoom(
                            roomId
                        );

                    console.log(
                        '📥 REJOIN RESPONSE:',
                        response
                    );

                    if (
                        !response.success
                    ) {
                        console.warn(
                            '❌ FAILED TO REJOIN ROOM:',
                            response.error
                        );

                        await this.clearSession();
                    }
                }
            }
        );

        socket.on(
            'match-found',
            (
                data
            ) => {
                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );

                console.log(
                    '🎉 MATCH FOUND EVENT'
                );

                console.log(
                    data
                );

                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );
            }
        );

        socket.on(
            'queue-joined',
            (
                data
            ) => {
                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );

                console.log(
                    '📥 QUEUE JOINED'
                );

                console.log(
                    data
                );

                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );
            }
        );

        socket.on(
            'queue-status',
            (
                data
            ) => {
                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );

                console.log(
                    '📊 QUEUE STATUS'
                );

                console.log(
                    data
                );

                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );
            }
        );

        socket.on(
            'room-joined',
            (
                data
            ) => {
                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );

                console.log(
                    '🚪 ROOM JOINED'
                );

                console.log(
                    data
                );

                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );
            }
        );

        socket.on(
            'auth_error',
            (
                error: {
                    message?: string;
                }
            ) => {
                this.isAuthenticated =
                    false;

                console.warn(
                    '❌ AUTH ERROR:',
                    error.message
                );
            }
        );

        socket.on(
            'disconnect',
            (
                reason
            ) => {
                this.isConnected =
                    false;

                this.isAuthenticated =
                    false;

                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );

                console.log(
                    '🔌 SOCKET DISCONNECTED'
                );

                console.log(
                    'reason:',
                    reason
                );

                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );
            }
        );

        socket.on(
            'reconnect_attempt',
            (
                attempt: number
            ) => {
                this.isReconnecting =
                    true;

                console.log(
                    '♻️ RECONNECT ATTEMPT:',
                    attempt
                );
            }
        );

        socket.on(
            'reconnect',
            (
                attempt: number
            ) => {
                this.isReconnecting =
                    false;

                console.log(
                    '✅ RECONNECTED:',
                    attempt
                );
            }
        );

        socket.on(
            'connect_error',
            (
                error
            ) => {
                console.warn(
                    '❌ SOCKET CONNECTION ERROR:',
                    error.message
                );
            }
        );
    }

    // ─────────────────────────────────────────────────────────────
    // DISCONNECT
    // ─────────────────────────────────────────────────────────────

    disconnect(): void {
        console.log(
            '🔌 MANUAL DISCONNECT'
        );

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
    // ACK
    // ─────────────────────────────────────────────────────────────

    private emitWithAck<T = unknown>(
        event: string,
        payload?: unknown,
        timeout = 5000
    ): Promise<AckResponse<T>> {
        return new Promise(
            (
                resolve
            ) => {
                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );

                console.log(
                    '📤 EMIT'
                );

                console.log(
                    'event:',
                    event
                );

                console.log(
                    'payload:',
                    payload
                );

                console.log(
                    'socket connected:',
                    this.socket
                        ?.connected
                );

                console.log(
                    'authenticated:',
                    this
                        .isAuthenticated
                );

                console.log(
                    'socket id:',
                    this.socket
                        ?.id
                );

                console.log(
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                );

                if (
                    !this.socket ||
                    !this.socket
                        .connected
                ) {
                    console.log(
                        '❌ SOCKET NOT CONNECTED'
                    );

                    resolve({
                        success: false,
                        error:
                            'Socket not connected',
                    });

                    return;
                }

                let resolved =
                    false;

                const finish =
                    (
                        response: AckResponse<T>
                    ) => {
                        if (
                            resolved
                        ) {
                            return;
                        }

                        resolved =
                            true;

                        clearTimeout(
                            timer
                        );

                        console.log(
                            '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                        );

                        console.log(
                            '📥 ACK RECEIVED'
                        );

                        console.log(
                            'event:',
                            event
                        );

                        console.log(
                            'response:',
                            response
                        );

                        console.log(
                            '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                        );

                        resolve(
                            response
                        );
                    };

                const timer =
                    setTimeout(
                        () => {
                            console.log(
                                '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                            );

                            console.log(
                                '⏰ ACK TIMEOUT'
                            );

                            console.log(
                                'event:',
                                event
                            );

                            console.log(
                                'payload:',
                                payload
                            );

                            console.log(
                                'socket connected:',
                                this
                                    .socket
                                    ?.connected
                            );

                            console.log(
                                'socket id:',
                                this
                                    .socket
                                    ?.id
                            );

                            console.log(
                                '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                            );

                            finish(
                                {
                                    success: false,
                                    error:
                                        'ACK timeout',
                                }
                            );
                        },
                        timeout
                    );

                this.socket.emit(
                    event as any,
                    payload,
                    (
                        response: AckResponse<T>
                    ) => {
                        console.log(
                            '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                        );

                        console.log(
                            '📥 RAW ACK CALLBACK'
                        );

                        console.log(
                            'event:',
                            event
                        );

                        console.log(
                            'response:',
                            response
                        );

                        console.log(
                            '━━━━━━━━━━━━━━━━━━━━━━━━━━'
                        );

                        finish(
                            response
                        );
                    }
                );
            }
        );
    }

    private async emitWithRetry<
        T = unknown
    >(
        event: string,
        payload?: unknown,
        retries = 3
    ): Promise<AckResponse<T>> {
        let attempt = 0;

        while (
            attempt <
            retries
        ) {
            console.log(
                `🔁 RETRY ATTEMPT ${attempt + 1} -> ${event}`
            );

            const response =
                await this.emitWithAck<T>(
                    event,
                    payload
                );

            if (
                response.success
            ) {
                console.log(
                    `✅ ${event} SUCCESS`
                );

                return response;
            }

            attempt++;

            console.warn(
                `[Socket Retry] ${event} attempt ${attempt}`,
                response.error
            );

            await new Promise(
                (
                    resolve
                ) =>
                    setTimeout(
                        resolve,
                        1000 *
                        attempt
                    )
            );
        }

        console.log(
            `❌ ${event} MAX RETRIES EXCEEDED`
        );

        return {
            success: false,
            error:
                'Max retries exceeded',
        };
    }

    // ─────────────────────────────────────────────────────────────
    // ACTIONS
    // ─────────────────────────────────────────────────────────────

    async authenticate(
        token: string
    ) {
        return this.emitWithRetry(
            'authenticate',
            {
                token,
            }
        );
    }

    async joinRoom(
        roomId: string
    ) {
        return this.emitWithRetry(
            'join-room',
            {
                roomId,
            }
        );
    }

    async leaveRoom(
        roomId: string
    ) {
        return this.emitWithRetry(
            'leave-room',
            {
                roomId,
            }
        );
    }

    async sendMessage(
        roomId: string,
        message: string
    ) {
        return this.emitWithRetry(
            'send-message',
            {
                roomId,
                message,
            }
        );
    }

    async findMatch(
        category: string
    ) {
        console.log(
            '🔍 FIND MATCH CALLED:',
            category
        );

        return this.emitWithRetry(
            'find-match',
            {
                category,
            }
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
    // EVENTS
    // ─────────────────────────────────────────────────────────────

    onMessage(
        callback: (
            data: MessageDTO
        ) => void
    ): void {
        this.socket?.on(
            'new-message',
            callback
        );
    }

    onMatchingFound(
        callback: (
            data: MatchDTO
        ) => void
    ): void {
        this.socket?.on(
            'match-found',
            callback
        );
    }

    onUserLeft(
        callback: (
            data: {
                roomId: string;
                message: string;
            }
        ) => void
    ): void {
        this.socket?.on(
            'partner_left',
            callback
        );
    }

    onPartnerDisconnected(
        callback: (
            data: {
                message: string;
            }
        ) => void
    ): void {
        this.socket?.on(
            'partner_disconnected',
            callback
        );
    }

    onQueueJoined(
        callback: (
            data: {
                category: string;
                position: number;
            }
        ) => void
    ): void {
        this.socket?.on(
            'queue-joined',
            callback
        );
    }

    onQueueLeft(
        callback: (
            data: {
                success: boolean;
            }
        ) => void
    ): void {
        this.socket?.on(
            'queue-left',
            callback
        );
    }

    onQueueTimeout(
        callback: (
            data: {
                message: string;
                category: string;
            }
        ) => void
    ): void {
        this.socket?.on(
            'queue-timeout',
            callback
        );
    }

    onSessionState(
        callback: (
            data: {
                inQueue: boolean;
                category: string | null;
                currentRoom: string | null;
            }
        ) => void
    ): void {
        this.socket?.on(
            'session-state',
            callback
        );
    }

    removeChatListeners(): void {
        console.log(
            '🧹 Removing chat listeners'
        );

        this.socket?.off(
            'new-message'
        );

        this.socket?.off(
            'match-found'
        );

        this.socket?.off(
            'partner_left'
        );

        this.socket?.off(
            'partner_disconnected'
        );

        this.socket?.off(
            'queue-joined'
        );

        this.socket?.off(
            'queue-left'
        );

        this.socket?.off(
            'queue-timeout'
        );

        this.socket?.off(
            'session-state'
        );
    }

    // ─────────────────────────────────────────────────────────────
    // GETTERS
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