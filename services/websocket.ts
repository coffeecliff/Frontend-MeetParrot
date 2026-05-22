import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from './config';
import { logger } from './logger';

class WebSocketService {
  public socket: Socket | null = null;
  private isConnected = false;
  private isAuthenticated = false;
  private isConnecting = false;

  get connected(): boolean { return this.isConnected; }
  get authenticated(): boolean { return this.isAuthenticated; }
  get socketId(): string | undefined { return this.socket?.id; }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async connect(): Promise<void> {
    if (this.socket?.connected && this.isAuthenticated) {
      logger.ws.log('Already connected');
      return;
    }

    if (this.isConnecting) {
      logger.ws.log('Connection already in progress');
      return this.waitForConnection();
    }

    this.isConnecting = true;

    try {
      if (this.socket) {
        logger.ws.log('Cleaning old socket');
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
      }

      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No auth token found');

      logger.ws.log('Creating socket connection');

      this.socket = io(API_CONFIG.SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('reconnect', () => {
        logger.ws.log('Reconnected');
        this.isConnected = true;
        this.isAuthenticated = false;
        this.socket?.emit('authenticate', { token });
      });

      this.socket.on('disconnect', (reason) => {
        logger.ws.log('Disconnected:', reason);
        this.isConnected = false;
        this.isAuthenticated = false;
      });

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          logger.ws.error('Connection timeout');
          this.isConnected = false;
          this.isAuthenticated = false;
          reject(new Error('Connection timeout'));
        }, 8000);

        this.socket!.once('connect', () => {
          logger.ws.log('Connected');
          this.isConnected = true;
          this.socket!.emit('authenticate', { token });
        });

        this.socket!.once('authenticated', (data: { userId: string }) => {
          clearTimeout(timeout);
          logger.ws.log('Authenticated:', data.userId);
          this.isConnected = true;
          this.isAuthenticated = true;
          resolve();
        });

        this.socket!.once('auth-error', (error: any) => {
          clearTimeout(timeout);
          logger.ws.error('Auth error:', error);
          this.isConnected = false;
          this.isAuthenticated = false;
          reject(new Error(error?.error || 'Authentication failed'));
        });

        this.socket!.once('connect_error', (error: Error) => {
          clearTimeout(timeout);
          logger.ws.error('Connect error:', error);
          this.isConnected = false;
          this.isAuthenticated = false;
          reject(error);
        });
      });
    } finally {
      this.isConnecting = false;
    }
  }

  async waitForConnection(timeout = 8000): Promise<void> {
    if (this.isConnected && this.isAuthenticated) {
      logger.ws.log('Already connected/authenticated');
      return;
    }

    return new Promise((resolve, reject) => {
      const deadline = Date.now() + timeout;
      const check = () => {
        if (this.isConnected && this.isAuthenticated) {
          logger.ws.log('waitForConnection resolved');
          resolve();
          return;
        }
        if (Date.now() > deadline) {
          logger.ws.error('waitForConnection timeout');
          reject(new Error('WebSocket timeout'));
          return;
        }
        setTimeout(check, 100);
      };
      check();
    });
  }

  disconnect(): void {
    logger.ws.log('Disconnecting...');
    if (this.socket) {
      this.removeAppListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.isAuthenticated = false;
    this.isConnecting = false;
  }

  removeAppListeners(): void {
    this.offAll();
  }

  async ensureConnected(): Promise<void> {
    if (this.isConnected && this.isAuthenticated) return;
    await this.connect();
  }

  async reconnect(): Promise<void> {
    this.disconnect();
    await this.wait(300);
    await this.connect();
  }

  offAll(): void {
    const events = ['new-message', 'queue-status', 'match-found', 'matching-cancelled', 'partner-typing', 'partner-left', 'partner-disconnected', 'room-joined', 'error'];
    events.forEach((event) => this.socket?.removeAllListeners(event));
  }

  findMatch(category: string, avatarId?: string): void {
    logger.ws.log('Finding match:', category, 'avatarId:', avatarId);
    this.socket?.emit('find-match', { category, avatarId });
  }

  cancelMatch(): void {
    logger.ws.log('Cancel matching');
    this.socket?.emit('cancel-matching');
  }

  async prepareForMatch(delay = 450): Promise<void> {
    await this.wait(delay);
  }

  joinRoom(roomId: string): void {
    logger.ws.log('Joining room:', roomId);
    this.socket?.emit('join-room', { roomId });
  }

  leaveRoom(roomId: string): void {
    logger.ws.log('Leaving room:', roomId);
    this.socket?.emit('leave-room', { roomId });
  }

  sendMessage(roomId: string, text: string): void {
    logger.ws.log('Sending message:', text);
    this.socket?.emit('send-message', { roomId, text });
  }

  typingStart(): void { this.socket?.emit('typing-start'); }
  typingStop(): void { this.socket?.emit('typing-stop'); }

  private on(event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback);
  }

  onMessage(callback: (message: any) => void): void { this.on('new-message', callback); }
  onQueueStatus(callback: (data: any) => void): void { this.on('queue-status', callback); }
  onMatchingFound(callback: (room: any) => void): void { this.on('match-found', callback); }
  onMatchingCancelled(callback: (data: any) => void): void { this.on('matching-cancelled', callback); }
  onPartnerTyping(callback: (data: any) => void): void { this.on('partner-typing', callback); }
  onPartnerLeft(callback: (data: any) => void): void { this.on('partner-left', callback); }
  onPartnerDisconnected(callback: (data: any) => void): void { this.on('partner-disconnected', callback); }
  onError(callback: (error: any) => void): void { this.on('error', callback); }
}

export const wsService = new WebSocketService();
