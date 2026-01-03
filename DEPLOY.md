# Guia de Deploy - StockWave

Este guia mostra como colocar o sistema online de forma gratuita.

## 🚀 Opção 1: Vercel (Recomendado - Permanente e Gratuito)

A Vercel é a melhor opção para Next.js, criada pelos mesmos desenvolvedores do framework.

### Pré-requisitos
- Conta no GitHub (gratuita)
- Conta na Vercel (gratuita)

### Passo a Passo

1. **Fazer push do código para o GitHub:**
   ```bash
   git add .
   git commit -m "Preparar para deploy"
   git push origin main
   ```

2. **Acessar Vercel:**
   - Acesse: https://vercel.com
   - Faça login com sua conta do GitHub

3. **Importar projeto:**
   - Clique em "Add New..." → "Project"
   - Selecione seu repositório do GitHub
   - A Vercel detectará automaticamente que é um projeto Next.js

4. **Configurar variáveis de ambiente:**
   Na Vercel, adicione as seguintes variáveis de ambiente:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stockwave?schema=public
   NEXTAUTH_URL=https://seu-projeto.vercel.app
   NEXTAUTH_SECRET=seu-secret-aqui
   JWT_SECRET=seu-jwt-secret-aqui
   BARCODE_API_URL=https://api.upcitemdb.com/prod/trial/lookup
   ```

5. **Configurar banco de dados:**
   - Use um serviço gratuito como:
     - **Neon** (https://neon.tech) - PostgreSQL gratuito
     - **Supabase** (https://supabase.com) - PostgreSQL gratuito
     - **Railway** (https://railway.app) - PostgreSQL gratuito
   
   Exemplo com Neon:
   - Acesse https://neon.tech
   - Crie uma conta gratuita
   - Crie um novo projeto
   - Copie a connection string
   - Use no DATABASE_URL da Vercel

6. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Seu sistema estará disponível em: `https://seu-projeto.vercel.app`

### Vantagens do Vercel:
- ✅ Gratuito para projetos pessoais
- ✅ Deploy automático a cada push no GitHub
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Ideal para Next.js
- ✅ Domínio personalizado gratuito

---

## 🔗 Opção 2: ngrok (Rápido - Temporário)

Para testes rápidos sem fazer deploy completo.

### Instalação do ngrok

1. **Baixar ngrok:**
   - Acesse: https://ngrok.com/download
   - Baixe para Windows
   - Extraia o arquivo

2. **Criar conta gratuita:**
   - Acesse: https://dashboard.ngrok.com/signup
   - Crie uma conta gratuita
   - Copie seu authtoken da dashboard

3. **Configurar ngrok:**
   ```bash
   # No terminal, navegue até a pasta do ngrok
   ngrok config add-authtoken SEU_AUTHTOKEN_AQUI
   ```

4. **Iniciar túnel:**
   ```bash
   ngrok http 3000
   ```

5. **Usar a URL:**
   - O ngrok fornecerá uma URL como: `https://abc123.ngrok-free.app`
   - Esta URL aponta para seu `localhost:3000`
   - Compartilhe esta URL com quem quiser

### Limitações do ngrok gratuito:
- ⚠️ URL muda a cada reinício (a menos que tenha conta paga)
- ⚠️ Limite de conexões simultâneas
- ⚠️ Ideal apenas para testes temporários

---

## 🌐 Opção 3: Cloudflare Tunnel (Gratuito e Permanente)

Alternativa gratuita ao ngrok com URL mais estável.

### Instalação

1. **Baixar cloudflared:**
   - Acesse: https://github.com/cloudflare/cloudflared/releases
   - Baixe `cloudflared-windows-amd64.exe`
   - Renomeie para `cloudflared.exe`
   - Coloque em uma pasta no PATH ou use o caminho completo

2. **Iniciar túnel:**
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

3. **Usar a URL:**
   - Será fornecida uma URL como: `https://abc123.trycloudflare.com`
   - Compartilhe esta URL

### Vantagens:
- ✅ Gratuito
- ✅ Não precisa de conta
- ✅ Mais rápido que ngrok
- ⚠️ URL pode mudar ao reiniciar

---

## 📝 Recomendações

- **Para uso permanente:** Use **Vercel + Neon/Supabase**
- **Para testes rápidos:** Use **ngrok** ou **Cloudflare Tunnel**
- **Para desenvolvimento local compartilhado:** Use **ngrok**

---

## 🔧 Próximos Passos Após Deploy

1. Configure um domínio personalizado (opcional e gratuito na Vercel)
2. Configure backups automáticos do banco de dados
3. Configure monitoramento (opcional)

