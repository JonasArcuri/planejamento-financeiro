// Utilitários para armazenamento local de dados do visitante
import { Transaction, TransactionFormData } from '@/types'

const GUEST_STORAGE_KEY = 'guest_transactions'
const GUEST_MODE_KEY = 'guest_mode_enabled'
const MAX_GUEST_TRANSACTIONS = 3

/**
 * Verifica se o modo visitante está ativo
 */
export function isGuestModeEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(GUEST_MODE_KEY) === 'true'
}

/**
 * Ativa o modo visitante
 */
export function enableGuestMode(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(GUEST_MODE_KEY, 'true')
}

/**
 * Desativa o modo visitante e limpa os dados
 */
export function disableGuestMode(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(GUEST_MODE_KEY)
  localStorage.removeItem(GUEST_STORAGE_KEY)
}

/**
 * Obtém todas as transações do visitante
 */
export function getGuestTransactions(): Transaction[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY)
    if (!stored) return []
    
    const transactions = JSON.parse(stored) as Transaction[]
    // Garantir que as datas estão no formato correto
    return transactions.map(t => ({
      ...t,
      date: t.date,
      createdAt: t.createdAt || t.date,
    }))
  } catch (error) {
    console.error('Erro ao carregar transações do visitante:', error)
    return []
  }
}

/**
 * Adiciona uma nova transação ao armazenamento do visitante
 */
export function addGuestTransaction(data: TransactionFormData): Transaction {
  if (typeof window === 'undefined') {
    throw new Error('localStorage não disponível')
  }

  const existing = getGuestTransactions()
  
  // Verificar limite de transações
  if (existing.length >= MAX_GUEST_TRANSACTIONS) {
    throw new Error(`Limite de ${MAX_GUEST_TRANSACTIONS} transações atingido no modo visitante`)
  }

  const newTransaction: Transaction = {
    id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: 'guest',
    type: data.type,
    category: data.category,
    customCategory: data.customCategory,
    amount: data.amount,
    date: data.date,
    createdAt: new Date().toISOString(),
  }

  const updated = [...existing, newTransaction]
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated))
  
  return newTransaction
}

/**
 * Atualiza uma transação do visitante
 */
export function updateGuestTransaction(
  transactionId: string,
  data: Partial<TransactionFormData>
): Transaction {
  if (typeof window === 'undefined') {
    throw new Error('localStorage não disponível')
  }

  const existing = getGuestTransactions()
  const index = existing.findIndex(t => t.id === transactionId)
  
  if (index === -1) {
    throw new Error('Transação não encontrada')
  }

  const updated = [...existing]
  updated[index] = {
    ...updated[index],
    ...data,
    customCategory: data.customCategory !== undefined ? data.customCategory : updated[index].customCategory,
  }

  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated))
  
  return updated[index]
}

/**
 * Remove uma transação do visitante
 */
export function deleteGuestTransaction(transactionId: string): void {
  if (typeof window === 'undefined') {
    throw new Error('localStorage não disponível')
  }

  const existing = getGuestTransactions()
  const filtered = existing.filter(t => t.id !== transactionId)
  
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(filtered))
}

/**
 * Obtém o número de transações do visitante
 */
export function getGuestTransactionCount(): number {
  return getGuestTransactions().length
}

/**
 * Verifica se o visitante pode adicionar mais transações
 */
export function canAddGuestTransaction(): boolean {
  return getGuestTransactionCount() < MAX_GUEST_TRANSACTIONS
}

/**
 * Obtém transações do visitante filtradas por mês/ano
 */
export function getGuestTransactionsByMonth(
  year: number,
  month: number
): Transaction[] {
  const all = getGuestTransactions()
  
  return all.filter(transaction => {
    const date = new Date(transaction.date)
    return date.getFullYear() === year && date.getMonth() === month
  })
}

