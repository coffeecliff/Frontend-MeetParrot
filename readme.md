# ☕ CoffeeCliff - MeetParrot Frontend

![CoffeeCliff Banner](./assets/logos/parrot_logo.png)

> Uma aplicação de chat em tempo real onde você encontra pessoas para conversar enquanto toma um café ☕

## 📋 Visão Geral

**CoffeeCliff** é uma plataforma de encontro social que permite conectar-se com outras pessoas através de chat em tempo real. A aplicação oferece uma experiência fluida e intuitiva, desde o bem-vindo até a seleção de chats e conversas.

### Fluxo de Navegação
```
Welcome → Register/Login → Chat Select → Chat Room
```

---

## 📁 Estrutura de Pastas

```
coffeecliff-Frontend-MeetParrot/
├── 📂 app/                          # Páginas e rotas (Expo Router)
│   ├── _layout.tsx                  # Layout raiz da aplicação
│   ├── index.tsx                    # Página Welcome
│   ├── auth/
│   │   ├── login.tsx               # Página de Login
│   │   └── register.tsx            # Página de Registro
│   ├── chat/
│   │   ├── select.tsx              # Seleção de salas de chat
│   │   ├── room.tsx                # Sala de chat (conversa)
│   │   └── searching.tsx           # Tela de busca de usuários
│   ├── about/
│   │   └── index.tsx               # Página Sobre
│   ├── coins/
│   │   └── index.tsx               # Página de Moedas/Créditos
│   └── profile/
│       └── index.tsx               # Página de Perfil do Usuário
│
├── 📂 components/                   # Componentes reutilizáveis
│   ├── Header.tsx                  # Cabeçalho padrão
│   ├── Footer.tsx                  # Rodapé padrão
│   ├── Button.tsx                  # Botão customizado
│   ├── Input.tsx                   # Input customizado
│   ├── ChatHeader.tsx              # Cabeçalho da sala de chat
│   ├── ChatMessage.tsx             # Mensagem de chat
│   └── burger_menu.tsx             # Menu hambúrguer/lateral
│
├── 📂 design-system/                # Sistema de design centralizado
│   ├── 📂 components/              # Componentes do design system
│   │   ├── Button-clean.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ChatBubble.tsx
│   │   ├── ChatBubble-clean.tsx
│   │   ├── Input.tsx
│   │   └── claybox.ts
│   ├── 📂 tokens/                  # Tokens de design (cores, tipografia, espaçamento)
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── typography-clean.ts
│   │   ├── spacing.ts
│   │   └── spacing-clean.ts
│   ├── 📂 animations/              # Animações reutilizáveis
│   │   ├── fade.ts
│   │   ├── slide.ts
│   │   └── interactions.ts
│   ├── index.ts                    # Exportações do design system
│   ├── DesignSystemShowcase.tsx    # Showcase dos componentes
│   ├── CLEAN_DESIGN_GUIDE.md       # Guia de design limpo
│   └── README.md                   # Documentação do design system
│
├── 📂 hooks/                        # React Hooks customizados
│   ├── useAuth.tsx                 # Gerenciar autenticação
│   └── useChat.tsx                 # Gerenciar estado de chat
│
├── 📂 services/                     # Serviços e APIs
│   ├── api.ts                      # Cliente HTTP/Requisições
│   ├── config.ts                   # Configurações de ambiente
│   └── websocket.ts                # Conexão WebSocket para chat real-time
│
├── 📂 styles/                       # Estilos específicos de telas
│   └── 📂 screens/
│       ├── welcomeStyles.ts        # Estilos da página Welcome
│       ├── loginStyles.ts          # Estilos da página Login
│       ├── registerStyles.ts       # Estilos da página Registro
│       ├── chatSelectStyles.ts     # Estilos da seleção de chats
│       ├── chatRoomStyles.ts       # Estilos da sala de chat
│       ├── profileStyles.ts        # Estilos do perfil
│       ├── coinsStyles.ts          # Estilos da página de moedas
│       ├── aboutStyles.ts          # Estilos da página Sobre
│       └── homeStyles.ts           # Estilos da página Home (não utilizado)
│
├── 📂 constants/                    # Constantes da aplicação
│   ├── colors.ts                   # Constantes de cores
│   └── types.ts                    # Tipos TypeScript globais
│
└── 📂 assets/                       # Recursos estáticos
    ├── 📂 logos/                   # Logos da marca
    ├── 📂 backgrounds/             # Imagens de fundo
    ├── 📂 buttons/                 # Ícones de botões
    ├── 📂 chat_icons/              # Ícones de chat
    ├── 📂 clay_backgrounds/        # Fundos em estilo clay
    ├── 📂 coins/                   # Ícones de moedas
    └── 📂 profile_icons/           # Ícones de perfil
```

