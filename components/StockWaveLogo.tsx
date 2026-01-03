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
  const sizeDimensions = {
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 53 },
    lg: { width: 200, height: 67 },
    xl: { width: 240, height: 80 }
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  const dimensions = sizeDimensions[size]
  const textSize = textSizeClasses[size]

  // Se for apenas ícone, usar dimensões quadradas menores
  if (variant === 'icon-only') {
    const iconSize = size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64
    return (
      <div className={className}>
        <Image
          src="/logo/Logo StockWave.png"
          alt="StockWave"
          width={iconSize}
          height={iconSize}
          className="object-contain"
          priority
        />
      </div>
    )
  }

  // Logo completa (com texto)
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo/Logo StockWave.png"
        alt="StockWave"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain"
        priority
      />
    </div>
  )
}

