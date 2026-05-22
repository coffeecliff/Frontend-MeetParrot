/**
 * 🛍️ AVATAR SHOP CONTEXT — MeetStranger
 *
 * Caminho: context/AvatarShopContext.tsx
 *
 * CORREÇÕES:
 * 1. Storage por userId — cada conta tem seus próprios dados de moedas/avatares
 * 2. Reset de estado ao trocar de conta (userId muda)
 * 3. Web usa localStorage, nativo usa AsyncStorage
 * 4. stateRef para evitar stale closure em callbacks assíncronos
 */

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import { appImages } from '../constants/assets';

// ==============================
// TIPOS
// ==============================

export interface AvatarItem {
  id: string;
  price: number;
  image: ReturnType<typeof require>;
}

interface ShopState {
  coins: number;
  purchasedIds: string[];
  equippedId: string;
}

interface AvatarShopContextType {
  coins: number;
  purchasedIds: string[];
  equippedId: string;
  equippedAvatar: AvatarItem;
  avatars: AvatarItem[];
  isLoaded: boolean;
  buyAvatar: (avatar: AvatarItem) => 'ok' | 'insufficient' | 'already_owned';
  equipAvatar: (id: string) => void;
  addCoins: (amount: number) => void;
  /** Deve ser chamado pelo AuthProvider ao fazer login/logout, passando o userId ou null */
  setUserId: (id: string | null) => void;
}

// ==============================
// CATÁLOGO DE AVATARES
// ==============================

export const AVATARS: AvatarItem[] = [
  { id: '1', price: 0,   image: appImages.perfil1 },
  { id: '2', price: 80,  image: appImages.perfil2 },
  { id: '3', price: 120, image: appImages.perfil3 },
  { id: '4', price: 150, image: appImages.perfil4 },
  { id: '5', price: 200, image: appImages.perfil5 },
  { id: '6', price: 250, image: appImages.perfil6 },
  { id: '7', price: 300, image: appImages.perfil7 },
  { id: '8', price: 350, image: appImages.perfil8 },
  { id: '9', price: 500, image: appImages.perfil9 },
];

const DEFAULT_AVATAR = AVATARS[0];

const INITIAL_STATE: ShopState = {
  coins: 500,
  purchasedIds: ['1'],
  equippedId: '1',
};

// ==============================
// CHAVE DE STORAGE — inclui userId para isolar por conta
// ==============================
function storageKey(userId: string) {
  return `@meetstranger:avatar_shop:${userId}`;
}

// ==============================
// STORAGE HELPERS (web vs native)
// ==============================
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try { return localStorage.getItem(key); } catch { return null; }
    }
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try { localStorage.setItem(key, value); } catch {}
      return;
    }
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage.setItem(key, value);
  },
};

// ==============================
// CONTEXT
// ==============================

const AvatarShopContext = createContext<AvatarShopContextType | undefined>(undefined);

// ==============================
// PROVIDER
// ==============================

export function AvatarShopProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(null);
  const [state, setState] = useState<ShopState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Ref sempre atualizada — evita stale closure em callbacks assíncronos
  const stateRef = useRef<ShopState>(INITIAL_STATE);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ==============================
  // Carrega do storage quando o userId muda
  // Reset completo ao trocar de conta (userId diferente)
  // ==============================
  useEffect(() => {
    if (!userId) {
      // Sem usuário logado: volta ao estado inicial e aguarda
      setState(INITIAL_STATE);
      stateRef.current = INITIAL_STATE;
      setIsLoaded(false);
      return;
    }

    setIsLoaded(false);

    (async () => {
      try {
        const raw = await storage.getItem(storageKey(userId));
        if (raw) {
          const parsed: ShopState = JSON.parse(raw);
          // Garante que o avatar grátis sempre está desbloqueado
          if (!parsed.purchasedIds.includes('1')) {
            parsed.purchasedIds = ['1', ...parsed.purchasedIds];
          }
          setState(parsed);
          stateRef.current = parsed;
        } else {
          // Conta nova — começa com estado inicial
          setState(INITIAL_STATE);
          stateRef.current = INITIAL_STATE;
        }
      } catch (e) {
        console.warn('[AvatarShop] Erro ao carregar estado:', e);
        setState(INITIAL_STATE);
        stateRef.current = INITIAL_STATE;
      } finally {
        setIsLoaded(true);
      }
    })();
  }, [userId]);

  // Persiste no storage a cada mudança (apenas quando há usuário logado)
  useEffect(() => {
    if (!isLoaded || !userId) return;
    storage.setItem(storageKey(userId), JSON.stringify(state)).catch((e) =>
      console.warn('[AvatarShop] Erro ao salvar estado:', e)
    );
  }, [state, isLoaded, userId]);

  // ==============================
  // AÇÕES
  // ==============================

  const buyAvatar = useCallback(
    (avatar: AvatarItem): 'ok' | 'insufficient' | 'already_owned' => {
      const current = stateRef.current;
      if (current.purchasedIds.includes(avatar.id)) return 'already_owned';
      if (current.coins < avatar.price) return 'insufficient';
      setState((prev) => ({
        ...prev,
        coins: prev.coins - avatar.price,
        purchasedIds: [...prev.purchasedIds, avatar.id],
      }));
      return 'ok';
    },
    []
  );

  const equipAvatar = useCallback((id: string) => {
    setState((prev) => ({ ...prev, equippedId: id }));
  }, []);

  const addCoins = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  // Exposto para o _layout.tsx passar o userId do AuthContext
  const setUserId = useCallback((id: string | null) => {
    setUserIdState(id);
  }, []);

  const equippedAvatar = useMemo(
    () => AVATARS.find((a) => a.id === state.equippedId) ?? DEFAULT_AVATAR,
    [state.equippedId]
  );

  const value = useMemo<AvatarShopContextType>(
    () => ({
      coins: state.coins,
      purchasedIds: state.purchasedIds,
      equippedId: state.equippedId,
      equippedAvatar,
      avatars: AVATARS,
      isLoaded,
      buyAvatar,
      equipAvatar,
      addCoins,
      setUserId,
    }),
    [state, equippedAvatar, isLoaded, buyAvatar, equipAvatar, addCoins, setUserId]
  );

  return (
    <AvatarShopContext.Provider value={value}>
      {children}
    </AvatarShopContext.Provider>
  );
}

// ==============================
// HOOK
// ==============================

export function useAvatarShop(): AvatarShopContextType {
  const ctx = useContext(AvatarShopContext);
  if (!ctx) {
    throw new Error(
      'useAvatarShop deve ser usado dentro de <AvatarShopProvider>.\n' +
      'Adicione <AvatarShopProvider> em app/_layout.tsx.'
    );
  }
  return ctx;
}
