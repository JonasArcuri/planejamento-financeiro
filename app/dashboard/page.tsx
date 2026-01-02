'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useTransactions } from '@/hooks/useTransactions'
import { logout } from '@/services/firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import StatCard from '@/components/dashboard/StatCard'
import ExpensesByCategoryChart from '@/components/dashboard/ExpensesByCategoryChart'
import MonthlyComparisonChart from '@/components/dashboard/MonthlyComparisonChart'
import MonthComparison from '@/components/dashboard/MonthComparison'
import CategoryTotals from '@/components/dashboard/CategoryTotals'
import HighExpensesAlert from '@/components/dashboard/HighExpensesAlert'
import FeatureLock from '@/components/premium/FeatureLock'
import UpgradePrompt from '@/components/premium/UpgradePrompt'
import Loading from '@/components/Loading'
import { usePlan } from '@/hooks/usePlan'
import { useToast } from '@/contexts/ToastContext'
import { useGoals } from '@/hooks/useGoals'
import GoalsSummary from '@/components/dashboard/GoalsSummary'
import {
  formatCurrency,
  getCurrentMonthTransactions,
  getPreviousMonthTransactions,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  groupExpensesByCategory,
  groupTransactionsByMonth,
  calculateTotalByCategory,
  compareMonths,
  identifyHighExpenses,
} from '@/lib/utils'