---

## 🎯 Descrição das Pastas

### **app/** - Páginas e Rotas
Contém toda a estrutura de navegação da aplicação usando Expo Router. Cada arquivo representa uma rota.

**Fluxo Atual:**
- `index.tsx` → Página de boas-vindas
- `auth/login.tsx` → Autenticação (Login)
- `auth/register.tsx` → Registro de novo usuário
- `chat/select.tsx` → Seleção de salas/usuários para conversar
- `chat/room.tsx` → Sala de chat em tempo real

### **components/** - Componentes Reutilizáveis
Componentes React específicos da aplicação que podem ser usados em múltiplas páginas.

### **design-system/** - Sistema de Design
Centraliza todos os elementos visuais, tokens de design e componentes padrão para manter consistência visual.

- **tokens/**: Define cores, tipografia e espaçamento globais
- **animations/**: Animações reutilizáveis (fade, slide, etc)
- **components/**: Componentes base do sistema de design

### **hooks/** - React Hooks Customizados
Lógica reutilizável para gerenciar estado e side effects.

- `useAuth.tsx` - Gerencia login, logout, dados do usuário
- `useChat.tsx` - Gerencia mensagens, conexões de chat

### **services/** - APIs e Serviços
Camada de comunicação com o backend e configurações.

- `api.ts` - Cliente HTTP para requisições REST
- `websocket.ts` - Conexão WebSocket para chat em tempo real
- `config.ts` - Variáveis de ambiente e configurações

### **styles/** - Estilos de Telas
Estilos específicos de cada página usando StyleSheet ou bibliotecas de estilo.

### **constants/** - Constantes Globais
Valores imutáveis e tipos TypeScript usados em toda a aplicação.

### **assets/** - Recursos Estáticos
Imagens, ícones e recursos visuais organizados por categoria.

---

## 🚀 Como Começar

### Instalação
```bash
# Instalar dependências
npm install

# ou
yarn install
```

### Executar em Desenvolvimento
```bash
# Iniciar o servidor de desenvolvimento
npm run start

# ou
yarn start
```

### Buildar para Produção
```bash
# Build para iOS
npm run build:ios

# Build para Android
npm run build:android
```

---

## 🔄 Fluxo da Aplicação

```
┌─────────────┐
│   Welcome   │ ← Página inicial
└──────┬──────┘
       │
       ├─→ Login ────┐
       │             │
       └─→ Register ─┤
                     │
                    ├─→ ✓ Autenticado
                    │
                   ┌▼──────────────┐
                   │ Chat Select   │ ← Escolher conversa
                   └────┬─────────┘
                        │
                   ┌────▼──────────┐
                   │  Chat Room    │ ← Conversa em tempo real
                   └───────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma React Native
- **Expo Router** - Roteamento
- **TypeScript** - Tipagem estática
- **WebSocket** - Chat em tempo real
- **React Hooks** - Gerenciamento de estado

---


## 👨‍💻 Contribuidores

Desenvolvido por Cauã Cunha Neves - Aluno do Senac Tec

---

**Última atualização:** 15 de Maio de 2026