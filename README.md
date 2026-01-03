# GerenciaLucrativa - Sistema de Gestão de Estoque e Vendas

Sistema completo de gerenciamento de estoque e vendas com interface moderna e intuitiva.

## 🚀 Funcionalidades

- ✅ **Gestão de Estoque**: Controle completo de produtos com código de barras
- ✅ **Sistema de Vendas**: Vendas rápidas com leitura de código de barras
- ✅ **Dashboard Analytics**: Gráficos e relatórios visuais
- ✅ **Alertas de Estoque Baixo**: Notificações automáticas
- ✅ **Onboarding**: Configuração inicial guiada
- ✅ **Interface Moderna**: Design responsivo e intuitivo

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Docker e Docker Compose instalados
- npm ou yarn

## 🛠️ Instalação e Configuração

### Passo 1: Instalar Dependências

```bash
npm install
```

### Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (copie o `.env.example` se existir):

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gerenciamento_lucrativo?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-key-aqui-mude-em-producao"

# JWT
JWT_SECRET="seu-jwt-secret-key-aqui-mude-em-producao"

# Barcode API (opcional)
BARCODE_API_URL="https://api.upcitemdb.com/prod/trial/lookup"
```

**⚠️ IMPORTANTE**: Altere os valores de `NEXTAUTH_SECRET` e `JWT_SECRET` para valores aleatórios seguros em produção!

### Passo 3: Iniciar o Banco de Dados com Docker

```bash
docker-compose up -d
```

Isso irá iniciar um container PostgreSQL na porta 5432.

### Passo 4: Gerar o Prisma Client e Executar Migrações

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Criar e aplicar as migrações do banco de dados
npm run prisma:migrate
```

Quando executar `prisma:migrate`, você será solicitado a dar um nome à migração. Digite algo como `init` ou `initial_migration`.

### Passo 5: Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em [http://localhost:3000](http://localhost:3000)

## 📚 Comandos Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run prisma:generate` - Gera o Prisma Client
- `npm run prisma:migrate` - Cria e aplica migrações
- `npm run prisma:studio` - Abre o Prisma Studio (interface visual do banco)

## 🌐 Deploy e Compartilhamento

Para colocar o sistema online gratuitamente, consulte o arquivo [DEPLOY.md](./DEPLOY.md) que contém instruções detalhadas para:

- **Vercel** (Recomendado - Permanente e gratuito)
- **ngrok** (Rápido - Temporário)
- **Cloudflare Tunnel** (Gratuito)

Todas as opções são gratuitas e fáceis de configurar!

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza PostgreSQL com Prisma ORM. As principais tabelas são:

- **User**: Usuários do sistema
- **Product**: Produtos cadastrados
- **Sale**: Vendas realizadas
- **SaleItem**: Itens de cada venda

## 🔐 Autenticação

O sistema utiliza autenticação baseada em JWT com cookies HTTP-only para segurança.

## 🎨 Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Docker** - Containerização do banco
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones

## 📱 Uso do Sistema

1. **Registro/Login**: Crie uma conta ou faça login
2. **Onboarding**: Complete o cadastro inicial (nome da loja e nicho)
3. **Dashboard**: Visualize estatísticas e gráficos
4. **Estoque**: Cadastre produtos com código de barras
5. **Vendas**: Realize vendas escaneando códigos de barras

## 🔧 Resolução de Problemas

### Erro ao conectar com o banco de dados

- Verifique se o Docker está rodando: `docker ps`
- Verifique se o container está ativo: `docker-compose ps`
- Verifique a string de conexão no `.env`

### Erro de migração do Prisma

- Certifique-se de que o banco está rodando
- Tente resetar o banco: `npx prisma migrate reset` (⚠️ apaga todos os dados)

### Porta 3000 já em uso

- Altere a porta no `package.json` ou pare o processo que está usando a porta

## 📝 Notas

- A integração com API de código de barras é opcional e usa uma API pública gratuita (UPCItemDB)
- Para produção, configure variáveis de ambiente adequadas
- O sistema está preparado para ser empacotado como aplicativo desktop (com Electron, por exemplo)

## 📄 Licença

Este projeto é de uso interno.

