# Planejamento Financeiro Pessoal - MVP

Aplicativo web de planejamento financeiro pessoal com foco em simplicidade e clareza visual.

## 🚀 Stack Tecnológica

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **TailwindCSS** para estilização
- **Firebase** (Authentication + Firestore)
- **Recharts** para gráficos
- **Stripe** para pagamentos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Firebase com projeto criado
- Conta no Stripe (para assinaturas)
- npm ou yarn

## 🔧 Configuração do Projeto

### 1. Instalar dependências

```bash
npm install
# ou
yarn install
```

### 2. Configurar Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto (ou use um existente)
3. Ative o **Authentication** e configure:
   - Email/Password
   - Google Sign-In
4. Crie um banco de dados **Firestore** em modo de produção
5. Copie as credenciais do projeto

### 3. Configurar Stripe

1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com/)
2. Crie um produto com preço recorrente (mensal)
3. Copie o **Price ID** (começa com `price_`)
4. Configure o webhook:
   - URL: `https://seu-dominio.com/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

### 4. Configurar variáveis de ambiente

1. Copie o arquivo `env.example` para `.env.local`:

```bash
cp env.example .env.local
```

2. Preencha as variáveis:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Stripe
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret
STRIPE_PRICE_ID=price_seu_price_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Configurar Regras do Firestore

No console do Firebase, vá em **Firestore Database > Rules** e configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários: apenas o próprio usuário pode ler/escrever
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transações: apenas o próprio usuário pode ler/escrever
    match /transactions/{transactionId} {
      // Permitir leitura se o usuário for o dono da transação
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      
      // Permitir criação se o userId no documento for o usuário autenticado
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      
      // Permitir atualização se o usuário for o dono da transação
      allow update: if request.auth != null && 
        resource.data.userId == request.auth.uid &&
        request.resource.data.userId == request.auth.uid;
      
      // Permitir exclusão se o usuário for o dono da transação
      allow delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Metas: apenas o próprio usuário pode ler/escrever
    match /goals/{goalId} {
      // Permitir leitura se o usuário for o dono da meta
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      
      // Permitir criação se o userId no documento for o usuário autenticado
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      
      // Permitir atualização se o usuário for o dono da meta
      allow update: if request.auth != null && 
        resource.data.userId == request.auth.uid &&
        request.resource.data.userId == request.auth.uid;
      
      // Permitir exclusão se o usuário for o dono da meta
      allow delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### 6. Executar o projeto

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
projeto-mvp/
├── app/
│   ├── (auth)/          # Rotas de autenticação
│   │   ├── login/
│   │   └── signup/
│   ├── api/             # API Routes
│   │   ├── checkout/    # Stripe Checkout
│   │   └── webhooks/    # Stripe Webhooks
│   ├── dashboard/       # Dashboard principal
│   ├── transactions/    # Gerenciamento de transações
│   ├── goals/           # Gerenciamento de metas
│   ├── upgrade/         # Página de upgrade
│   ├── globals.css      # Estilos globais
│   ├── layout.tsx       # Layout raiz
│   └── page.tsx         # Página inicial (redireciona)
├── components/          # Componentes reutilizáveis
│   ├── dashboard/       # Componentes do dashboard
│   ├── goals/           # Componentes de metas
│   ├── premium/         # Componentes premium
│   └── ui/              # Componentes UI
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   ├── useTransactions.ts
│   ├── usePlan.ts
│   └── useGoals.ts
├── lib/                 # Utilitários
│   ├── stripe.ts        # Configuração Stripe
│   ├── planLimits.ts    # Limites de planos
│   ├── goals.ts         # Funções de metas
│   └── utils.ts         # Funções utilitárias
├── services/            # Serviços externos
│   └── firebase/
│       ├── config.ts    # Configuração Firebase
│       ├── auth.ts      # Serviços de autenticação
│       ├── firestore.ts # Serviços do Firestore
│       ├── goals.ts     # Serviços de metas
│       └── user.ts      # Serviços de usuário
├── types/              # Definições TypeScript
│   └── index.ts
└── ...
```

## 🗄️ Estrutura do Firestore

### Coleção: `users`
```typescript
{
  name: string
  email: string
  plan: "free" | "premium"
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  premiumSince?: Timestamp
  createdAt: Timestamp
}
```

