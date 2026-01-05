'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useTransactionsUnified } from '@/hooks/useTransactionsUnified'
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
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner'
import { usePlan } from '@/hooks/usePlan'
import { useToast } from '@/contexts/ToastContext'
import { useGoals } from '@/hooks/useGoals'
import GoalsSummary from '@/components/dashboard/GoalsSummary'
import SettingsButton from '@/components/ui/SettingsButton'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useGuest } from '@/contexts/GuestContext'
import { getGuestTransactionCount } from '@/lib/guestMigration'
import {
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
import { formatCurrency } from '@/lib/currency'

function DashboardContent() {
  const { user, userData } = useAuth()
  const { transactions, loading } = useTransactionsUnified()
  const { goals } = useGoals(user?.uid || null)
  const { checkFeature, isPremium } = usePlan()
  const { isGuest } = useGuest()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const { currency } = useCurrency()

  // Verificar se veio do checkout e recarregar dados do usuário
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      showToast(t('dashboard.subscriptionActivated'), 'success')
      
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
            console.error(t('dashboard.errorReloadingUserData'), error)
          }
        }, 2000)
      }
      
      // Limpar URL
      router.replace('/dashboard')
    } else if (searchParams.get('canceled') === 'true') {
      showToast(t('dashboard.checkoutCanceled'), 'info')
      router.replace('/dashboard')
    }
  }, [searchParams, router, showToast, user?.uid, t])

  // Transações são carregadas automaticamente pelo hook unificado

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error(t('dashboard.logoutError'), error)
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-safe">
        {/* Aviso do modo visitante - Mobile-first compacto */}
        {isGuest && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-b border-yellow-300 dark:border-yellow-700">
            <div className="px-4 py-3">
              <div className="flex items-start gap-2.5">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-200 mb-0.5">
                    {t('dashboard.guestWarning')}
                  </p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-300 leading-relaxed">
                    {t('dashboard.guestWarningMessage')}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push('/signup')}
                    className="mt-2 text-xs px-3 py-1.5"
                  >
                    {t('dashboard.guestCtaCreateAccount')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Header Mobile-first - Simplificado */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate sm:whitespace-nowrap">
                  {t('dashboard.appName')}
                </h1>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isGuest && <SettingsButton />}
                {/* Informações do usuário apenas no desktop */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-[120px]">
                    {isGuest ? 'Visitante' : (userData?.name || user?.email?.split('@')[0])}
                  </span>
                  {!isGuest && !isPremium && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      Free
                    </span>
                  )}
                  {!isGuest && isPremium && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded">
                      Premium
                    </span>
                  )}
                </div>
                {/* Botão logout apenas no desktop - mobile usa menu */}
                <div className="hidden md:block">
                  {!isGuest && (
                    <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs px-2 py-1">
                      {t('common.logout')}
                    </Button>
                  )}
                  {isGuest && (
                    <Button variant="outline" size="sm" onClick={() => router.push('/login')} className="text-xs px-2 py-1">
                      Entrar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content - Mobile-first spacing com padding para bottom nav */}
        <main className="px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-8 max-w-6xl md:max-w-7xl mx-auto pb-20 lg:pb-8">
          {/* Banner de verificação de e-mail */}
          <EmailVerificationBanner />

          {/* Título - Mobile-first */}
          <div className="mb-4 md:mb-5 lg:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">{t('dashboard.title')}</h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Cards de Estatísticas - Mobile: 1 col, Tablet: 2 col, Desktop: 3 col */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5 mb-4 md:mb-5 lg:mb-6">
            <StatCard
              title={t('dashboard.balance')}
              value={formatCurrency(balance, currency)}
              variant="balance"
              icon={
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
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
              title={t('dashboard.totalIncome')}
              value={formatCurrency(totalIncome, currency)}
              variant="income"
              icon={
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
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
              title={t('dashboard.totalExpenses')}
              value={formatCurrency(totalExpenses, currency)}
              variant="expense"
              icon={
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
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

          {/* Card de CTA para modo visitante - Mobile-first compacto */}
          {isGuest && (
            <div className="mb-4 md:mb-6 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-4 md:p-5 lg:p-6 text-white shadow-lg">
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-1.5">
                    {t('dashboard.guestCtaSaveData')}
                  </h3>
                  <p className="text-xs sm:text-sm text-primary-100 leading-relaxed">
                    {(() => {
                      const count = getGuestTransactionCount()
                      return count > 0 
                        ? t('dashboard.guestDataWillBeSaved')
                        : t('dashboard.guestWarningMessage')
                    })()}
                  </p>
                  {(() => {
                    const count = getGuestTransactionCount()
                    if (count > 0 && count < 3) {
                      return (
                        <p className="text-xs text-primary-200 mt-1.5">
                          {t('dashboard.guestLimitWarning').replace('{count}', String(count))}
                        </p>
                      )
                    }
                    if (count >= 3) {
                      return (
                        <p className="text-xs font-semibold text-yellow-200 mt-1.5">
                          {t('dashboard.guestLimitReached')}
                        </p>
                      )
                    }
                    return null
                  })()}
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => router.push('/signup')}
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold w-full sm:w-auto sm:self-start"
                >
                  {t('dashboard.guestCtaCreateAccount')}
                </Button>
              </div>
            </div>
          )}

          {/* Ações Rápidas - Simplificadas: apenas no desktop/tablet, mobile usa bottom nav */}
          <div className="hidden sm:block mb-4 md:mb-5 lg:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 px-1">
              {t('dashboard.quickActions')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
              <button
                onClick={() => router.push('/transactions')}
                className="flex flex-col items-center justify-center gap-2 md:gap-2.5 h-28 md:h-32 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all active:scale-95 touch-manipulation"
              >
                <svg
                  className="w-7 h-7 md:w-8 md:h-8 text-primary-600 dark:text-primary-400"
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
                <div className="text-center px-1">
                  <span className="block text-xs md:text-sm font-medium text-gray-900 dark:text-white">{t('dashboard.manageTransactions')}</span>
                  <span className="block text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('dashboard.manageTransactionsDesc')}</span>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/goals')}
                className="flex flex-col items-center justify-center gap-2 md:gap-2.5 h-28 md:h-32 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all active:scale-95 touch-manipulation"
              >
                <svg
                  className="w-7 h-7 md:w-8 md:h-8 text-primary-600 dark:text-primary-400"
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
                <div className="text-center px-1">
                  <span className="block text-xs md:text-sm font-medium text-gray-900 dark:text-white">{t('dashboard.manageGoals')}</span>
                  <span className="block text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('dashboard.manageGoalsDesc')}</span>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/reports')}
                className="flex flex-col items-center justify-center gap-2 md:gap-2.5 h-28 md:h-32 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all active:scale-95 touch-manipulation"
              >
                <svg
                  className="w-7 h-7 md:w-8 md:h-8 text-primary-600 dark:text-primary-400"
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
                <div className="text-center px-1">
                  <span className="block text-xs md:text-sm font-medium text-gray-900 dark:text-white">{t('dashboard.generateReport')}</span>
                  <span className="block text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('dashboard.generateReportDesc')}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Alerta de Gastos Altos - Premium */}
          {highExpenses.some((item) => item.isHigh) && (
            <div className="mb-4 md:mb-6">
              <FeatureLock
                isLocked={!checkFeature('highExpensesAlert')}
                featureName={t('dashboard.highExpensesAlert')}
                upgradeMessage={t('dashboard.highExpensesAlertMessage')}
              >
                <HighExpensesAlert highExpenses={highExpenses} />
              </FeatureLock>
            </div>
          )}

          {/* Comparação Mensal - Premium */}
          <div className="mb-4 md:mb-6">
            <FeatureLock
              isLocked={!checkFeature('monthlyComparison')}
              featureName={t('dashboard.monthlyComparison')}
              upgradeMessage={t('dashboard.monthlyComparisonMessage')}
            >
              <MonthComparison
                current={monthComparison.current}
                previous={monthComparison.previous}
                diff={monthComparison.diff}
                percent={monthComparison.percent}
              />
            </FeatureLock>
          </div>

          {/* Gráficos - Mobile: 1 col, Tablet: 2 col, Desktop: 2 col */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-4 md:mb-5 lg:mb-6">
            <ExpensesByCategoryChart data={expensesByCategory} />
            <MonthlyComparisonChart data={monthlyComparison} />
          </div>

          {/* Totais por Categoria - Premium */}
          <div className="mb-4 md:mb-6">
            <FeatureLock
              isLocked={!checkFeature('categoryTotals')}
              featureName={t('dashboard.categoryTotals')}
              upgradeMessage={t('dashboard.categoryTotalsMessage')}
            >
              <CategoryTotals data={categoryTotals} />
            </FeatureLock>
          </div>

          {/* Metas Financeiras */}
          <div className="mb-4 md:mb-6">
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
