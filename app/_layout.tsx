/**
 * ROOT LAYOUT — MeetStranger Mobile
 *
 * Caminho: app/_layout.tsx
 *
 * Alteração: adicionado <AvatarShopProvider> para que o estado
 * da loja (avatar equipado, moedas, compras) seja compartilhado
 * entre profile/index.tsx e profile/avatar-shop.tsx.
 */

import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { AvatarShopProvider } from '../hooks/useAvatarShop';

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
        {/* ✅ AvatarShopProvider adicionado aqui para compartilhar estado entre telas */}
        <AvatarShopProvider>
          <RouteGuard />
          <Stack screenOptions={{ headerShown: false }} />
        </AvatarShopProvider>
      </AuthProvider>
  );
}