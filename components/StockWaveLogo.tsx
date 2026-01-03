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
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-14 w-auto',
    xl: 'h-16 w-auto'
  }

  const iconSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const sizeClass = sizeClasses[size]
  const iconSizeClass = iconSizeClasses[size]

  // Se for apenas ícone
  if (variant === 'icon-only') {
    return (
      <div className={className}>
        <img
          src="/logo/Logo%20StockWave.png"
          alt="StockWave"
          className={iconSizeClass + ' object-contain'}
        />
      </div>
    )
  }

  // Logo completa (com texto)
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo/Logo%20StockWave.png"
        alt="StockWave"
        className={sizeClass + ' object-contain'}
      />
    </div>
  )
}

