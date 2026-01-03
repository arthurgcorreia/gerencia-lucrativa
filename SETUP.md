# Guia de Configuração Passo a Passo

Este documento fornece instruções detalhadas para configurar o sistema StockWave.

## 📋 Pré-requisitos

Certifique-se de ter instalado:
- **Node.js** versão 18 ou superior ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** (opcional, para controle de versão)

## 🚀 Passo a Passo

### Passo 1: Verificar Instalações

Abra o terminal (PowerShell no Windows, Terminal no Mac/Linux) e verifique:

```bash
node --version
# Deve mostrar v18.x.x ou superior

npm --version
# Deve mostrar a versão do npm

docker --version
# Deve mostrar a versão do Docker
```

Se algum comando não funcionar, instale o software correspondente.

### Passo 2: Instalar Dependências

No diretório do projeto, execute:

```bash
npm install
```

Isso instalará todas as dependências necessárias. Pode levar alguns minutos.

### Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stockwave?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-key-aletorio-aqui-123456789"
JWT_SECRET="seu-jwt-secret-key-aletorio-aqui-987654321"

# Barcode API (opcional)
BARCODE_API_URL="https://api.upcitemdb.com/prod/trial/lookup"
```

**⚠️ IMPORTANTE**: 
- Altere `NEXTAUTH_SECRET` e `JWT_SECRET` para strings aleatórias seguras
- Você pode gerar strings aleatórias em: https://generate-secret.vercel.app/32

### Passo 4: Iniciar o Banco de Dados

Inicie o PostgreSQL usando Docker:

```bash
docker-compose up -d
```

Isso iniciará o container do PostgreSQL em segundo plano.

**Verificar se está rodando:**
```bash
docker ps
```

Você deve ver um container chamado `stockwave_db` na lista.

### Passo 5: Gerar Prisma Client

```bash
npm run prisma:generate
```

Este comando gera o cliente Prisma baseado no schema do banco de dados.

### Passo 6: Criar as Tabelas do Banco de Dados

Execute a migração inicial:

```bash
npm run prisma:migrate
```

Quando solicitado, dê um nome à migração (ex: `init` ou `initial_setup`).

Isso criará todas as tabelas necessárias no banco de dados.

### Passo 7: Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Aguarde até ver a mensagem:
```
✓ Ready on http://localhost:3000
```

### Passo 8: Acessar o Sistema

Abra seu navegador e acesse:
```
http://localhost:3000
```

## ✅ Verificação

1. Você deve ver a página inicial (landing page) do sistema
2. Clique em "Criar conta" ou "Começar"
3. Crie uma conta de teste
4. Complete o onboarding
5. Você será redirecionado para o dashboard

## 🔧 Comandos Úteis

### Parar o servidor
No terminal onde o servidor está rodando, pressione `Ctrl + C`

### Parar o banco de dados
```bash
docker-compose down
```

### Reiniciar o banco de dados
```bash
docker-compose restart
```

### Ver logs do banco de dados
```bash
docker-compose logs postgres
```

### Abrir Prisma Studio (interface visual do banco)
```bash
npm run prisma:studio
```

Isso abrirá uma interface web em `http://localhost:5555` para visualizar e editar dados do banco.

## 🐛 Resolução de Problemas

### Erro: "Cannot connect to database"
- Verifique se o Docker está rodando: `docker ps`
- Verifique se o container está ativo: `docker-compose ps`
- Reinicie o container: `docker-compose restart`

### Erro: "Port 3000 is already in use"
- Pare o processo que está usando a porta 3000
- Ou altere a porta no `package.json` (adicionar `-p 3001` no script `dev`)

### Erro: "Prisma schema validation"
- Verifique se executou `npm run prisma:generate`
- Verifique se o arquivo `.env` está configurado corretamente

### Erro: "Migration failed"
- Verifique a conexão com o banco
- Tente resetar: `npx prisma migrate reset` (⚠️ apaga todos os dados)

### Container não inicia
- Verifique se a porta 5432 está livre
- Tente: `docker-compose down` e depois `docker-compose up -d`

## 📝 Próximos Passos

Após a configuração bem-sucedida:
1. Explore o dashboard
2. Cadastre alguns produtos
3. Realize vendas de teste
4. Visualize os gráficos e relatórios

## 🆘 Precisa de Ajuda?

Se encontrar problemas:
1. Verifique os logs do terminal
2. Verifique os logs do Docker: `docker-compose logs`
3. Consulte o README.md para mais informações

