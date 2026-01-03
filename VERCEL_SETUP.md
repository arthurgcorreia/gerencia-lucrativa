# 🚀 Configuração na Vercel - Passo a Passo

Guia completo para configurar as variáveis de ambiente na Vercel e fazer deploy com sucesso.

## ⚠️ Erro Comum: DATABASE_URL not set

Se você está recebendo o erro `DATABASE_URL environment variable is not set`, siga os passos abaixo.

## 📋 Passo 1: Obter Banco de Dados PostgreSQL Gratuito

Você precisa de um banco PostgreSQL na nuvem. Opções gratuitas:

### Opção 1: Neon (Recomendado - Mais Fácil)

1. Acesse: https://neon.tech
2. Clique em **"Sign Up"** (pode usar GitHub)
3. Clique em **"Create a project"**
4. Escolha um nome (ex: `gerencia-lucrativa`)
5. Selecione a região mais próxima (ex: `US East`)
6. Clique em **"Create project"**
7. Após criar, você verá a connection string
8. **Copie a connection string** (ela começa com `postgresql://...`)

### Opção 2: Supabase

1. Acesse: https://supabase.com
2. Faça login (pode usar GitHub)
3. Clique em **"New Project"**
4. Preencha os dados
5. Aguarde o projeto ser criado
6. Vá em **Settings** → **Database**
7. Copie a **Connection string** (URI)

## 🔧 Passo 2: Configurar Variáveis de Ambiente na Vercel

1. Acesse seu projeto na Vercel: https://vercel.com/dashboard
2. Clique no projeto `gerencia-lucrativa`
3. Vá em **Settings** (Configurações)
4. Clique em **Environment Variables** (Variáveis de Ambiente)
5. Adicione as seguintes variáveis:

### Variáveis Obrigatórias:

| Nome | Valor | Observação |
|------|-------|------------|
| `DATABASE_URL` | `postgresql://...` | Cole a connection string do Neon/Supabase |
| `NEXTAUTH_URL` | `https://seu-projeto.vercel.app` | Será preenchido automaticamente, ou use seu domínio |
| `NEXTAUTH_SECRET` | `string-aleatoria-segura` | Gere em: https://generate-secret.vercel.app/32 |
| `JWT_SECRET` | `string-aleatoria-segura` | Gere em: https://generate-secret.vercel.app/32 |
| `BARCODE_API_URL` | `https://api.upcitemdb.com/prod/trial/lookup` | Fixo |

### Como Gerar Secrets Aleatórios:

1. Acesse: https://generate-secret.vercel.app/32
2. Gere duas strings diferentes:
   - Uma para `NEXTAUTH_SECRET`
   - Uma para `JWT_SECRET`
3. Copie e cole nas variáveis de ambiente

### Configuração das Variáveis:

Para cada variável:
- **Key (Chave):** Nome da variável (ex: `DATABASE_URL`)
- **Value (Valor):** O valor correspondente
- **Environment:** Selecione todas as opções:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

6. Clique em **Save** (Salvar) para cada variável

## 🗄️ Passo 3: Criar Tabelas no Banco de Dados

Após configurar as variáveis, você precisa criar as tabelas no banco:

### Opção A: Via Prisma Studio (Local)

1. Configure `.env` local com a mesma `DATABASE_URL` do Neon/Supabase
2. Execute:
   ```bash
   npm run prisma:migrate
   ```
3. Quando solicitado, dê um nome à migração (ex: `init`)

### Opção B: Via Terminal Neon/Supabase

Alguns serviços oferecem SQL Editor online onde você pode executar comandos SQL.

## 🔄 Passo 4: Fazer Deploy Novamente

1. Na Vercel, vá em **Deployments**
2. Clique nos **3 pontos** do último deployment
3. Selecione **Redeploy**
4. Ou faça um novo push no GitHub (a Vercel fará deploy automático)

## ✅ Verificação

Após o deploy:
1. Acesse a URL do seu projeto (ex: `https://gerencia-lucrativa.vercel.app`)
2. A página inicial deve carregar
3. Tente criar uma conta
4. Se funcionar, está tudo configurado!

## 🐛 Resolução de Problemas

### Erro: "DATABASE_URL environment variable is not set"

- ✅ Verifique se adicionou `DATABASE_URL` nas variáveis de ambiente
- ✅ Verifique se selecionou todos os ambientes (Production, Preview, Development)
- ✅ Faça redeploy após adicionar as variáveis

### Erro: "Connection refused" ou "Cannot connect to database"

- ✅ Verifique se a connection string está correta
- ✅ Verifique se o banco de dados está ativo no Neon/Supabase
- ✅ Verifique se as tabelas foram criadas (execute migrações)

### Erro: "Migration not found"

- ✅ Execute `npm run prisma:migrate` localmente com a connection string do Neon/Supabase
- ✅ Ou use o Prisma Studio para criar as tabelas

## 📝 Checklist

- [ ] Banco de dados criado no Neon/Supabase
- [ ] Connection string copiada
- [ ] Variáveis de ambiente configuradas na Vercel:
  - [ ] DATABASE_URL
  - [ ] NEXTAUTH_URL
  - [ ] NEXTAUTH_SECRET
  - [ ] JWT_SECRET
  - [ ] BARCODE_API_URL
- [ ] Migrações executadas (tabelas criadas)
- [ ] Deploy realizado
- [ ] Sistema funcionando

