import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from './config';
import { User } from '../constants/types';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
  }

  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAuthToken();
    const hasBody = typeof options.body !== 'undefined';
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    };
    const config: RequestInit = { ...options, headers: { ...headers } };
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${this.baseUrl}${path}`, config);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || error.error || 'Request failed');
    }
    return response.json() as Promise<T>;
  }

  async login(email: string, password: string) {
    const response = await this.request<{ success: boolean; data: { token: string; user: User } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.data?.token) await AsyncStorage.setItem('authToken', response.data.token);
    return response.data;
  }

  async register(username: string, email: string, password: string) {
    const response = await this.request<{ success: boolean; data: { token: string; user: User } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    if (response.data?.token) await AsyncStorage.setItem('authToken', response.data.token);
    return response.data;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' }).catch(() => undefined);
    await AsyncStorage.removeItem('authToken');
  }

  async getProfile() {
    const response = await this.request<{ success: boolean; data: { user: User } }>('/auth/profile');
    return response.data;
  }

  async getRooms() {
    const response = await this.request<{ success: boolean; data: { rooms: any[] } }>('/chat/rooms');
    return response.data.rooms;
  }

  async getRoomMessages(roomId: string) {
    const response = await this.request<{ success: boolean; data: { messages: any[] } }>(`/chat/rooms/${roomId}/messages`);
    return response.data;
  }

  async sendMessage(roomId: string, text: string) {
    const response = await this.request(`/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response;
  }

  // Matching é feito via WebSocket (find-match event), não via REST.
  // Este método existe apenas para compatibilidade e confirma que a categoria é válida.
  async joinMatchQueue(category: string) {
    const response = await this.request<{ success: boolean; data: { category: string } }>('/matching/join', {
      method: 'POST',
      body: JSON.stringify({ category }),
    });
    return response.data;
  }
}

export const apiService = new ApiService();
