# Comandos para Configuração Inicial

Execute os comandos abaixo na ordem apresentada:

## 1. Instalar Dependências (se ainda não instalou)
```bash
npm install
```

## 2. Criar arquivo .env
Crie um arquivo `.env` na raiz do projeto com:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gerenciamento_lucrativo?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-key-aqui-mude-para-algo-aleatorio"
JWT_SECRET="seu-jwt-secret-key-aqui-mude-para-algo-aleatorio"
BARCODE_API_URL="https://api.upcitemdb.com/prod/trial/lookup"
```

**Importante**: Altere NEXTAUTH_SECRET e JWT_SECRET para valores aleatórios!

## 3. Iniciar PostgreSQL com Docker
```bash
docker-compose up -d
```

## 4. Gerar Prisma Client
```bash
npm run prisma:generate
```

## 5. Criar Tabelas no Banco (Migração)
```bash
npm run prisma:migrate
```
Quando solicitado, dê um nome à migração (ex: `init`)

## 6. Iniciar o Servidor
```bash
npm run dev
```

## 7. Acessar no Navegador
Abra: http://localhost:3000

---

## Comandos Úteis

### Parar o servidor
`Ctrl + C` no terminal

### Parar o banco de dados
```bash
docker-compose down
```

### Reiniciar o banco
```bash
docker-compose restart
```

### Ver logs do banco
```bash
docker-compose logs postgres
```

### Abrir Prisma Studio (visualizar banco)
```bash
npm run prisma:studio
```

### Verificar se Docker está rodando
```bash
docker ps
```

