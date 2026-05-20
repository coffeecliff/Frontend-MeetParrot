export interface User {
    id: string;
    username: string;
    email: string;
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