// Hook unificado para gerenciar transações (autenticado ou visitante)
import { useAuth } from './useAuth'
import { useGuest } from '@/contexts/GuestContext'
import { useTransactions } from './useTransactions'
import { Transaction, TransactionFormData } from '@/types'
import { useState, useEffect } from 'react'

export function useTransactionsUnified() {
  const { user } = useAuth()
  const { 
    isGuest, 
    transactions: guestTransactions, 
    addTransaction: addGuestTransaction,
    updateTransaction: updateGuestTransaction,
    removeTransaction: removeGuestTransaction,
    canAddTransaction: canAddGuestTransaction,
    refreshTransactions: refreshGuestTransactions,
  } = useGuest()
  
  const {
    transactions: authTransactions,
    loading: authLoading,
    addTransaction: addAuthTransaction,
    editTransaction: editAuthTransaction,
    removeTransaction: removeAuthTransaction,
    fetchTransactions,
  } = useTransactions(user?.uid || null)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  // Determinar qual fonte de dados usar
  useEffect(() => {
    if (isGuest) {
      setTransactions(guestTransactions)
      setLoading(false)
    } else if (user) {
      setTransactions(authTransactions)
      setLoading(authLoading)
    } else {
      setTransactions([])
      setLoading(false)
    }
  }, [isGuest, user, guestTransactions, authTransactions, authLoading])

  const addTransaction = async (data: TransactionFormData) => {
    if (isGuest) {
      try {
        await addGuestTransaction(data)
        refreshGuestTransactions()
      } catch (error: any) {
        throw new Error(error.message)
      }
    } else if (user) {
      try {
        await addAuthTransaction(data)
        await fetchTransactions()
      } catch (error: any) {
        throw new Error(error.message)
      }
    } else {
      throw new Error('Usuário não autenticado')
    }
  }

  const editTransaction = async (id: string, data: Partial<TransactionFormData>) => {
    if (isGuest) {
      try {
        await updateGuestTransaction(id, data)
        refreshGuestTransactions()
      } catch (error: any) {
        throw new Error(error.message)
      }
    } else if (user) {
      try {
        await editAuthTransaction(id, data)
        await fetchTransactions()
      } catch (error: any) {
        throw new Error(error.message)
      }
    } else {
      throw new Error('Usuário não autenticado')
    }
  }

  const removeTransaction = async (id: string) => {
    if (isGuest) {
      try {
        await removeGuestTransaction(id)
        refreshGuestTransactions()
      } catch (error: any) {
        throw new Error(error.message)
      }
    } else if (user) {
      try {
        await removeAuthTransaction(id)
        await fetchTransactions()
      } catch (error: any) {
        throw new Error(error.message)
      }
    } else {
      throw new Error('Usuário não autenticado')
    }
  }

  const canCreate = isGuest 
    ? { allowed: canAddGuestTransaction, reason: 'Limite de 3 transações atingido no modo visitante' }
    : { allowed: true, reason: null }

  return {
    transactions,
    loading,
    addTransaction,
    editTransaction,
    removeTransaction,
    canCreate,
    isGuest,
  }
}

