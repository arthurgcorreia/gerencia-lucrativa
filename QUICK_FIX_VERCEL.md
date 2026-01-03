# ⚡ Correção Rápida - Erro DATABASE_URL na Vercel

## 🔴 Erro Atual:
```
Error: DATABASE_URL environment variable is not set
```

## ✅ Solução (5 minutos):

### 1️⃣ Criar Banco de Dados Gratuito (2 min)

**Opção A: Neon (Recomendado)**
1. Acesse: https://neon.tech
2. Faça login com GitHub
3. Clique em **"Create a project"**
4. Nome: `gerencia-lucrativa`
5. Clique em **"Create project"**
6. **COPIE a connection string** (ex: `postgresql://user:pass@host/dbname?sslmode=require`)

**Opção B: Supabase**
1. Acesse: https://supabase.com
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Preencha e crie
5. Vá em **Settings** → **Database**
6. **COPIE a Connection string** (URI)

### 2️⃣ Configurar Variáveis na Vercel (2 min)

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **gerencia-lucrativa**
3. Vá em **Settings** (menu superior)
4. Clique em **Environment Variables** (lado esquerdo)
5. Adicione cada variável:

#### Variável 1: DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** Cole a connection string do Neon/Supabase
- **Environments:** ✅ Production ✅ Preview ✅ Development
- Clique em **Save**

#### Variável 2: NEXTAUTH_SECRET
- **Key:** `NEXTAUTH_SECRET`
- **Value:** Gere em https://generate-secret.vercel.app/32
- **Environments:** ✅ Production ✅ Preview ✅ Development
- Clique em **Save**

#### Variável 3: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** Gere outro secret em https://generate-secret.vercel.app/32 (diferente do anterior)
- **Environments:** ✅ Production ✅ Preview ✅ Development
- Clique em **Save**

#### Variável 4: BARCODE_API_URL
- **Key:** `BARCODE_API_URL`
- **Value:** `https://api.upcitemdb.com/prod/trial/lookup`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- Clique em **Save**

#### Variável 5: NEXTAUTH_URL (Opcional)
- **Key:** `NEXTAUTH_URL`
- **Value:** `https://seu-projeto.vercel.app` (use a URL que a Vercel gerou)
- **Environments:** ✅ Production ✅ Preview ✅ Development
- Clique em **Save**

### 3️⃣ Criar Tabelas no Banco (1 min)

Após configurar as variáveis, você precisa criar as tabelas no banco:

**Opção A: Via Terminal Local**

1. Crie um arquivo `.env` local (temporário):
   ```
   DATABASE_URL=sua_connection_string_aqui
   ```

2. Execute:
   ```bash
   npm run prisma:migrate
   ```

3. Quando perguntar o nome da migração, digite: `init`

4. Delete o `.env` após (se já não estiver no .gitignore)

**Opção B: Via Prisma Studio (Visual)**

1. Configure `.env` local com a connection string
2. Execute:
   ```bash
   npx prisma studio
   ```
3. Isso abrirá uma interface visual e criará as tabelas automaticamente

### 4️⃣ Fazer Deploy Novamente

1. Na Vercel, vá em **Deployments**
2. Clique nos **3 pontos** (...) do último deployment
3. Selecione **Redeploy**
4. Ou faça um novo commit/push no GitHub (deploy automático)

## ✅ Pronto!

Após esses passos, o deploy deve funcionar! 

Se ainda houver erro, verifique:
- ✅ Todas as 5 variáveis foram adicionadas?
- ✅ Connection string está correta?
- ✅ Tabelas foram criadas no banco?
- ✅ Fez redeploy após configurar as variáveis?

