# 🚀 Configuração do Repositório GitHub - GerenciaLucrativa

Siga estes passos para criar o repositório no GitHub e fazer o push do código.

## 📝 Passo 1: Criar Repositório no GitHub

1. Acesse: **https://github.com/new**
2. **Nome do repositório:** `gerencia-lucrativa`
3. **Descrição (opcional):** "Sistema de Gestão de Estoque e Vendas"
4. Escolha: **Público** ou **Privado** (conforme sua preferência)
5. **NÃO** marque nenhuma opção:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. Clique em **"Create repository"**

## 🔗 Passo 2: Conectar ao Repositório Remoto

Após criar o repositório no GitHub, execute os comandos abaixo no terminal do projeto:

```bash
# Adicionar o remote (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/gerencia-lucrativa.git

# Verificar se foi adicionado corretamente
git remote -v
```

**Exemplo:** Se seu usuário for `arthur`, o comando seria:
```bash
git remote add origin https://github.com/arthur/gerencia-lucrativa.git
```

## 📤 Passo 3: Fazer Push do Código para a Branch Master

```bash
# Fazer push da branch master para o GitHub
git push -u origin master
```

**Nota:** Se sua branch principal se chama `main` ao invés de `master`, use:
```bash
git push -u origin main
```

## 🌿 Passo 4: Criar Branches (Opcional)

Para trabalhar com branches por feature (seguindo o padrão do projeto):

```bash
# Criar uma branch de exemplo (opcional)
git checkout -b develop

# Voltar para master
git checkout master

# Fazer push de todas as branches (quando tiver)
git push --all origin
```

## ✅ Verificação

Após o push, acesse seu repositório no GitHub:
- **URL:** `https://github.com/SEU_USUARIO/gerencia-lucrativa`

Você deve ver todos os arquivos do projeto, incluindo:
- ✅ Código fonte
- ✅ README.md
- ✅ DEPLOY.md
- ✅ .gitignore (arquivos sensíveis serão ignorados)
- ❌ .env (não será enviado - está no .gitignore)
- ❌ node_modules (não será enviado - está no .gitignore)

## 🚀 Próximo Passo: Deploy no Vercel

Após o código estar no GitHub, você pode fazer deploy no Vercel:

1. Acesse: **https://vercel.com**
2. Faça login com sua conta do GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Selecione o repositório `gerencia-lucrativa`
5. A Vercel detectará automaticamente que é um projeto Next.js
6. Configure as variáveis de ambiente (veja DEPLOY.md)
7. Clique em **"Deploy"**

Consulte o arquivo **DEPLOY.md** para instruções detalhadas do deploy na Vercel.

## 📋 Checklist

- [ ] Repositório criado no GitHub
- [ ] Remote adicionado (`git remote add origin`)
- [ ] Push realizado (`git push -u origin master`)
- [ ] Código visível no GitHub
- [ ] Pronto para deploy no Vercel
