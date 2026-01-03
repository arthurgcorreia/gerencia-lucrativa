'use client'

import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface NotificationProps {
  message: string
  show: boolean
  onClose: () => void
  duration?: number
}

export default function Notification({ message, show, onClose, duration = 3000 }: NotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  if (!show) return null

  return (
    <div className="fixed top-4 right-2 md:right-4 left-2 md:left-auto z-50 transform transition-all duration-300 ease-out">
      <div className="bg-white rounded-xl shadow-2xl border border-green-200 p-3 md:p-4 flex items-center gap-2 md:gap-3 max-w-md mx-auto">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-semibold">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