function DashboardContent() {
  const { user, userData } = useAuth()
  const { transactions, loading, fetchTransactions } = useTransactions(user?.uid || null)
  const { goals } = useGoals(user?.uid || null)
  const { checkFeature, isPremium } = usePlan()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  // Verificar se veio do checkout e recarregar dados do usuário
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      showToast('Assinatura ativada com sucesso! Bem-vindo ao Premium!', 'success')
      
      // Recarregar dados do usuário após alguns segundos (tempo para webhook processar)
      if (user?.uid) {
        setTimeout(async () => {
          const { getUserData } = await import('@/services/firebase/auth')
          try {
            const updatedData = await getUserData(user.uid)
            if (updatedData?.plan === 'premium') {
              // Recarregar página para atualizar estado
              window.location.reload()
            } else {
              // Tentar novamente após mais tempo
              setTimeout(async () => {
                const retryData = await getUserData(user.uid)
                if (retryData?.plan === 'premium') {
                  window.location.reload()
                }
              }, 3000)
            }
          } catch (error) {
            console.error('Erro ao recarregar dados do usuário:', error)
          }
        }, 2000)
      }
      
      // Limpar URL
      router.replace('/dashboard')
    } else if (searchParams.get('canceled') === 'true') {
      showToast('Checkout cancelado', 'info')
      router.replace('/dashboard')
    }
  }, [searchParams, router, showToast, user?.uid])

  useEffect(() => {
    if (user?.uid) {
      fetchTransactions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  // Atualizar quando a página ganha foco (volta de outra página)
  useEffect(() => {
    const handleFocus = () => {
      if (user?.uid) {
        fetchTransactions()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  // Calcular estatísticas do mês atual
  const monthlyTransactions = useMemo(
    () => getCurrentMonthTransactions(transactions),
    [transactions]
  )

  const totalIncome = useMemo(
    () => calculateTotalIncome(monthlyTransactions),
    [monthlyTransactions]
  )

  const totalExpenses = useMemo(
    () => calculateTotalExpenses(monthlyTransactions),
    [monthlyTransactions]
  )

  const balance = useMemo(
    () => calculateBalance(monthlyTransactions),
    [monthlyTransactions]
  )

  const expensesByCategory = useMemo(
    () => groupExpensesByCategory(monthlyTransactions),
    [monthlyTransactions]
  )

  const monthlyComparison = useMemo(
    () => groupTransactionsByMonth(transactions),
    [transactions]
  )

  // Transações do mês anterior
  const previousMonthTransactions = useMemo(
    () => getPreviousMonthTransactions(transactions),
    [transactions]
  )

  // Comparação mês atual vs anterior
  const monthComparison = useMemo(
    () => compareMonths(monthlyTransactions, previousMonthTransactions),
    [monthlyTransactions, previousMonthTransactions]
  )

  // Totais por categoria
  const categoryTotals = useMemo(
    () => calculateTotalByCategory(monthlyTransactions),
    [monthlyTransactions]
  )

  // Gastos altos
  const highExpenses = useMemo(
    () => identifyHighExpenses(monthlyTransactions),
    [monthlyTransactions]
  )

  if (loading) {
    return (
      <ProtectedRoute>
        <Loading />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Planejamento Financeiro
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {userData?.name || user?.email}
                </span>
                {!isPremium && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                    Free
                  </span>
                )}
                {isPremium && (
                  <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded">
                    Premium
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">
              Visão geral das suas finanças do mês atual
            </p>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Saldo do Mês"
              value={formatCurrency(balance)}
              variant="balance"
              icon={
                <svg
                  className="w-8 h-8"
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
              }
            />
            <StatCard
              title="Total de Receitas"
              value={formatCurrency(totalIncome)}
              variant="income"
              icon={
                <svg
                  className="w-8 h-8"
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
              }
            />
            <StatCard
              title="Total de Despesas"
              value={formatCurrency(totalExpenses)}
              variant="expense"
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              }
            />
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/transactions')}
                className="flex flex-col items-center justify-center gap-3 h-32 hover:bg-primary-50 hover:border-primary-300 transition-all"
              >
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <span className="font-medium text-gray-900">Gerenciar Transações</span>
                <span className="text-xs text-gray-500">Adicione e edite suas receitas e despesas</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/goals')}
                className="flex flex-col items-center justify-center gap-3 h-32 hover:bg-primary-50 hover:border-primary-300 transition-all"
              >
                <svg
                  className="w-8 h-8 text-primary-600"
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
                <span className="font-medium text-gray-900">Gerenciar Metas</span>
                <span className="text-xs text-gray-500">Defina e acompanhe suas metas de poupança</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/reports')}
                className="flex flex-col items-center justify-center gap-3 h-32 hover:bg-primary-50 hover:border-primary-300 transition-all"
              >
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium text-gray-900">Gerar Relatório PDF</span>
                <span className="text-xs text-gray-500">Exporte suas transações mensais em PDF</span>
              </Button>
            </div>
          </div>

          {/* Alerta de Gastos Altos - Premium */}
          {highExpenses.some((item) => item.isHigh) && (
            <div className="mb-6">
              <FeatureLock
                isLocked={!checkFeature('highExpensesAlert')}
                featureName="Alerta de Gastos Altos"
                upgradeMessage="Receba alertas inteligentes sobre gastos acima da média. Disponível apenas no Premium."
              >
                <HighExpensesAlert highExpenses={highExpenses} />
              </FeatureLock>
            </div>
          )}

          {/* Comparação Mensal - Premium */}
          <div className="mb-6">
            <FeatureLock
              isLocked={!checkFeature('monthlyComparison')}
              featureName="Comparação Mensal"
              upgradeMessage="Compare seu desempenho mês a mês com análises detalhadas. Disponível apenas no Premium."
            >
              <MonthComparison
                current={monthComparison.current}
                previous={monthComparison.previous}
                diff={monthComparison.diff}
                percent={monthComparison.percent}
              />
            </FeatureLock>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ExpensesByCategoryChart data={expensesByCategory} />
            <MonthlyComparisonChart data={monthlyComparison} />
          </div>

          {/* Totais por Categoria - Premium */}
          <div className="mb-6">
            <FeatureLock
              isLocked={!checkFeature('categoryTotals')}
              featureName="Totais por Categoria"
              upgradeMessage="Veja o saldo detalhado de cada categoria. Disponível apenas no Premium."
            >
              <CategoryTotals data={categoryTotals} />
            </FeatureLock>
          </div>

          {/* Metas Financeiras */}
          <div className="mb-6">
            <GoalsSummary goals={goals} transactions={transactions} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardContent />
    </Suspense>
  )
}
