import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { User } from '../constants/types';
import { apiService } from '../services/api';
import { wsService } from '../services/websocket';
import { logger } from '../services/logger';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<true | string>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    logger.auth.log('Checking auth status');
    setIsLoading(true);
    try {
      const response = await apiService.getProfile();
      logger.auth.log('User authenticated:', response.user);
      setUser(response.user);
      try {
        await wsService.connect();
      } catch (wsError) {
        logger.auth.error('WebSocket connection failed:', wsError);
      }
    } catch (error) {
      logger.auth.error('Auth check failed:', error);
      setUser(null);
      wsService.disconnect();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (email: string, password: string): Promise<true | string> => {
    logger.auth.log('Login started');
    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);
      logger.auth.log('Login success:', response.user);
      setUser(response.user);
      try {
        await wsService.connect();
      } catch (wsError) {
        logger.auth.error('WebSocket connection failed after login:', wsError);
      }
      return true;
    } catch (error) {
      logger.auth.error('Login error:', error);
      return error instanceof Error ? error.message : 'Erro desconhecido';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string): Promise<boolean> => {
    logger.auth.log('Register started');
    setIsLoading(true);
    try {
      const response = await apiService.register(username, email, password);
      logger.auth.log('Register success:', response.user);
      setUser(response.user);
      try {
        await wsService.connect();
      } catch (wsError) {
        logger.auth.error('WebSocket connection failed after register:', wsError);
      }
      return true;
    } catch (error) {
      logger.auth.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    logger.auth.log('Logout started');
    setIsLoading(true);
    try {
      await apiService.logout();
    } catch (error) {
      logger.auth.error('Logout API error:', error);
    } finally {
      setUser(null);
      wsService.disconnect();
      setIsLoading(false);
      logger.auth.log('Logout complete');
    }
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated: !!user, isLoading, login, register, logout }), [user, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
