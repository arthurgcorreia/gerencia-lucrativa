'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { X, Camera } from 'lucide-react'

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (barcode: string) => void
}

export default function BarcodeScanner({ isOpen, onClose, onScan }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && !scannerRef.current && !scanning) {
      startScanning()
    }

    if (!isOpen && scannerRef.current) {
      stopScanning()
    }

    return () => {
      // Cleanup apenas quando o componente desmonta ou fecha
      if (scannerRef.current) {
        stopScanning()
      }
    }
  }, [isOpen])

  const startScanning = async () => {
    try {
      setError(null)
      
      // Garante que não há scanner ativo
      if (scannerRef.current) {
        await stopScanning()
      }

      const scanner = new Html5Qrcode('barcode-scanner')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' }, // Usa a câmera traseira
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Código escaneado com sucesso
          onScan(decodedText)
          stopScanning().then(() => {
            onClose()
          })
        },
        () => {
          // Ignora erros de leitura (continua tentando)
        }
      )

      setScanning(true)
    } catch (err: any) {
      console.error('Error starting scanner:', err)
      setError(err.message || 'Erro ao iniciar a câmera')
      setScanning(false)
      scannerRef.current = null
    }
  }

  const stopScanning = async (): Promise<void> => {
    if (!scannerRef.current) {
      setScanning(false)
      return Promise.resolve()
    }

    const scanner = scannerRef.current
    scannerRef.current = null // Remove referência antes para evitar múltiplas chamadas

    try {
      await scanner.stop()
      scanner.clear()
      setScanning(false)
    } catch (err: any) {
      // Ignora erros ao parar scanner (já estava parado ou não iniciado)
      const errorMessage = err?.message || err?.toString() || ''
      if (!errorMessage.includes('not running') && !errorMessage.includes('not started')) {
        console.error('Error stopping scanner:', err)
      }
      // Tenta limpar mesmo se houver erro
      try {
        scanner.clear()
      } catch (clearErr) {
        // Ignora erro de clear
      }
      setScanning(false)
    }
  }

  const handleClose = async () => {
    try {
      stopScanning()
    } catch (error) {
      // Ignora erros ao fechar
      console.log('Scanner cleanup:', error)
    } finally {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Escanear Código de Barras</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={startScanning}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                id="barcode-scanner"
                className="w-full rounded-lg overflow-hidden bg-gray-900"
                style={{ minHeight: '300px' }}
              />
              <p className="text-sm text-gray-600 text-center">
                Posicione o código de barras dentro da área de leitura
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