### Coleção: `transactions`
```typescript
{
  userId: string
  type: "income" | "expense"
  category: string
  amount: number
  date: Timestamp
  createdAt: Timestamp
}
```

### Coleção: `goals`
```typescript
{
  userId: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string (ISO)
  description?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## 💳 Sistema de Assinatura

### Planos

- **Free**: 10 transações, funcionalidades básicas
- **Premium**: Transações ilimitadas, todas as funcionalidades (R$ 29/mês)

### Fluxo de Assinatura

1. Usuário clica em "Fazer Upgrade"
2. Redirecionado para página `/upgrade`
3. Clica em "Assinar Premium"
4. Redirecionado para Stripe Checkout
5. Após pagamento, webhook atualiza plano no Firestore
6. Usuário retorna ao dashboard como Premium

### Webhook do Stripe

O webhook processa os seguintes eventos:
- `checkout.session.completed` - Ativa plano premium
- `customer.subscription.created/updated` - Atualiza status
- `customer.subscription.deleted` - Rebaixa para free
- `invoice.payment_succeeded` - Confirma pagamento
- `invoice.payment_failed` - Notifica falha

## 📝 Funcionalidades

- ✅ Autenticação (Email/Password e Google)
- ✅ CRUD completo de transações
- ✅ Dashboard com gráficos
- ✅ Cálculos automáticos
- ✅ Comparação mensal
- ✅ Alertas de gastos altos
- ✅ Sistema de planos (Free/Premium)
- ✅ Assinatura mensal com Stripe
- ✅ Limite de transações no plano free
- ✅ Bloqueios visuais de funcionalidades premium
- ✅ Metas financeiras de poupança
- ✅ Barra de progresso de metas
- ✅ Integração automática com receitas

## 🚀 Deploy no Vercel

### Pré-requisitos

- Conta no [GitHub](https://github.com)
- Conta no [Vercel](https://vercel.com) (pode fazer login com GitHub)
- Projeto configurado no Firebase
- Projeto configurado no Stripe

### Passo a Passo

#### 1. Preparar o Repositório no GitHub

```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: MVP Planejamento Financeiro"

# Criar repositório no GitHub e adicionar remote
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

# Fazer push
git branch -M main
git push -u origin main
```

#### 2. Conectar no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório do GitHub
4. O Vercel detectará automaticamente que é um projeto Next.js
5. Clique em **"Deploy"** (não precisa configurar nada ainda)

#### 3. Configurar Variáveis de Ambiente no Vercel

Após o primeiro deploy, vá em **Settings → Environment Variables** e adicione todas as variáveis:

**Firebase:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

**Stripe:**
```
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta (ou sk_test_ para testes)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_publica (ou pk_test_)
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret
STRIPE_PRICE_ID=price_seu_price_id
```

**App URL:**
```
NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
```

⚠️ **Importante:** 
- Use as chaves de **produção** (`sk_live_` e `pk_live_`) quando estiver em produção
- Use as chaves de **teste** (`sk_test_` e `pk_test_`) apenas para desenvolvimento
- Configure as variáveis para **Production**, **Preview** e **Development**

#### 4. Configurar Webhook do Stripe

1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Clique em **"Add endpoint"**
3. **URL do endpoint:** `https://seu-projeto.vercel.app/api/webhooks/stripe`
4. **Eventos a selecionar:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Clique em **"Add endpoint"**
6. Copie o **"Signing secret"** (começa com `whsec_`)
7. Adicione como `STRIPE_WEBHOOK_SECRET` no Vercel

#### 5. Fazer Redeploy

Após configurar todas as variáveis:
1. Vá em **Deployments**
2. Clique nos três pontos do último deploy
3. Selecione **"Redeploy"**
4. Ou faça um novo commit/push para trigger automático

### Deploy Automático

O Vercel faz deploy automático a cada push na branch `main`:
- Cada commit gera um novo deploy
- Pull Requests geram preview deployments
- Você pode ver os logs em tempo real

### Outras Plataformas

O projeto também pode ser deployado em:
- **Netlify** (similar ao Vercel)
- **Firebase Hosting** (requer configuração adicional)
- **Railway** ou **Render** (alternativas)

## 📄 Licença

Este projeto é um MVP para fins educacionais.
