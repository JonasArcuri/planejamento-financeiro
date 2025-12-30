'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import Link from 'next/link'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return <Loading />
  }

  if (user) {
    return <Loading />
  }

  const handleGetStarted = () => {
    router.push('/signup')
  }

  const handleUpgrade = () => {
    router.push('/signup?upgrade=true')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                Planejamento Finanças
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-primary-600 font-medium"
              >
                Entrar
              </Link>
              <Button variant="primary" onClick={handleGetStarted}>
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-purple-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Controle suas{' '}
                <span className="text-primary-600">finanças pessoais</span> de
                forma simples
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Gerencie receitas, despesas e metas financeiras em um só lugar.
                Tome decisões inteligentes sobre seu dinheiro com visualizações
                claras e insights práticos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGetStarted}
                  className="text-lg px-8 py-4"
                >
                  Começar Grátis
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleUpgrade}
                  className="text-lg px-8 py-4"
                >
                  Ver Planos Premium
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                ✨ Sem cartão de crédito • Teste grátis • Cancele quando quiser
              </p>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Saldo do Mês</h3>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-4xl font-bold">R$ 2.450,00</p>
                  <p className="text-primary-100 text-sm mt-2">
                    +15% em relação ao mês anterior
                  </p>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Receitas</span>
                    <span className="font-semibold text-green-600">
                      R$ 5.000,00
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Despesas</span>
                    <span className="font-semibold text-red-600">
                      R$ 2.550,00
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Meta alcançada!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para{' '}
              <span className="text-primary-600">controlar seu dinheiro</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Funcionalidades poderosas e fáceis de usar para transformar sua
              relação com o dinheiro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Dashboard Intuitivo
              </h3>
              <p className="text-gray-600">
                Visualize todas as suas finanças em um só lugar com gráficos
                claros e estatísticas em tempo real.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Controle Total
              </h3>
              <p className="text-gray-600">
                Registre receitas e despesas facilmente, organize por
                categorias e acompanhe seu fluxo de caixa mensal.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Metas Financeiras
              </h3>
              <p className="text-gray-600">
                Defina e acompanhe suas metas de poupança com barras de
                progresso e alertas inteligentes.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Análises Avançadas
              </h3>
              <p className="text-gray-600">
                Compare meses, identifique padrões de gastos e receba alertas
                sobre despesas acima da média.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                100% Seguro
              </h3>
              <p className="text-gray-600">
                Seus dados são protegidos com criptografia de ponta e você
                controla totalmente suas informações.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Mobile-First
              </h3>
              <p className="text-gray-600">
                Acesse de qualquer dispositivo. Interface responsiva e otimizada
                para celular, tablet e desktop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Veja como é{' '}
              <span className="text-primary-600">fácil de usar</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Interface intuitiva e visualizações claras para você tomar
              decisões financeiras inteligentes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Screenshot 1 - Dashboard */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="bg-gray-100 rounded-lg p-4 mb-4 h-64 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-primary-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    Dashboard com gráficos interativos
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Dashboard Completo
              </h3>
              <p className="text-gray-600 text-sm">
                Visualize saldo, receitas, despesas e gráficos por categoria
                em tempo real
              </p>
            </div>

            {/* Screenshot 2 - Transactions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="bg-gray-100 rounded-lg p-4 mb-4 h-64 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-primary-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    Gerenciamento de transações
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Transações Organizadas
              </h3>
              <p className="text-gray-600 text-sm">
                Adicione, edite e organize suas receitas e despesas por
                categorias
              </p>
            </div>

            {/* Screenshot 3 - Goals */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="bg-gray-100 rounded-lg p-4 mb-4 h-64 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-primary-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    Acompanhamento de metas
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Metas de Poupança
              </h3>
              <p className="text-gray-600 text-sm">
                Defina metas, acompanhe o progresso e alcance seus objetivos
                financeiros
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Comece a controlar suas finanças hoje
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Plano gratuito com funcionalidades essenciais. Upgrade para
              Premium e desbloqueie análises avançadas e recursos ilimitados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleGetStarted}
                className="bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-4 border-white"
              >
                Começar Grátis
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleUpgrade}
                className="bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-4 border-2 border-white"
              >
                Ver Planos Premium
              </Button>
            </div>
            <p className="text-sm text-primary-100 mt-6">
              ✨ Sem compromisso • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">💰 Finanças</h3>
              <p className="text-gray-400">
                Controle suas finanças pessoais de forma simples e eficiente.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white">
                    Entrar
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white">
                    Cadastrar
                  </Link>
                </li>
                <li>
                  <Link href="/upgrade" className="hover:text-white">
                    Planos Premium
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Dashboard Intuitivo</li>
                <li>Metas Financeiras</li>
                <li>Análises Avançadas</li>
                <li>100% Seguro</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Planejamento Finanças. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
