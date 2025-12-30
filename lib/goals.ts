// Funções utilitárias para metas financeiras
import { Goal, Transaction } from '@/types'
import { calculateTotalIncome } from './utils'

/**
 * Calcular progresso da meta baseado em receitas
 */
export function calculateGoalProgress(
  goal: Goal,
  transactions: Transaction[]
): {
  currentAmount: number
  percentage: number
  remaining: number
  isCompleted: boolean
  incomeContribution: number
} {
  // Calcular total de receitas desde a criação da meta até o deadline
  const goalStartDate = new Date(goal.createdAt)
  const goalDeadline = new Date(goal.deadline)
  const today = new Date()
  
  // Considerar apenas até hoje ou até o deadline, o que for menor
  const endDate = today < goalDeadline ? today : goalDeadline
  
  const relevantTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    return (
      t.type === 'income' &&
      transactionDate >= goalStartDate &&
      transactionDate <= endDate
    )
  })

  const incomeContribution = calculateTotalIncome(relevantTransactions)
  
  // O currentAmount já inclui o dinheiro guardado manualmente
  // Somamos apenas as receitas para mostrar a contribuição total
  const currentAmount = goal.currentAmount + incomeContribution
  const percentage = Math.min((currentAmount / goal.targetAmount) * 100, 100)
  const remaining = Math.max(goal.targetAmount - currentAmount, 0)
  const isCompleted = currentAmount >= goal.targetAmount

  return {
    currentAmount,
    percentage: Math.round(percentage * 100) / 100,
    remaining,
    isCompleted,
    incomeContribution,
  }
}

/**
 * Calcular dias restantes até o deadline
 */
export function getDaysRemaining(deadline: string): number {
  const deadlineDate = new Date(deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadlineDate.setHours(0, 0, 0, 0)
  
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * Verificar se a meta está próxima do deadline
 */
export function isGoalNearDeadline(deadline: string, daysThreshold: number = 30): boolean {
  const daysRemaining = getDaysRemaining(deadline)
  return daysRemaining > 0 && daysRemaining <= daysThreshold
}

/**
 * Verificar se a meta está atrasada
 */
export function isGoalOverdue(deadline: string): boolean {
  return getDaysRemaining(deadline) < 0
}

