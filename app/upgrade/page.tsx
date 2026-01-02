'use client'

// Página de upgrade para Premium
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { usePlan } from '@/hooks/usePlan'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import { useToast } from '@/contexts/ToastContext'

export default function UpgradePage() {
  const { user, userData } = useAuth()
  const { isPremium } = usePlan()
  const router = useRouter()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (!user?.uid) {
      showToast('Você precisa estar logado para fazer upgrade', 'error')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email || userData?.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar sessão de checkout')
      }

      // Redirecionar para o Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de checkout não recebida')
      }
    } catch (error: any) {
      console.error('Erro ao iniciar checkout:', error)
      showToast(error.message || 'Erro ao processar checkout', 'error')
      setIsLoading(false)
    }
  }

  if (isPremium) {
    return (
      <ProtectedRoute requireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Você já é Premium!
            </h2>
            <p className="text-gray-600 mb-6">
              Você já possui acesso a todas as funcionalidades premium.
            </p>
            <Button variant="primary" onClick={() => router.push('/dashboard')}>
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Upgrade para Premium
            </h1>
            <p className="text-xl text-gray-600">
              Desbloqueie todas as funcionalidades avançadas
            </p>
          </div>

          <div className="bg-white rounded-lg border-2 border-primary-200 shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full mb-4">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Plano Premium
              </h2>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-5xl font-bold text-primary-600">R$ 9,90</span>
                <span className="text-gray-500">/mês</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">
                    Transações Ilimitadas
                  </p>
                  <p className="text-sm text-gray-600">
                    Crie quantas transações quiser, sem limites
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">
                    Comparação Mensal Detalhada
                  </p>
                  <p className="text-sm text-gray-600">
                    Compare seu desempenho mês a mês com análises detalhadas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">
                    Totais por Categoria
                  </p>
                  <p className="text-sm text-gray-600">
                    Veja o saldo detalhado de cada categoria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">
                    Alertas de Gastos Altos
                  </p>
                  <p className="text-sm text-gray-600">
                    Receba alertas inteligentes sobre gastos acima da média
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">
                    Suporte Prioritário
                  </p>
                  <p className="text-sm text-gray-600">
                    Atendimento prioritário para usuários Premium
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full py-4 text-lg"
              onClick={handleCheckout}
              isLoading={isLoading}
            >
              {isLoading ? 'Processando...' : 'Assinar Premium por R$ 9,90/mês'}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Cancele a qualquer momento. Sem compromisso.
            </p>
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

