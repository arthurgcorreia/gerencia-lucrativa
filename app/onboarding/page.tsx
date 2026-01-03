'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Store, Package, TrendingUp, ArrowRight, ArrowLeft, Check } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [storeName, setStoreName] = useState('')
  const [niche, setNiche] = useState('')
  const [loading, setLoading] = useState(false)

  const niches = [
    { value: 'alimentos', label: '🍔 Alimentos e Bebidas', emoji: '🍔' },
    { value: 'vestuario', label: '👕 Vestuário e Moda', emoji: '👕' },
    { value: 'eletronicos', label: '📱 Eletrônicos', emoji: '📱' },
    { value: 'cosmeticos', label: '💄 Cosméticos', emoji: '💄' },
    { value: 'casa', label: '🏠 Casa e Decoração', emoji: '🏠' },
    { value: 'livros', label: '📚 Livros e Papelaria', emoji: '📚' },
    { value: 'esportes', label: '⚽ Esportes', emoji: '⚽' },
    { value: 'outros', label: '🛍️ Outros', emoji: '🛍️' },
  ]

  const handleComplete = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeName, niche }),
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Passo {step} de 2</span>
              <span className="text-sm font-medium text-blue-600">{Math.round((step / 2) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Store Name */}
          {step === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-6">🏪</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Qual o nome da sua loja?
              </h2>
              <p className="text-gray-600 mb-8">
                Vamos personalizar sua experiência com o nome do seu negócio
              </p>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Minha Loja Incrível"
                autoFocus
              />
              <button
                onClick={() => storeName && setStep(2)}
                disabled={!storeName}
                className="mt-6 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Niche */}
          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Qual o nicho do seu negócio?
                </h2>
                <p className="text-gray-600">
                  Isso nos ajuda a personalizar recomendações para você
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {niches.map((nicheOption) => (
                  <button
                    key={nicheOption.value}
                    onClick={() => setNiche(nicheOption.value)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      niche === nicheOption.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{nicheOption.emoji}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {nicheOption.label.split(' ').slice(1).join(' ')}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!niche || loading}
                  className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Finalizando...' : (
                    <>
                      Finalizar
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Welcome Message */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-start gap-4">
              <div className="text-3xl">✨</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bem-vindo ao StockWave!</h3>
                <p className="text-sm text-gray-600">
                  Após completar o onboarding, você poderá começar a registrar produtos, 
                  gerenciar seu estoque e realizar vendas de forma eficiente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

