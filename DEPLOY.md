# 🚀 Guia de Deploy - GitHub + Vercel

Este guia detalha como fazer o deploy completo do projeto no GitHub e Vercel.

## 📋 Checklist Pré-Deploy

- [ ] Projeto funciona localmente (`npm run dev`)
- [ ] Todas as variáveis de ambiente estão no `.env.local` (não commitado)
- [ ] Firebase configurado e funcionando
- [ ] Stripe configurado (pelo menos em modo teste)
- [ ] Testes básicos realizados

## 🔧 Passo 1: Preparar o Repositório GitHub

### 1.1. Verificar arquivos ignorados

Certifique-se de que o `.gitignore` está ignorando:
- `.env*` (todos os arquivos de ambiente)
- `node_modules/`
- `.next/`
- `.vercel/`

### 1.2. Criar repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"**
3. Nome: `projeto-mvp` (ou o nome que preferir)
4. Descrição: "MVP de Planejamento Financeiro Pessoal"
5. **NÃO** marque "Initialize with README" (já temos um)
6. Clique em **"Create repository"**

### 1.3. Fazer push do código

```bash
# Na pasta do projeto, execute:

# Inicializar git (se ainda não foi feito)
git init

# Verificar status
git status

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: MVP Planejamento Financeiro Pessoal"

# Adicionar remote (substitua SEU-USUARIO e SEU-REPOSITORIO)
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push
git push -u origin main
```

## 🌐 Passo 2: Deploy no Vercel

### 2.1. Criar conta e conectar GitHub

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seus repositórios

### 2.2. Importar projeto

1. No dashboard do Vercel, clique em **"Add New Project"**
2. Selecione o repositório `projeto-mvp`
3. O Vercel detectará automaticamente:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **NÃO configure variáveis de ambiente ainda** (faremos depois)
5. Clique em **"Deploy"**

### 2.3. Primeiro deploy

O primeiro deploy falhará (sem variáveis de ambiente), mas isso é esperado.

## 🔐 Passo 3: Configurar Variáveis de Ambiente

### 3.1. Acessar configurações

1. No projeto no Vercel, vá em **Settings**
2. Clique em **Environment Variables**

### 3.2. Adicionar variáveis do Firebase

Adicione cada variável uma por uma:

| Key | Value | Ambiente |
|-----|-------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Sua API Key do Firebase | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `seu-projeto.firebaseapp.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Seu Project ID | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `seu-projeto.appspot.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Seu Sender ID | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Seu App ID | Production, Preview, Development |

**Onde encontrar:** Firebase Console → Project Settings → Your apps → Web app

### 3.3. Adicionar variáveis do Stripe

| Key | Value | Ambiente |
|-----|-------|----------|
| `STRIPE_SECRET_KEY` | `sk_live_...` (produção) ou `sk_test_...` (teste) | Production, Preview, Development |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (produção) ou `pk_test_...` (teste) | Production, Preview, Development |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (será configurado depois) | Production, Preview, Development |
| `STRIPE_PRICE_ID` | `price_...` | Production, Preview, Development |

**Onde encontrar:** Stripe Dashboard → Developers → API keys

### 3.4. Adicionar URL da aplicação

| Key | Value | Ambiente |
|-----|-------|----------|
| `NEXT_PUBLIC_APP_URL` | `https://seu-projeto.vercel.app` | Production, Preview, Development |

⚠️ **Importante:** Substitua `seu-projeto` pelo nome real do seu projeto no Vercel.

## 🔗 Passo 4: Configurar Webhook do Stripe

### 4.1. Obter URL do webhook

Após o deploy, sua URL será:
```
https://seu-projeto.vercel.app/api/webhooks/stripe
```

### 4.2. Configurar no Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Clique em **"Add endpoint"**
3. **Endpoint URL:** Cole a URL acima
4. **Description:** "Vercel Webhook - Produção"
5. **Events to send:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
6. Clique em **"Add endpoint"**

### 4.3. Copiar Signing Secret

1. Após criar o endpoint, clique nele
2. Na seção **"Signing secret"**, clique em **"Reveal"**
3. Copie o secret (começa com `whsec_`)
4. Volte ao Vercel e adicione como `STRIPE_WEBHOOK_SECRET`

### 4.4. Fazer redeploy

1. No Vercel, vá em **Deployments**
2. Clique nos **três pontos** do último deploy
3. Selecione **"Redeploy"**
4. Aguarde o deploy completar

## ✅ Passo 5: Testar o Deploy

### 5.1. Testes básicos

1. Acesse `https://seu-projeto.vercel.app`
2. Teste login/cadastro
3. Teste criar transação
4. Teste o fluxo de upgrade (modo teste do Stripe)

### 5.2. Testar webhook

1. Faça um teste de checkout no Stripe
2. Verifique os logs no Vercel (Deployments → Function Logs)
3. Verifique os eventos no Stripe Dashboard

## 🔄 Deploy Contínuo

A partir de agora, cada push na branch `main` fará deploy automático:

```bash
# Fazer alterações
git add .
git commit -m "Sua mensagem"
git push origin main
```

O Vercel detectará automaticamente e fará o deploy.

## 🐛 Troubleshooting

### Erro: "Missing environment variables"
- Verifique se todas as variáveis estão configuradas no Vercel
- Certifique-se de que estão marcadas para o ambiente correto

### Erro: "Webhook signature verification failed"
- Verifique se o `STRIPE_WEBHOOK_SECRET` está correto
- Certifique-se de que está usando o secret do endpoint correto

### Erro: "Firebase not initialized"
- Verifique se todas as variáveis do Firebase começam com `NEXT_PUBLIC_`
- Verifique se os valores estão corretos

### Build falha
- Verifique os logs no Vercel
- Teste localmente com `npm run build`

## 📚 Recursos Adicionais

- [Documentação do Vercel](https://vercel.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Documentação do Firebase](https://firebase.google.com/docs)

## 🎉 Pronto!

Seu projeto está no ar! 🚀

Acesse: `https://seu-projeto.vercel.app`

