export const API_CONFIG = {
    BASE_URL: 'https://backend-meetparrot.onrender.com/api',
    SOCKET_URL: 'https://backend-meetparrot.onrender.com',
    TIMEOUT: 60000
}

export interface apiResponse <t = any> {
    success: boolean;
    data?: t;
    message?: string;
    error?: string;
}

export interface User {
    id: string;
    userName: string;
    email: string;
    createdAt: string
}

export interface chatRoom {
    id: string;
    category: string;
    participants: string[];
    createdAt: string;
}

export interface message {
    id: string;
    roomId: string;
    userId: string;
    username: string;
    text: string;
    timestamp: string
} 