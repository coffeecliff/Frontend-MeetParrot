// ============================================================
// DTOs — contratos compartilhados entre REST e WebSocket
// ============================================================

export interface UserDTO {
    id: string;
    username: string;
    email: string;
}

export interface MatchDTO {
    roomId: string;
    category: string;
    partner: UserDTO;
}

export interface MessageDTO {
    id: string;
    roomId: string;
    senderId: string;
    message: string;
    username: string;
    timestamp: string;
}

export interface QueueStatusDTO {
    category: string;
    position: number;
    estimatedWait: string;
}

export interface RoomDTO {
    id: string;
    category: string;
    createdAt: string;
}

export interface SessionStateDTO {
    inQueue: boolean;
    category: string | null;
    currentRoom: string | null;
}

// ============================================================
// ACK padrão do Socket.IO
// ============================================================

export interface AckResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

// ============================================================
// Payloads específicos de ACK
// ============================================================

export interface AuthenticatedDTO {
    userId: string;
}

export interface RoomJoinedDTO {
    roomId: string;
}

export interface MessageDeliveredDTO {
    messageId: string;
    timestamp: string;
}

export interface QueueJoinedDTO {
    category: string;
    position: number;
}

export interface QueueLeftDTO {
    success: boolean;
}

// ============================================================
// Eventos SERVER → CLIENT
// ============================================================

export interface ServerToClientEvents {
    authenticated: (data: AuthenticatedDTO) => void;

    'match-found': (data: MatchDTO) => void;

    'room-joined': (data: RoomJoinedDTO) => void;

    'new-message': (data: MessageDTO) => void;

    'queue-status': (data: QueueStatusDTO) => void;

    'queue-joined': (data: QueueJoinedDTO) => void;

    'queue-left': (data: QueueLeftDTO) => void;

    'queue-timeout': (
        data: {
            message: string;
            category: string;
        }
    ) => void;

    'session-state': (
        data: SessionStateDTO
    ) => void;

    partner_typing: (
        data: {
            isTyping: boolean;
        }
    ) => void;

    partner_left: (
        data: {
            roomId: string;
            message: string;
        }
    ) => void;

    partner_disconnected: (
        data: {
            message: string;
        }
    ) => void;

    'matching-cancelled': (
        data: {
            success: boolean;
        }
    ) => void;

    auth_error: (
        data: {
            message: string;
        }
    ) => void;

    error: (
        data: {
            message: string;
        }
    ) => void;

    ping: () => void;
}

// ============================================================
// Eventos CLIENT → SERVER
// TODOS OS EVENTOS CRÍTICOS AGORA EXIGEM ACK
// ============================================================

export interface ClientToServerEvents {
    authenticate: (
        data: {
            token: string;
        },
        callback: (
            response: AckResponse<AuthenticatedDTO>
        ) => void
    ) => void;

    'find-match': (
        data: {
            category: string;
        },
        callback: (
            response: AckResponse<QueueJoinedDTO>
        ) => void
    ) => void;

    'cancel-matching': (
        callback: (
            response: AckResponse<QueueLeftDTO>
        ) => void
    ) => void;

    'join-room': (
        data: {
            roomId: string;
        },
        callback: (
            response: AckResponse<RoomJoinedDTO>
        ) => void
    ) => void;

    'leave-room': (
        data: {
            roomId: string;
        },
        callback: (
            response: AckResponse<{
                success: boolean;
            }>
        ) => void
    ) => void;

    'send-message': (
        data: {
            roomId: string;
            message: string;
        }
    ) => void;

    typing_start: () => void;

    typing_stop: () => void;

    'get-session-state': () => void;

    pong: () => void;
}

// ============================================================
// REST
// ============================================================

export interface AuthResponseDTO {
    token: string;
    user: UserDTO;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

