'use client'

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
    sm: 'h-10 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto'
  }

  const iconSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-18 w-18'
  }

  const sizeClass = sizeClasses[size]
  const iconSizeClass = iconSizeClasses[size]

  // Se for apenas ícone
  if (variant === 'icon-only') {
    return (
      <div className={className}>
        <img
          src="/logo/Logo StockWave.png"
          alt="StockWave"
          className={iconSizeClass + ' object-contain'}
          style={{ mixBlendMode: 'normal' }}
        />
      </div>
    )
  }

  // Logo completa (com texto)
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo/Logo StockWave.png"
        alt="StockWave"
        className={sizeClass + ' object-contain'}
        style={{ mixBlendMode: 'normal' }}
      />
    </div>
  )
}

