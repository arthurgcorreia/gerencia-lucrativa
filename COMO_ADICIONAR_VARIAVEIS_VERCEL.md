# 📋 Como Adicionar Variáveis de Ambiente na Vercel

Guia passo a passo completo para configurar as variáveis de ambiente no seu projeto Vercel.

## 🎯 Passo a Passo Completo

### 1️⃣ Acesse o Dashboard da Vercel

1. Abra seu navegador e acesse: **https://vercel.com**
2. Faça login com sua conta (pode usar GitHub)

### 2️⃣ Encontre seu Projeto

1. No dashboard, você verá uma lista dos seus projetos
2. Clique no projeto **stockwave** (ou o nome que você deu)

### 3️⃣ Vá para as Configurações

1. No topo da página do projeto, você verá várias abas:
   - **Deployments**
   - **Analytics**
   - **Settings** ← **CLIQUE AQUI**
   - **Domains**
   - etc.

2. Clique em **Settings**

### 4️⃣ Abra Environment Variables

1. No menu lateral esquerdo (dentro de Settings), você verá:
   - General
   - **Environment Variables** ← **CLIQUE AQUI**
   - Git
   - Domains
   - etc.

2. Clique em **Environment Variables**

### 5️⃣ Adicionar Cada Variável

Agora você vai adicionar cada variável, uma por uma. Para cada variável:

#### 📝 Variável 1: DATABASE_URL

1. Clique no botão **"Add New"** ou **"Add"**
2. Preencha:
   - **Key (Chave):** `DATABASE_URL`
   - **Value (Valor):** Cole aqui a connection string do seu banco (Neon/Supabase)
   - **Environments:** Marque TODAS as opções:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
3. Clique em **Save**

**Onde conseguir o DATABASE_URL?**
- **Neon:** https://neon.tech → Seu projeto → Connection string
- **Supabase:** https://supabase.com → Seu projeto → Settings → Database → Connection string (URI)

---

#### 📝 Variável 2: NEXTAUTH_SECRET

1. Clique em **"Add New"** novamente
2. Preencha:
   - **Key:** `NEXTAUTH_SECRET`
   - **Value:** Gere um secret aleatório em: https://generate-secret.vercel.app/32
   - **Environments:** ✅ Production ✅ Preview ✅ Development
3. Clique em **Save**

---

#### 📝 Variável 3: JWT_SECRET

1. Clique em **"Add New"** novamente
2. Preencha:
   - **Key:** `JWT_SECRET`
   - **Value:** Gere OUTRO secret (diferente do anterior) em: https://generate-secret.vercel.app/32
   - **Environments:** ✅ Production ✅ Preview ✅ Development
3. Clique em **Save**

---

#### 📝 Variável 4: BARCODE_API_URL

1. Clique em **"Add New"** novamente
2. Preencha:
   - **Key:** `BARCODE_API_URL`
   - **Value:** `https://api.upcitemdb.com/prod/trial/lookup`
   - **Environments:** ✅ Production ✅ Preview ✅ Development
3. Clique em **Save**

---

#### 📝 Variável 5: NEXTAUTH_URL (Opcional)

1. Clique em **"Add New"** novamente
2. Preencha:
   - **Key:** `NEXTAUTH_URL`
   - **Value:** `https://seu-projeto.vercel.app` (substitua pelo domínio que a Vercel gerou)
   - **Environments:** ✅ Production ✅ Preview ✅ Development
3. Clique em **Save**

> 💡 **Dica:** Você encontra a URL do seu projeto na aba "Domains" ou no topo da página do projeto.

---

## ✅ Verificação

Após adicionar todas as variáveis, você deve ver algo assim:

```
Key                  Value                          Environments
DATABASE_URL         postgresql://...               Production, Preview, Development
NEXTAUTH_SECRET      abc123...                      Production, Preview, Development
JWT_SECRET           xyz789...                      Production, Preview, Development
BARCODE_API_URL      https://api.upcitemdb.com/...  Production, Preview, Development
NEXTAUTH_URL         https://seu-projeto.vercel.app Production, Preview, Development
```

## 🔄 Fazer Redeploy

**IMPORTANTE:** Após adicionar as variáveis, você precisa fazer um novo deploy:

### Opção 1: Redeploy do último deployment
1. Vá para a aba **Deployments**
2. Clique nos **3 pontos** (...) do último deployment
3. Selecione **Redeploy**
4. Aguarde o deploy completar

### Opção 2: Novo push no GitHub
1. Faça um novo commit e push no GitHub
2. A Vercel fará deploy automático

## 🐛 Problemas Comuns

### ❌ "As variáveis foram adicionadas mas o erro continua"

**Solução:** Você precisa fazer um **Redeploy** após adicionar as variáveis!

### ❌ "Não sei onde encontrar o DATABASE_URL"

**Para Neon:**
1. Acesse https://neon.tech
2. Faça login
3. Selecione seu projeto
4. Na página inicial, você verá "Connection string"
5. Copie a string (começa com `postgresql://...`)

**Para Supabase:**
1. Acesse https://supabase.com
2. Faça login
3. Selecione seu projeto
4. Vá em **Settings** (ícone de engrenagem)
5. Clique em **Database**
6. Role até "Connection string"
7. Selecione "URI" e copie

### ❌ "Não encontro a opção Environment Variables"

**Solução:** Certifique-se de que:
1. Você está na página do projeto (não no dashboard geral)
2. Clicou em **Settings**
3. Está olhando o menu lateral esquerdo (não o topo)

## 📸 Imagem de Referência

A interface da Vercel deve parecer assim:

```
┌─────────────────────────────────────────┐
│  [Deployments] [Analytics] [Settings]  │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Settings                                │
├─────────────────────────────────────────┤
│ General              [Edit]             │
│ Environment Variables [Edit]  ← AQUI!   │
│ Git                  [Edit]             │
│ Domains              [Edit]             │
└─────────────────────────────────────────┘
```

## ✅ Checklist Final

Antes de testar, confirme:

- [ ] Acessei https://vercel.com e fiz login
- [ ] Encontrei o projeto "stockwave"
- [ ] Cliquei em "Settings"
- [ ] Cliquei em "Environment Variables"
- [ ] Adicionei todas as 5 variáveis:
  - [ ] DATABASE_URL
  - [ ] NEXTAUTH_SECRET
  - [ ] JWT_SECRET
  - [ ] BARCODE_API_URL
  - [ ] NEXTAUTH_URL (opcional)
- [ ] Marquei TODAS as opções de Environments (Production, Preview, Development) para cada variável
- [ ] Fiz Redeploy ou novo push

## 🎉 Pronto!

Após seguir todos os passos, seu sistema deve funcionar! Teste criando uma nova conta.


