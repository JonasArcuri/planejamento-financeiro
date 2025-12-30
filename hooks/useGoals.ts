// Hook para gerenciar metas financeiras
import { useState, useEffect } from 'react'
import {
  getUserGoals,
  createGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  addMoneyToGoal,
} from '@/services/firebase/goals'
import { Goal, GoalFormData } from '@/types'

export function useGoals(userId: string | null) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = async () => {
    if (!userId) return

    setLoading(true)
    setError(null)
    try {
      const data = await getUserGoals(userId)
      setGoals(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addGoal = async (data: GoalFormData) => {
    if (!userId) throw new Error('Usuário não autenticado')

    try {
      await createGoal(userId, data)
      await fetchGoals()
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  const editGoal = async (goalId: string, data: Partial<GoalFormData>) => {
    try {
      await updateGoal(goalId, data)
      await fetchGoals()
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  const updateProgress = async (goalId: string, currentAmount: number) => {
    try {
      await updateGoalProgress(goalId, currentAmount)
      await fetchGoals()
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  const removeGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId)
      await fetchGoals()
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  const addMoney = async (goalId: string, amount: number, fromBalance: boolean = false, goalTitle?: string) => {
    if (!userId) throw new Error('Usuário não autenticado')
    
    try {
      await addMoneyToGoal(goalId, amount, fromBalance, userId, goalTitle)
      await fetchGoals()
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchGoals()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return {
    goals,
    loading,
    error,
    fetchGoals,
    addGoal,
    editGoal,
    updateProgress,
    removeGoal,
    addMoney,
  }
}

