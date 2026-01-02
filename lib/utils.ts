// Funções utilitárias para cálculos e formatação
import { Transaction } from '@/types'
import { formatCurrency as formatCurrencyWithCurrency, getDefaultCurrency } from './currency'

/**
 * Formatar valor monetário
 * 
 * @deprecated Use formatCurrency from '@/lib/currency' com o hook useCurrency para obter a moeda do usuário
 * Esta função mantém compatibilidade retornando BRL por padrão
 */
export function formatCurrency(value: number): string {
  return formatCurrencyWithCurrency(value, getDefaultCurrency())
}

/**
 * Obter transações do mês atual
 */
export function getCurrentMonthTransactions(transactions: Transaction[]): Transaction[] {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    return transactionDate >= startOfMonth && transactionDate <= endOfMonth
  })
}

/**
 * Calcular total de receitas
 */
export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Calcular total de despesas
 */
export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Calcular saldo (receitas - despesas)
 */
export function calculateBalance(transactions: Transaction[]): number {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions)
}

/**
 * Agrupar despesas por categoria
 */
export function groupExpensesByCategory(transactions: Transaction[]): Array<{
  name: string
  value: number
}> {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const grouped = expenses.reduce((acc, transaction) => {
    const category = transaction.category || 'Outros'
    acc[category] = (acc[category] || 0) + transaction.amount
    return acc
  }, {} as Record<string, number>)

  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Agrupar transações por mês
 */
export function groupTransactionsByMonth(
  transactions: Transaction[]
): Array<{
  month: string
  income: number
  expense: number
}> {
  const grouped = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        income: 0,
        expense: 0,
      }
    }

    if (transaction.type === 'income') {
      acc[monthKey].income += transaction.amount
    } else {
      acc[monthKey].expense += transaction.amount
    }

    return acc
  }, {} as Record<string, { month: string; income: number; expense: number }>)

  // Ordenar por chave do mês (mais antigo primeiro) e pegar últimos 6 meses
  const sortedKeys = Object.keys(grouped).sort().slice(-6)
  return sortedKeys.map((key) => grouped[key])
}

/**
 * Obter transações de um mês específico
 */
export function getMonthTransactions(
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] {
  const startOfMonth = new Date(year, month - 1, 1)
  const endOfMonth = new Date(year, month, 0, 23, 59, 59)

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    return transactionDate >= startOfMonth && transactionDate <= endOfMonth
  })
}

/**
 * Obter transações do mês anterior
 */
export function getPreviousMonthTransactions(transactions: Transaction[]): Transaction[] {
  const now = new Date()
  const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const previousYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()

  return getMonthTransactions(transactions, previousYear, previousMonth + 1)
}

/**
 * Calcular total por categoria (receitas e despesas)
 */
export function calculateTotalByCategory(transactions: Transaction[]): Array<{
  category: string
  income: number
  expense: number
  total: number
}> {
  const grouped = transactions.reduce((acc, transaction) => {
    const category = transaction.category || 'Outros'
    if (!acc[category]) {
      acc[category] = { category, income: 0, expense: 0, total: 0 }
    }

    if (transaction.type === 'income') {
      acc[category].income += transaction.amount
    } else {
      acc[category].expense += transaction.amount
    }

    acc[category].total = acc[category].income - acc[category].expense
    return acc
  }, {} as Record<string, { category: string; income: number; expense: number; total: number }>)

  return Object.values(grouped).sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
}

/**
 * Comparar mês atual com mês anterior
 */
export function compareMonths(current: Transaction[], previous: Transaction[]) {
  const currentIncome = calculateTotalIncome(current)
  const currentExpense = calculateTotalExpenses(current)
  const currentBalance = calculateBalance(current)

  const previousIncome = calculateTotalIncome(previous)
  const previousExpense = calculateTotalExpenses(previous)
  const previousBalance = calculateBalance(previous)

  const incomeDiff = currentIncome - previousIncome
  const expenseDiff = currentExpense - previousExpense
  const balanceDiff = currentBalance - previousBalance

  const incomePercent = previousIncome > 0 
    ? ((incomeDiff / previousIncome) * 100) 
    : (currentIncome > 0 ? 100 : 0)
  
  const expensePercent = previousExpense > 0 
    ? ((expenseDiff / previousExpense) * 100) 
    : (currentExpense > 0 ? 100 : 0)
  
  const balancePercent = previousBalance !== 0 
    ? ((balanceDiff / Math.abs(previousBalance)) * 100) 
    : (currentBalance !== 0 ? (currentBalance > 0 ? 100 : -100) : 0)

  return {
    current: {
      income: currentIncome,
      expense: currentExpense,
      balance: currentBalance,
    },
    previous: {
      income: previousIncome,
      expense: previousExpense,
      balance: previousBalance,
    },
    diff: {
      income: incomeDiff,
      expense: expenseDiff,
      balance: balanceDiff,
    },
    percent: {
      income: incomePercent,
      expense: expensePercent,
      balance: balancePercent,
    },
  }
}

/**
 * Identificar gastos altos (acima da média)
 */
export function identifyHighExpenses(
  transactions: Transaction[],
  threshold: number = 1.5 // 150% da média
): Array<{
  transaction: Transaction
  isHigh: boolean
  percentage: number
}> {
  const expenses = transactions.filter((t) => t.type === 'expense')
  if (expenses.length === 0) return []

  const average = expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length
  const thresholdValue = average * threshold

  return expenses.map((transaction) => {
    const isHigh = transaction.amount >= thresholdValue
    const percentage = average > 0 ? (transaction.amount / average) * 100 : 0
    return {
      transaction,
      isHigh,
      percentage: Math.round(percentage),
    }
  }).sort((a, b) => b.transaction.amount - a.transaction.amount)
}

