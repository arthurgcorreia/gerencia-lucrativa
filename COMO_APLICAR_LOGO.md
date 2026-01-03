# 📸 Como Aplicar a Logo Gerada no StockWave

## 📁 Onde Colocar os Arquivos da Logo

### Estrutura de Pastas Recomendada:

```
gerenciamentoLucrativo/
├── public/
│   ├── logo/
│   │   ├── stockwave-logo.svg          (Logo completa - ícone + texto)
│   │   ├── stockwave-icon.svg          (Apenas ícone)
│   │   ├── stockwave-logo.png          (Logo completa PNG - alta resolução)
│   │   ├── stockwave-icon.png          (Ícone PNG)
│   │   ├── favicon.ico                 (Favicon para navegador)
│   │   └── favicon.png                 (Favicon PNG - múltiplos tamanhos)
```

## 🚀 Passo a Passo para Aplicar a Logo

### Opção 1: Substituir a Logo SVG Inline (Recomendado)

1. **Colocar os arquivos SVG na pasta `public/logo/`:**
   ```
   public/
   └── logo/
       ├── stockwave-logo.svg      (Logo completa)
       └── stockwave-icon.svg      (Apenas ícone)
   ```

2. **Atualizar o componente `components/StockWaveLogo.tsx`:**

   Substituir o SVG inline por uma tag `<img>` ou `<Image>` do Next.js:

   ```tsx
   'use client'

   import Image from 'next/image'

   interface StockWaveLogoProps {
     className?: string
     size?: 'sm' | 'md' | 'lg' | 'xl'
     showText?: boolean
     variant?: 'full' | 'icon-only' | 'text-only'
   }

   export default function StockWaveLogo({ 
     className = '', 
     size = 'md',
     showText = true,
     variant = 'full'
   }: StockWaveLogoProps) {
     const sizeClasses = {
       sm: 'w-6 h-6',
       md: 'w-8 h-8',
       lg: 'w-12 h-12',
       xl: 'w-16 h-16'
     }

     const textSizeClasses = {
       sm: 'text-lg',
       md: 'text-xl',
       lg: 'text-2xl',
       xl: 'text-3xl'
     }

     const iconSize = sizeClasses[size]
     const textSize = textSizeClasses[size]

     return (
       <div className={`flex items-center gap-2 ${className}`}>
         {/* Logo Icon */}
         {(variant === 'full' || variant === 'icon-only') && (
           <Image
             src="/logo/stockwave-icon.svg"
             alt="StockWave"
             width={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
             height={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
             className={iconSize}
             priority
           />
         )}

         {/* Logo Text */}
         {(variant === 'full' || variant === 'text-only') && showText && (
           <span className={`font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent ${textSize}`}>
             StockWave
           </span>
         )}
       </div>
     )
   }
   ```

### Opção 2: Usar Logo Completa (Ícone + Texto Integrado)

Se a logo gerada já incluir o texto integrado ao ícone:

```tsx
'use client'

import Image from 'next/image'

interface StockWaveLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon-only'
}

export default function StockWaveLogo({ 
  className = '', 
  size = 'md',
  variant = 'full'
}: StockWaveLogoProps) {
  const sizeClasses = {
    sm: { width: 100, height: 32 },
    md: { width: 140, height: 45 },
    lg: { width: 180, height: 58 },
    xl: { width: 220, height: 70 }
  }

  const dimensions = sizeClasses[size]

  if (variant === 'icon-only') {
    return (
      <Image
        src="/logo/stockwave-icon.svg"
        alt="StockWave"
        width={dimensions.height}
        height={dimensions.height}
        className={className}
        priority
      />
    )
  }

  return (
    <Image
      src="/logo/stockwave-logo.svg"
      alt="StockWave"
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      priority
    />
  )
}
```

### Opção 3: Manter SVG Inline (Se a logo for simples)

Se preferir manter como SVG inline, você pode copiar o código SVG gerado diretamente no componente:

1. Abra o arquivo SVG gerado em um editor de texto
2. Copie o conteúdo entre as tags `<svg>...</svg>`
3. Cole no componente `StockWaveLogo.tsx` substituindo o SVG atual

## 🔄 Configurar Favicon

1. **Colocar favicon na pasta `public/`:**
   ```
   public/
   └── favicon.ico
   ```

2. **Atualizar `app/layout.tsx` (se necessário):**
   ```tsx
   export const metadata: Metadata = {
     title: "StockWave - Sistema de Gestão de Estoque",
     description: "Sistema completo de gerenciamento de estoque e vendas",
     icons: {
       icon: '/favicon.ico',
     },
   }
   ```

## 📝 Checklist de Aplicação

- [ ] Criar pasta `public/logo/` (se não existir)
- [ ] Copiar arquivos SVG/PNG da logo para `public/logo/`
- [ ] Atualizar componente `components/StockWaveLogo.tsx`
- [ ] Testar a logo em diferentes tamanhos
- [ ] Verificar se funciona em fundo claro e escuro
- [ ] Configurar favicon (`public/favicon.ico`)
- [ ] Testar em diferentes páginas (landing, login, dashboard)
- [ ] Verificar responsividade em mobile

## 🎨 Formatos de Arquivo Recomendados

- **SVG** (preferencial): Escalável, qualidade perfeita, leve
- **PNG**: Para casos específicos (alta resolução, transparência)
- **ICO**: Para favicon (navegadores)
- **Tamanhos recomendados:**
  - Logo completa: 200-300px de largura
  - Ícone apenas: 64x64px ou 128x128px
  - Favicon: 32x32px e 16x16px

## 🔍 Verificação Final

Após aplicar, verifique:

1. ✅ Logo aparece corretamente na landing page (`/`)
2. ✅ Logo aparece no header do dashboard
3. ✅ Logo aparece nas páginas de login/registro
4. ✅ Logo mantém qualidade em diferentes tamanhos
5. ✅ Logo funciona em fundo branco e escuro
6. ✅ Favicon aparece na aba do navegador

## 📍 Localização dos Arquivos Atuais

- **Componente da Logo:** `components/StockWaveLogo.tsx`
- **Layout Principal:** `app/layout.tsx` (favicon)
- **Páginas que usam a logo:**
  - `app/page.tsx` (landing)
  - `app/login/page.tsx`
  - `app/register/page.tsx`
  - `app/pricing/page.tsx`
  - `components/DashboardLayout.tsx` (sidebar)

