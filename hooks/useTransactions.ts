// Hook para gerenciar transações
import { useState, useEffect } from 'react'
import {
  getUserTransactions,
  getMonthlyTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/services/firebase/firestore'
import { Transaction, TransactionFormData } from '@/types'

export function useTransactions(userId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async (filters?: {
    type?: 'income' | 'expense'
    startDate?: string
    endDate?: string
  }) => {
    if (!userId) return

    setLoading(true)
    setError(null)
    try {
      const data = await getUserTransactions(userId, filters)
      setTransactions(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchMonthlyTransactions = async (year: number, month: number) => {
    if (!userId) return

    setLoading(true)
    setError(null)
    try {
      const data = await getMonthlyTransactions(userId, year, month)
      setTransactions(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTransaction = async (data: TransactionFormData) => {
    if (!userId) throw new Error('Usuário não autenticado')

    try {
      await createTransaction(userId, data)
      await fetchTransactions()
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  const editTransaction = async (
    transactionId: string,
    data: Partial<TransactionFormData>
  ) => {
    try {
      await updateTransaction(transactionId, data)
      await fetchTransactions()
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  const removeTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId)
      await fetchTransactions()
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchTransactions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    fetchMonthlyTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
  }
}

