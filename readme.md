# MeetParrot 

![Capa do Projeto](assets/logos/parrot_logo.png)

Bem-vindo ao repositório MeetParrot — uma interface mobile (Expo / React Native) para encontros por chat. Este README resume a estrutura, como rodar e onde encontrar os pontos-chave do projeto.

---

## Sumário
- 📁 Estrutura do projeto
- ▶️ Como rodar
- 🧭 Principais componentes & hooks
- ⚙️ Serviços e configuração
- 🤝 Contribuição
- 📜 Licença

---

## 📁 Estrutura (selecionada)
Arquivos e pastas principais:
- app/
  - _layout.tsx
  - index.tsx
  - auth/
    - login.tsx
    - register.tsx
  - chat/
    - select.tsx
    - room.tsx
    - searching.tsx
  - home/index.tsx
  - coins/index.tsx
  - profile/index.tsx
- components/
  - Header.tsx, Footer.tsx, Button.tsx, Input.tsx
  - ChatHeader.tsx, ChatMessage.tsx, burger_menu.tsx
- design-system/
  - tokens: colors.ts, spacing.ts, typography.ts
  - components: Button.tsx, Input.tsx, Card.tsx, ChatBubble.tsx
  - animations: interactions.ts, slide.ts, fade.ts
- hooks/
  - useAuth.tsx
  - useChat.tsx
- services/
  - config.ts
  - api.ts
  - websocket.ts
- assets/
  - backgrounds/, buttons/, chat_icons/, clay_backgrounds/, coins/, logos/, profile_icons/
- styles/
  - screens/: welcomeStyles.ts, loginStyles.ts, registerStyles.ts, homeStyles.ts, chatRoomStyles.ts, chatSelectStyles.ts, coinsStyles.ts, profileStyles.ts, aboutStyles.ts
- meta/config: app.json, package.json, tsconfig.json, .gitignore, .expo/devices.json

---

## ▶️ Como rodar (rápido)
1. Instalar dependências:
```powershell
npm install
```
2. Iniciar Expo:
```powershell
npx expo start
```
3. Abrir no emulador/dispositivo via painel do Expo ou QR code.

Dica: verifique scripts em package.json para atalhos.

---

## 🧭 Principais componentes & hooks
- UI:
  - Button — variantes: primary, secondary, ghost, danger
  - Input — label, foco e estado de erro
  - Card — variantes: default, elevated, outlined
  - ChatBubble — posições: left | right
- Comportamento:
  - useChat — lógica de mensagens, match e socket
  - ApiService (services/api.ts) — Login, Register, getRooms, sendMessage, findMatch
- Layout:
  - Header / Footer — barras globais
  - ChatHeader — header específico do chat

---

## ⚙️ Observações rápidas
- Tokens & tema: centralizados em design-system/tokens.
- Configure services/config.ts com a URL e chaves do backend antes de executar.
- Navegação: telas de chat usam useChat + expo-router (ver app/_layout.tsx).
- WebSocket: implementado em services/websocket.ts e consumido por hooks/useChat.tsx.

---

## 👨‍💻 Autores
- Cauã Cunha Neves - Aluno do Senac Tec