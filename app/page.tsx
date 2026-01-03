'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Store, 
  Package, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Shield, 
  Download,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Sparkles,
  X,
  Check
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

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchPlans = async () => {
    setLoadingPlans(true)
    try {
      const response = await fetch('/api/plans')
      if (response.ok) {
        const data = await response.json()
        // Filtrar os 3 planos: Básico, Ultra, Basic+ (professional)
        const filteredPlans = data
          .filter((plan: Plan) => plan.slug === 'basic' || plan.slug === 'ultra' || plan.slug === 'professional')
          .map((plan: Plan) => {
            // Renomear professional para Basic+
            if (plan.slug === 'professional') {
              return { ...plan, name: 'Basic+' }
            }
            return plan
          })
          .sort((a: Plan, b: Plan) => {
            // Ordenar: Basic, Basic+, Ultra
            const order: Record<string, number> = { basic: 0, professional: 1, ultra: 2 }
            return (order[a.slug] || 999) - (order[b.slug] || 999)
          })
        setPlans(filteredPlans)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoadingPlans(false)
    }
  }

  const handleOpenPricingModal = () => {
    setShowPricingModal(true)
    if (plans.length === 0) {
      fetchPlans()
    }
  }

  const handleSelectPlan = (planSlug: string) => {
    // Redirecionar para registro com o plano selecionado
    window.location.href = `/register?plan=${planSlug}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-blue-100 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-shrink">
            <Store className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0 animate-pulse" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 truncate">GerenciaLucrativa</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
            <Link 
              href="/login" 
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              Entrar
            </Link>
            <Link 
              href="/register"
              className="px-4 py-1.5 sm:px-5 md:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-medium text-sm sm:text-base whitespace-nowrap shadow-lg"
            >
              Começar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 z-10">
        <div className="container mx-auto text-center">
          {/* Badge with animation */}
          <div className={`inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium shadow-lg transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <Rocket className="w-4 h-4 animate-bounce" />
            <span>Sistema de Gestão Inteligente</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>

          {/* Main Heading with animation */}
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight transform transition-all duration-1000 delay-150 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Gerencie seu Estoque de Forma
            <span className="text-blue-600 block mt-2 relative inline-block">
              Inteligente e Lucrativa
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 rounded-full blur-sm animate-pulse"></span>
            </span>
          </h1>

          {/* Description with animation */}
          <p className={`text-xl text-gray-600 mb-10 max-w-2xl mx-auto transform transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Controle total sobre seus produtos, vendas e estoque. 
            Tudo em um só lugar, de forma simples e eficiente.
          </p>

          {/* CTA Buttons with animation */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transform transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link 
              href="/register"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-110 hover:shadow-2xl font-semibold text-lg flex items-center gap-2 shadow-lg"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={handleOpenPricingModal}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl border-2 border-blue-600 hover:bg-blue-50 hover:border-blue-700 transition-all transform hover:scale-105 font-semibold text-lg flex items-center gap-2 shadow-md"
            >
              Ver Planos
            </button>
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl border-2 border-blue-600 hover:bg-blue-50 hover:border-blue-700 transition-all transform hover:scale-105 font-semibold text-lg flex items-center gap-2 shadow-md">
              <Download className="w-5 h-5" />
              Baixar Aplicativo
            </button>
          </div>

          {/* Floating Icons */}
          <div className="mt-20 relative h-64 overflow-hidden">
            <div className="absolute top-0 left-1/4 animate-float">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-blue-100">
                <Package className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <div className="absolute top-10 right-1/4 animate-float-delay">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-purple-100">
                <TrendingUp className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-float-delay-2">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-pink-100">
                <BarChart3 className="w-12 h-12 text-pink-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white relative z-10">
        <div className="container mx-auto">
          <h2 className={`text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4 transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Recursos Poderosos para seu Negócio
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Tudo que você precisa para gerenciar seu negócio com eficiência
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Package className="w-8 h-8" />}
              title="Gestão de Estoque"
              description="Controle completo de produtos, códigos de barras e níveis de estoque em tempo real."
              color="blue"
              delay={0}
              mounted={mounted}
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Vendas Inteligentes"
              description="Sistema de vendas integrado com leitura de código de barras e cálculo automático."
              color="green"
              delay={100}
              mounted={mounted}
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Analytics & Relatórios"
              description="Visualize produtos mais vendidos, estoque baixo e métricas importantes do seu negócio."
              color="purple"
              delay={200}
              mounted={mounted}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Rápido e Eficiente"
              description="Interface intuitiva que acelera suas operações diárias."
              color="yellow"
              delay={300}
              mounted={mounted}
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Seguro e Confiável"
              description="Seus dados protegidos com criptografia e backup automático."
              color="red"
              delay={400}
              mounted={mounted}
            />
            <FeatureCard
              icon={<Store className="w-8 h-8" />}
              title="Multi-Loja"
              description="Gerencie múltiplas lojas e estoques de um único painel."
              color="indigo"
              delay={500}
              mounted={mounted}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Por que escolher o GerenciaLucrativa?
          </h2>
          <p className="text-center text-blue-100 mb-12 text-lg">
            A solução completa para gestão de estoque e vendas
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <BenefitItem text="Interface intuitiva e fácil de usar" delay={0} mounted={mounted} />
            <BenefitItem text="Integração com APIs de código de barras" delay={100} mounted={mounted} />
            <BenefitItem text="Alertas automáticos de estoque baixo" delay={200} mounted={mounted} />
            <BenefitItem text="Relatórios visuais e gráficos detalhados" delay={300} mounted={mounted} />
            <BenefitItem text="Cálculo automático de vendas e totais" delay={400} mounted={mounted} />
            <BenefitItem text="Disponível como aplicativo desktop" delay={500} mounted={mounted} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className={`max-w-2xl mx-auto bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100 transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-block mb-4 p-3 bg-blue-100 rounded-full">
              <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Comece grátis hoje e veja a diferença que um sistema profissional faz.
            </p>
            <Link 
              href="/register"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-110 hover:shadow-2xl font-semibold text-lg shadow-lg"
            >
              Criar Conta Gratuita
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPricingModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="px-6 md:px-8 py-6 md:py-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Escolha o plano ideal</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Planos e Preços
              </h2>
              <p className="text-gray-600">
                Escolha o plano que melhor se adapta às necessidades do seu negócio
              </p>
            </div>

            {/* Plans Grid */}
            <div className="p-6 md:p-8">
              {loadingPlans ? (
                <div className="text-center py-12">
                  <div className="animate-pulse text-blue-600">Carregando planos...</div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative bg-white rounded-2xl shadow-lg p-6 md:p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
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
                        {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSelectPlan(plan.slug)}
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
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Store className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">GerenciaLucrativa</span>
          </div>
          <p className="text-gray-400">
            © 2024 GerenciaLucrativa. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-delay-2 {
          animation: float 6s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ icon, title, description, color, delay, mounted }: {
  icon: React.ReactNode
  title: string
  description: string
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'indigo'
  delay: number
  mounted: boolean
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600'
  }

  const borderColorClasses = {
    blue: 'border-blue-200 hover:border-blue-400',
    green: 'border-green-200 hover:border-green-400',
    purple: 'border-purple-200 hover:border-purple-400',
    yellow: 'border-yellow-200 hover:border-yellow-400',
    red: 'border-red-200 hover:border-red-400',
    indigo: 'border-indigo-200 hover:border-indigo-400'
  }

  return (
    <div 
      className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${borderColorClasses[color]} transform hover:scale-105 hover:-translate-y-2 group ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-4 relative">
        <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
          {icon}
        </div>
        <div className={`absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br ${colorClasses[color]} rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity`}></div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function BenefitItem({ text, delay, mounted }: { text: string; delay: number; mounted: boolean }) {
  return (
    <div 
      className={`flex items-center text-lg bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <CheckCircle2 className="w-6 h-6 mr-3 flex-shrink-0 text-green-300" />
      <span>{text}</span>
    </div>
  )
}
