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
      {/* Logo Icon - Wave + Box representing stock flow */}
      {(variant === 'full' || variant === 'icon-only') && (
        <svg
          className={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Stock Box (representing inventory) */}
          <rect
            x="12"
            y="20"
            width="20"
            height="20"
            rx="3"
            fill="url(#waveGradient)"
            opacity="0.9"
          />
          
          {/* Wave 1 - Flowing from box */}
          <path
            d="M 32 30 Q 40 25 48 30 T 56 30"
            stroke="url(#waveGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Wave 2 - Secondary wave */}
          <path
            d="M 32 35 Q 38 32 44 35 T 50 35"
            stroke="url(#waveGradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          
          {/* Wave 3 - Tertiary wave */}
          <path
            d="M 32 40 Q 36 38 40 40 T 44 40"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          
          {/* Small dots representing data points/flow */}
          <circle cx="36" cy="30" r="2" fill="#60a5fa" />
          <circle cx="44" cy="30" r="2" fill="#60a5fa" />
          <circle cx="52" cy="30" r="2" fill="#60a5fa" />
        </svg>
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

