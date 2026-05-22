export interface User {
    id: string;
    username: string;  // Backend retorna 'username', não 'name'
    email: string;
    createdAt?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface ChatRoom {
    id: string;
    name: string;
    participants: User[];
    createdAt: string;
}

export interface Message {
    id: string;
    roomId: string;
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
}

export interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    userName: string;
}

export interface ChatCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
}
