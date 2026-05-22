/**
 * 🛍️ AVATAR SHOP CONTEXT — MeetStranger
 *
 * Caminho: context/AvatarShopContext.tsx
 *
 * CORREÇÕES:
 * 1. Web usa localStorage ao invés de AsyncStorage (AsyncStorage não funciona no web)
 * 2. Compra/equip via confirm() nativo do browser no web (Alert.alert não existe no web)
 * 3. stateRef para evitar stale closure em callbacks assíncronos
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
const STORAGE_KEY = '@meetstranger:avatar_shop';

const INITIAL_STATE: ShopState = {
  coins: 500,
  purchasedIds: ['1'],
  equippedId: '1',
};

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
  const [state, setState] = useState<ShopState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ Ref sempre atualizada — evita stale closure em callbacks assíncronos
  const stateRef = useRef<ShopState>(INITIAL_STATE);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // --- Carrega do storage na montagem ---
  useEffect(() => {
    (async () => {
      try {
        const raw = await storage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: ShopState = JSON.parse(raw);
          if (!parsed.purchasedIds.includes('1')) {
            parsed.purchasedIds = ['1', ...parsed.purchasedIds];
          }
          setState(parsed);
          stateRef.current = parsed;
        }
      } catch (e) {
        console.warn('[AvatarShop] Erro ao carregar estado:', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // --- Persiste no storage a cada mudança ---
  useEffect(() => {
    if (!isLoaded) return;
    storage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) =>
      console.warn('[AvatarShop] Erro ao salvar estado:', e)
    );
  }, [state, isLoaded]);

  // ✅ buyAvatar lê SEMPRE do stateRef.current (valor vivo)
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

  // ✅ addCoins — usado pela tela de compra de moedas
  const addCoins = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, coins: prev.coins + amount }));
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
    }),
    [state, equippedAvatar, isLoaded, buyAvatar, equipAvatar, addCoins]
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
