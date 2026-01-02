'use client'

// Contexto para gerenciar o modo visitante
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  isGuestModeEnabled,
  enableGuestMode,
  disableGuestMode,
  getGuestTransactions,
  addGuestTransaction,
  updateGuestTransaction,
  deleteGuestTransaction,
  getGuestTransactionCount,
  canAddGuestTransaction,
  getGuestTransactionsByMonth,
} from '@/lib/guestStorage'
import { Transaction, TransactionFormData } from '@/types'

interface GuestContextType {
  isGuest: boolean
  enableGuest: () => void
  disableGuest: () => void
  transactions: Transaction[]
  transactionCount: number
  canAddTransaction: boolean
  addTransaction: (data: TransactionFormData) => Promise<Transaction>
  updateTransaction: (id: string, data: Partial<TransactionFormData>) => Promise<Transaction>
  removeTransaction: (id: string) => Promise<void>
  getTransactionsByMonth: (year: number, month: number) => Transaction[]
  refreshTransactions: () => void
}

const GuestContext = createContext<GuestContextType | undefined>(undefined)

export function GuestProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Carregar estado inicial do localStorage
  useEffect(() => {
    const guestMode = isGuestModeEnabled()
    setIsGuest(guestMode)
    
    if (guestMode) {
      setTransactions(getGuestTransactions())
    }
  }, [])

  const handleEnableGuest = () => {
    enableGuestMode()
    setIsGuest(true)
    setTransactions(getGuestTransactions())
  }

  const handleDisableGuest = () => {
    disableGuestMode()
    setIsGuest(false)
    setTransactions([])
  }

  const refreshTransactions = () => {
    if (isGuest) {
      setTransactions(getGuestTransactions())
    }
  }

  const handleAddTransaction = async (data: TransactionFormData): Promise<Transaction> => {
    if (!isGuest) {
      throw new Error('Modo visitante não está ativo')
    }

    if (!canAddGuestTransaction()) {
      throw new Error(`Limite de 3 transações atingido. Crie uma conta para continuar.`)
    }

    const newTransaction = addGuestTransaction(data)
    setTransactions(getGuestTransactions())
    return newTransaction
  }

  const handleUpdateTransaction = async (
    id: string,
    data: Partial<TransactionFormData>
  ): Promise<Transaction> => {
    if (!isGuest) {
      throw new Error('Modo visitante não está ativo')
    }

    const updated = updateGuestTransaction(id, data)
    setTransactions(getGuestTransactions())
    return updated
  }

  const handleRemoveTransaction = async (id: string): Promise<void> => {
    if (!isGuest) {
      throw new Error('Modo visitante não está ativo')
    }

    deleteGuestTransaction(id)
    setTransactions(getGuestTransactions())
  }

  const handleGetTransactionsByMonth = (year: number, month: number): Transaction[] => {
    if (!isGuest) return []
    return getGuestTransactionsByMonth(year, month)
  }

  return (
    <GuestContext.Provider
      value={{
        isGuest,
        enableGuest: handleEnableGuest,
        disableGuest: handleDisableGuest,
        transactions,
        transactionCount: getGuestTransactionCount(),
        canAddTransaction: canAddGuestTransaction(),
        addTransaction: handleAddTransaction,
        updateTransaction: handleUpdateTransaction,
        removeTransaction: handleRemoveTransaction,
        getTransactionsByMonth: handleGetTransactionsByMonth,
        refreshTransactions,
      }}
    >
      {children}
    </GuestContext.Provider>
  )
}

export function useGuest() {
  const context = useContext(GuestContext)
  if (context === undefined) {
    throw new Error('useGuest deve ser usado dentro de um GuestProvider')
  }
  return context
}

