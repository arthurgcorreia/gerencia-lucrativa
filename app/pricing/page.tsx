'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Check, 
  X, 
  Zap, 
  Shield, 
  BarChart3, 
  Package,
  Store,
  ArrowRight,
  Sparkles,
  CreditCard
} from 'lucide-react'

interface Plan {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  duration: number
  features: string[]
  isPopular: boolean
  isActive: boolean
}

export default function PricingPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'debit_card' | 'pix' | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = async (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    if (!plan) return

    // Se for plano gratuito, processar diretamente
    if (plan.price === 0) {
      try {
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: plan.id,
            paymentMethod: 'free',
          }),
        })

        if (response.ok) {
          router.push('/dashboard')
        } else {
          const error = await response.json()
          alert(error.error || 'Erro ao processar plano gratuito')
        }
      } catch (error) {
        console.error('Error processing free plan:', error)
        alert('Erro ao processar plano gratuito')
      }
      return
    }

    // Para planos pagos, mostrar modal de pagamento
    setSelectedPlan(planId)
  }

  const handlePayment = async () => {
    if (!selectedPlan || !paymentMethod) {
      alert('Selecione um método de pagamento')
      return
    }

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          paymentMethod: paymentMethod,
        }),
      })

      if (response.ok) {
        // Em produção, aqui você redirecionaria para o gateway de pagamento
        // Por enquanto, apenas simulamos o pagamento
        alert('Pagamento processado com sucesso! (Simulado)')
        router.push('/dashboard')
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao processar pagamento')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Erro ao processar pagamento')
    } finally {
      setSelectedPlan(null)
      setPaymentMethod(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-blue-600 text-xl">Carregando planos...</div>
      </div>
    )
  }

  const selectedPlanData = plans.find(p => p.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Store className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">StockWave</span>
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Já tem conta? Entrar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Escolha o plano ideal para seu negócio</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Planos e Preços
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta às necessidades do seu negócio
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-12 px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.isPopular
                    ? 'border-4 border-blue-600 ring-4 ring-blue-100 scale-105'
                    : 'border-2 border-gray-200'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  )}
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 text-lg">/mês</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Válido por {plan.duration} dias
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedPlan && selectedPlanData && selectedPlanData.price > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Finalizar Pagamento</h2>
              <button
                onClick={() => {
                  setSelectedPlan(null)
                  setPaymentMethod(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="text-sm text-gray-600 mb-1">Plano selecionado</div>
                <div className="text-xl font-bold text-gray-900">{selectedPlanData.name}</div>
                <div className="text-2xl font-bold text-blue-600 mt-2">
                  R$ {selectedPlanData.price.toFixed(2)}/mês
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pagamento
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === 'credit_card'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Cartão de Crédito</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('debit_card')}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === 'debit_card'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Cartão de Débito</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === 'pix'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">PIX</span>
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                <strong>Nota:</strong> Esta é uma simulação. Em produção, você será redirecionado para um gateway de pagamento real.
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedPlan(null)
                  setPaymentMethod(null)
                }}
                className="flex-1 py-3 px-6 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePayment}
                disabled={!paymentMethod}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pagar R$ {selectedPlanData.price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Store className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">StockWave</span>
          </div>
          <p className="text-gray-400">
            © 2024 StockWave. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

