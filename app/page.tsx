'use client'

import { useState } from 'react'
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
  CheckCircle2
} from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-blue-100 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Store className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">GerenciaLucrativa</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Entrar
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Começar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            🚀 Sistema de Gestão Inteligente
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Gerencie seu Estoque de Forma
            <span className="text-blue-600 block mt-2">Inteligente e Lucrativa</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Controle total sobre seus produtos, vendas e estoque. 
            Tudo em um só lugar, de forma simples e eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold text-lg flex items-center gap-2 shadow-lg"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all font-semibold text-lg flex items-center gap-2">
              <Download className="w-5 h-5" />
              Baixar Aplicativo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Recursos Poderosos para seu Negócio
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Package className="w-8 h-8" />}
              title="Gestão de Estoque"
              description="Controle completo de produtos, códigos de barras e níveis de estoque em tempo real."
              emoji="📦"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Vendas Inteligentes"
              description="Sistema de vendas integrado com leitura de código de barras e cálculo automático."
              emoji="💰"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Analytics & Relatórios"
              description="Visualize produtos mais vendidos, estoque baixo e métricas importantes do seu negócio."
              emoji="📊"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Rápido e Eficiente"
              description="Interface intuitiva que acelera suas operações diárias."
              emoji="⚡"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Seguro e Confiável"
              description="Seus dados protegidos com criptografia e backup automático."
              emoji="🔒"
            />
            <FeatureCard
              icon={<Store className="w-8 h-8" />}
              title="Multi-Loja"
              description="Gerencie múltiplas lojas e estoques de um único painel."
              emoji="🏪"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Por que escolher o GerenciaLucrativa?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <BenefitItem text="✅ Interface intuitiva e fácil de usar" />
            <BenefitItem text="✅ Integração com APIs de código de barras" />
            <BenefitItem text="✅ Alertas automáticos de estoque baixo" />
            <BenefitItem text="✅ Relatórios visuais e gráficos detalhados" />
            <BenefitItem text="✅ Cálculo automático de vendas e totais" />
            <BenefitItem text="✅ Disponível como aplicativo desktop" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-gray-600 mb-8">
              Comece grátis hoje e veja a diferença que um sistema profissional faz.
            </p>
            <Link 
              href="/register"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold text-lg"
            >
              Criar Conta Gratuita
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
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
    </div>
  )
}

function FeatureCard({ icon, title, description, emoji }: {
  icon: React.ReactNode
  title: string
  description: string
  emoji: string
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">{emoji}</div>
        <div className="text-blue-600">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center text-lg">
      <CheckCircle2 className="w-6 h-6 mr-3 flex-shrink-0" />
      <span>{text}</span>
    </div>
  )
}

