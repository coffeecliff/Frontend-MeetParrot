/**
 * ROOT LAYOUT — MeetStranger
 *
 * Caminho: app/_layout.tsx
 *
 * CORREÇÃO: UserIdBridge sincroniza o userId do AuthContext para o
 * AvatarShopContext, isolando os dados de moedas/avatares por conta.
 * Quando o usuário faz logout (user → null), o shop reseta.
 * Quando faz login com outra conta, carrega os dados daquela conta.
 */

import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { AvatarShopProvider } from '../hooks/useAvatarShop';
import { useAvatarShop } from '../context/AvatarShopContext';

// ==============================
// Bridge: lê userId do Auth e repassa ao AvatarShop
// Precisa estar DENTRO de ambos os providers
// ==============================
function UserIdBridge() {
  const { user } = useAuth();
  const { setUserId } = useAvatarShop();

  useEffect(() => {
    setUserId(user?.id ?? null);
  }, [user?.id]);

  return null;
}

// Guard de rota — redireciona baseado em autenticação
function RouteGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === 'auth';
    const isPublicEntry = !segments[0] || segments[0] === 'index';
    if (!isAuthenticated && !inAuthGroup && !isPublicEntry) {
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/chat/select');
    }
  }, [isAuthenticated, isLoading, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AvatarShopProvider>
        {/* Sincroniza userId do auth para o shop (isolamento por conta) */}
        <UserIdBridge />
        <RouteGuard />
        <Stack screenOptions={{ headerShown: false }} />
      </AvatarShopProvider>
    </AuthProvider>
  );
}
