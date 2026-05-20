// ============================================================
// DTOs — contratos compartilhados entre REST e WebSocket
// Fonte única de verdade para todas as entidades do sistema
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

// ============================================================
// Eventos Socket.IO — tipagem dos contratos de comunicação
// ============================================================

export interface SessionStateDTO {
    inQueue: boolean;
    category: string | null;
    currentRoom: string | null;
}

export interface ServerToClientEvents {
    'authenticated':        (data: { userId: string }) => void;
    'match-found':          (data: MatchDTO) => void;
    'room-joined':          (data: { roomId: string }) => void;
    'new-message':          (data: MessageDTO) => void;
    'queue-status':         (data: QueueStatusDTO) => void;
    'queue-joined':         (data: { category: string; position: number }) => void;
    'queue-left':           (data: { success: boolean }) => void;
    'queue-timeout':        (data: { message: string; category: string }) => void;
    'session-state':        (data: SessionStateDTO) => void;
    'partner_typing':       (data: { isTyping: boolean }) => void;
    'partner_left':         (data: { roomId: string; message: string }) => void;
    'partner_disconnected': (data: { message: string }) => void;
    'matching-cancelled':   (data: { success: boolean }) => void;
    'auth_error':           (data: { message: string }) => void;
    'error':                (data: { message: string }) => void;
    'ping':                 () => void;
}

export interface ClientToServerEvents {
    'authenticate':       (data: { token: string }) => void;
    'find-match':         (data: { category: string }) => void;
    'cancel-matching':    () => void;
    'join-room':          (data: { roomId: string }) => void;
    'leave-room':         (data: { roomId: string }) => void;
    'send-message':       (data: { roomId: string; message: string }) => void;
    'typing_start':       () => void;
    'typing_stop':        () => void;
    'get-session-state':  () => void;
    'pong':               () => void;
}

// ============================================================
// Respostas REST — contratos das chamadas HTTP
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