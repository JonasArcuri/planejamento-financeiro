'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useTransactions } from '@/hooks/useTransactions'
import { useToast } from '@/contexts/ToastContext'
import { useState, useMemo } from 'react'
import { Transaction } from '@/types'
import MonthYearFilter from '@/components/reports/MonthYearFilter'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { logout } from '@/services/firebase/auth'
import Loading from '@/components/Loading'
import { generateMonthlyPDF } from '@/lib/pdfGenerator'
import { formatCurrency, calculateTotalIncome, calculateTotalExpenses } from '@/lib/utils'

export default function ReportsPage() {
  const { user, userData } = useAuth()
  const { transactions, loading, fetchTransactions } = useTransactions(user?.uid || null)
  const { showToast } = useToast()
  const router = useRouter()

  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Filtrar transações do mês/ano selecionado
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date)
      return (
        transactionDate.getMonth() + 1 === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      )
    })
  }, [transactions, selectedMonth, selectedYear])

  // Calcular totais
  const totalIncome = useMemo(
    () => calculateTotalIncome(filteredTransactions),
    [filteredTransactions]
  )
  const totalExpenses = useMemo(
    () => calculateTotalExpenses(filteredTransactions),
    [filteredTransactions]
  )
  const balance = totalIncome - totalExpenses

  const handleFilterChange = (month: number, year: number) => {
    setSelectedMonth(month)
    setSelectedYear(year)
  }

  const handleGeneratePDF = async () => {
    if (filteredTransactions.length === 0) {
      showToast('Não há transações para o período selecionado', 'warning')
      return
    }

    setIsGeneratingPDF(true)
    try {
      const userName = userData?.name || user?.email || 'Usuário'
      
      generateMonthlyPDF({
        transactions: filteredTransactions,
        month: selectedMonth,
        year: selectedYear,
        userName,
      })

      showToast('Relatório PDF gerado com sucesso!', 'success')
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error)
      showToast('Erro ao gerar relatório PDF. Tente novamente.', 'error')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

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
        {/* Navegação */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-primary-600">
                  Planejamento Financeiro
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => router.push('/transactions')}>
                  Transações
                </Button>
                <Button variant="ghost" onClick={() => router.push('/goals')}>
                  Metas
                </Button>
                <Button variant="ghost" onClick={() => router.push('/reports')}>
                  Relatórios
                </Button>
                {userData?.plan === 'premium' && (
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-primary-600 rounded">
                    Premium
                  </span>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Relatório Financeiro</h2>
            <p className="text-sm text-gray-600 mt-1">
              Gere um relatório em PDF das suas transações mensais
            </p>
          </div>

          {/* Filtro de Mês/Ano */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <MonthYearFilter
              onFilterChange={handleFilterChange}
              defaultMonth={selectedMonth}
              defaultYear={selectedYear}
            />
          </div>

          {/* Resumo do Período */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo - {monthNames[selectedMonth - 1]}/{selectedYear}
            </h3>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma transação registrada neste período</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-green-700 font-medium">Total de Receitas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalIncome)}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="text-sm text-red-700 font-medium">Total de Despesas</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(totalExpenses)}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg p-4 border ${
                      balance >= 0
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        balance >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      Saldo Final
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(balance)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  {filteredTransactions.length} transação(ões) encontrada(s)
                </p>
              </>
            )}
          </div>

          {/* Botão de Gerar PDF */}
          <div className="flex justify-center">
            <Button
              variant="primary"
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF || filteredTransactions.length === 0}
              isLoading={isGeneratingPDF}
              className="min-w-[200px]"
            >
              {isGeneratingPDF ? 'Gerando PDF...' : 'Gerar Relatório PDF'}
            </Button>
          </div>

          {/* Lista de Transações (Preview) */}
          {filteredTransactions.length > 0 && (
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Transações do Período (Preview)
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTransactions.map((transaction) => {
                  const category =
                    transaction.category === 'Outros' && transaction.customCategory
                      ? `Outros - ${transaction.customCategory}`
                      : transaction.category

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{category}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <p
                        className={`font-bold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}

