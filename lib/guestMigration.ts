// Utilitários para migração de dados do visitante para conta autenticada
import { getGuestTransactions, disableGuestMode } from './guestStorage'
import { createTransaction } from '@/services/firebase/firestore'
import { Transaction } from '@/types'

/**
 * Migra todas as transações do visitante para o Firestore
 * @param userId ID do usuário autenticado
 * @returns Número de transações migradas
 */
export async function migrateGuestTransactions(userId: string): Promise<number> {
  const guestTransactions = getGuestTransactions()
  
  if (guestTransactions.length === 0) {
    return 0
  }

  let migratedCount = 0

  try {
    // Migrar cada transação do visitante para o Firestore
    for (const transaction of guestTransactions) {
      try {
        await createTransaction(userId, {
          type: transaction.type,
          category: transaction.category,
          customCategory: transaction.customCategory,
          amount: transaction.amount,
          date: transaction.date,
        })
        migratedCount++
      } catch (error) {
        console.error('Erro ao migrar transação:', error)
        // Continuar com as outras transações mesmo se uma falhar
      }
    }

    // Limpar dados do visitante após migração bem-sucedida
    if (migratedCount > 0) {
      disableGuestMode()
    }

    return migratedCount
  } catch (error) {
    console.error('Erro durante migração de transações:', error)
    throw error
  }
}

/**
 * Verifica se há dados do visitante para migrar
 */
export function hasGuestData(): boolean {
  if (typeof window === 'undefined') return false
  const guestTransactions = getGuestTransactions()
  return guestTransactions.length > 0
}

/**
 * Obtém o número de transações do visitante
 */
export function getGuestTransactionCount(): number {
  if (typeof window === 'undefined') return 0
  const guestTransactions = getGuestTransactions()
  return guestTransactions.length
}

