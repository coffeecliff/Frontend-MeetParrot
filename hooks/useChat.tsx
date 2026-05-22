import { useAvatarShop } from './useAvatarShop';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChatMessage } from '../constants/types';
import { wsService } from '../services/websocket';
import { logger } from '../services/logger';
import { useAuth } from './useAuth';

export function useChat(category: string) {
  const { user } = useAuth();
  const { equippedId } = useAvatarShop();

  // Ref para sempre ler o equippedId atual dentro de callbacks sem stale closure
  // e sem tornar startMatch instável com equippedId nas deps.
  const equippedIdRef = useRef(equippedId);
  useEffect(() => {
    equippedIdRef.current = equippedId;
  }, [equippedId]);

  const [partnerAvatarId, setPartnerAvatarId] = useState<string>('1');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState('procurando...');
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [estimatedWait, setEstimatedWait] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [listenerVersion, setListenerVersion] = useState(0);
  const matchStarted = useRef(false);
  const currentRoomRef = useRef<string | null>(null);
  const staleRecoveryRef = useRef(false);
  const isLeavingRef = useRef(false);

  const handleNewMessage = useCallback((data: any) => {
    logger.chat.log('New message:', data);
    const isOwnMessage =
      (data.socketId && data.socketId === wsService.socketId) ||
      (typeof data.senderId !== 'undefined' && String(data.senderId) === String(user?.id));

    if (isOwnMessage) return;

    const newMessage: ChatMessage = {
      id: data.id || `${Date.now()}`,
      text: data.text,
      isUser: false,
      timestamp: new Date(data.timestamp),
      userName: data.username || 'desconhecido',
    };
    setMessages((prev) => {
      if (data.id && prev.some((message) => message.id === data.id)) return prev;
      return [...prev, newMessage];
    });
  }, [user?.id]);

  const handleMatchFound = useCallback((data: any) => {
    logger.chat.log('Match found:', data);
    currentRoomRef.current = data.roomId;
    setCurrentRoomId(data.roomId);
    setIsConnected(true);
    setIsMatching(false);
    setMessages([]);
    setPartnerName(data.partner?.username || 'usuário');
    setPartnerAvatarId(String(data.partner?.avatarId || '1'));
    setQueuePosition(null);
    setEstimatedWait('');
    matchStarted.current = false;
  }, []);

  const handleQueueStatus = useCallback((data: any) => {
    logger.chat.log('Queue status:', data);
    setQueuePosition(data.position || 1);
    setEstimatedWait(data.estimatedWait || '...');
  }, []);

  const handleMatchingCancelled = useCallback(() => {
    logger.chat.log('Matching cancelled');
    setIsMatching(false);
    setQueuePosition(null);
    setEstimatedWait('');
    matchStarted.current = false;
  }, []);

  const handlePartnerTyping = useCallback((data: any) => {
    logger.chat.log('Partner typing:', data);
    setPartnerTyping(data.isTyping || false);
  }, []);

  const handlePartnerDisconnect = useCallback((data: any) => {
    logger.chat.log('Partner disconnected/left:', data);
    if (isLeavingRef.current) return;
    currentRoomRef.current = null;
    setIsConnected(false);
    setCurrentRoomId(null);
    setMessages([]);
    setPartnerName('procurando...');
    setIsMatching(true);
    matchStarted.current = false;
  }, []);

  const recoverStaleSocket = useCallback(async () => {
    if (staleRecoveryRef.current) return;
    if (isLeavingRef.current) return;
    staleRecoveryRef.current = true;
    try {
      logger.chat.log('Recovering stale socket state');
      await wsService.reconnect();
      setListenerVersion((version) => version + 1);
    } catch (reconnectError) {
      logger.chat.error('Socket recovery failed:', reconnectError);
    } finally {
      currentRoomRef.current = null;
      setCurrentRoomId(null);
      setIsConnected(false);
      setIsMatching(false);
      matchStarted.current = false;
      staleRecoveryRef.current = false;
    }
  }, []);

  const handleSocketError = useCallback((error: any) => {
    logger.chat.error('Socket error:', error);
    setIsMatching(false);
    matchStarted.current = false;
    const message = String(error?.error || error?.message || '');
    if (message.includes('Already in room') || message.includes('Not authenticated')) {
      recoverStaleSocket().catch(() => undefined);
    }
  }, [recoverStaleSocket]);

  // FIX: usa equippedIdRef para sempre enviar o avatar atual sem tornar
  // startMatch instável (equippedId fora das deps → sem recriação desnecessária
  // do callback → sem re-execução do effect de auto-start → Searching estável).
  const startMatch = useCallback(async () => {
    if (matchStarted.current) {
      logger.chat.log('Match already started');
      return;
    }
    if (isLeavingRef.current) {
      logger.chat.log('Ignoring match start while leaving');
      return;
    }
    try {
      logger.chat.log('Starting match...');
      matchStarted.current = true;
      setIsMatching(true);
      setPartnerName('procurando...');
      await wsService.ensureConnected();
      await wsService.prepareForMatch();
      // Lê sempre o valor atual via ref — nunca stale
      wsService.findMatch(category, equippedIdRef.current);
    } catch (error) {
      logger.chat.error('Match error:', error);
      setIsMatching(false);
      matchStarted.current = false;
    }
  }, [category]);

  const cancelMatch = useCallback(() => {
    logger.chat.log('Cancel match');
    setIsMatching(false);
    matchStarted.current = false;
    wsService.cancelMatch();
  }, []);

  const leaveAndReset = useCallback(() => {
    logger.chat.log('Leave and reset chat');
    isLeavingRef.current = true;
    const roomId = currentRoomRef.current;
    if (roomId) wsService.leaveRoom(roomId);
    wsService.cancelMatch();
    wsService.offAll();
    currentRoomRef.current = null;
    setIsConnected(false);
    setCurrentRoomId(null);
    setIsMatching(false);
    setMessages([]);
    setPartnerName('procurando...');
    setQueuePosition(null);
    setEstimatedWait('');
    setPartnerTyping(false);
    matchStarted.current = false;
    staleRecoveryRef.current = false;
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!currentRoomId || !text.trim()) return;
    const newMessage: ChatMessage = {
      id: `${Date.now()}`,
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
      userName: 'Você',
    };
    setMessages((prev) => [...prev, newMessage]);
    wsService.sendMessage(currentRoomId, text.trim());
  }, [currentRoomId]);

  const skipToNext = useCallback(() => {
    if (!currentRoomId) return;
    logger.chat.log('Skipping to next chat');
    wsService.leaveRoom(currentRoomId);
    currentRoomRef.current = null;
    setIsConnected(false);
    setCurrentRoomId(null);
    setMessages([]);
    setPartnerName('procurando...');
    setIsMatching(true);
    matchStarted.current = false;
    startMatch();
  }, [currentRoomId, startMatch]);

  useEffect(() => {
    isLeavingRef.current = false;
    logger.chat.log('Registering listeners');
    wsService.onMessage(handleNewMessage);
    wsService.onMatchingFound(handleMatchFound);
    wsService.onQueueStatus(handleQueueStatus);
    wsService.onMatchingCancelled(handleMatchingCancelled);
    wsService.onPartnerTyping(handlePartnerTyping);
    wsService.onPartnerLeft(handlePartnerDisconnect);
    wsService.onPartnerDisconnected(handlePartnerDisconnect);
    wsService.onError(handleSocketError);
    return () => {
      logger.chat.log('Removing listeners');
      wsService.offAll();
      isLeavingRef.current = true;
      matchStarted.current = false;
      staleRecoveryRef.current = false;
    };
  }, [handleNewMessage, handleMatchFound, handleQueueStatus, handleMatchingCancelled, handlePartnerTyping, handlePartnerDisconnect, handleSocketError, listenerVersion]);

  useEffect(() => {
    if (wsService.connected && !currentRoomId && !isMatching && !matchStarted.current && !isLeavingRef.current) {
      logger.chat.log('Auto starting match');
      startMatch().catch(() => { matchStarted.current = false; });
    }
  }, [currentRoomId, isMatching, startMatch]);

  useEffect(() => {
    currentRoomRef.current = currentRoomId;
    if (currentRoomId) {
      logger.chat.log('Match found, resetting lock');
      matchStarted.current = false;
    }
  }, [currentRoomId]);

  return useMemo(() => ({
    messages, isConnected, isMatching, currentRoomId, partnerName, partnerAvatarId, queuePosition, estimatedWait, partnerTyping, startMatch, cancelMatch, sendMessage, skipToNext, leaveAndReset,
  }), [messages, isConnected, isMatching, currentRoomId, partnerName, partnerAvatarId, queuePosition, estimatedWait, partnerTyping, startMatch, cancelMatch, sendMessage, skipToNext, leaveAndReset]);
}
