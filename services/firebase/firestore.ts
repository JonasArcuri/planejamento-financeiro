// Serviços do Firestore para transações
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from './config'
import { Transaction, TransactionFormData } from '@/types'

const TRANSACTIONS_COLLECTION = 'transactions'

/**
 * Criar uma nova transação
 */
export async function createTransaction(
  userId: string,
  data: TransactionFormData
): Promise<string> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }
  try {
    // Converter data string para Timestamp
    const dateTimestamp = Timestamp.fromDate(new Date(data.date))
    
    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      userId,
      type: data.type,
      category: data.category,
      amount: data.amount,
      date: dateTimestamp, // Salvar como Timestamp
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao criar transação')
  }
}

/**
 * Atualizar uma transação existente
 */
export async function updateTransaction(
  transactionId: string,
  data: Partial<TransactionFormData>
): Promise<void> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }
  try {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId)
    
    // Converter data para Timestamp se fornecida
    const updateData: any = { ...data }
    if (data.date) {
      updateData.date = Timestamp.fromDate(new Date(data.date))
    }
    
    await updateDoc(transactionRef, updateData)
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao atualizar transação')
  }
}

/**
 * Deletar uma transação
 */
export async function deleteTransaction(transactionId: string): Promise<void> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }
  try {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId)
    await deleteDoc(transactionRef)
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao deletar transação')
  }
}

/**
 * Obter uma transação por ID
 */
export async function getTransaction(
  transactionId: string
): Promise<Transaction | null> {
  if (!db) {
    return null
  }
  try {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId)
    const transactionSnap = await getDoc(transactionRef)

    if (transactionSnap.exists()) {
      const data = transactionSnap.data()
      return {
        id: transactionSnap.id,
        ...data,
        date: data.date instanceof Timestamp
          ? data.date.toDate().toISOString()
          : data.date,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      } as Transaction
    }
    return null
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao buscar transação')
  }
}

/**
 * Obter todas as transações de um usuário
 */
export async function getUserTransactions(
  userId: string,
  filters?: {
    type?: 'income' | 'expense'
    startDate?: string
    endDate?: string
  }
): Promise<Transaction[]> {
  if (!db) {
    return []
  }
  try {
    const constraints: QueryConstraint[] = [where('userId', '==', userId)]

    if (filters?.type) {
      constraints.push(where('type', '==', filters.type))
    }

    if (filters?.startDate) {
      constraints.push(where('date', '>=', Timestamp.fromDate(new Date(filters.startDate))))
    }

    if (filters?.endDate) {
      constraints.push(where('date', '<=', Timestamp.fromDate(new Date(filters.endDate))))
    }

    // Sempre adicionar orderBy por date (requer índice composto no Firestore)
    constraints.push(orderBy('date', 'desc'))

    const q = query(collection(db, TRANSACTIONS_COLLECTION), ...constraints)
    const querySnapshot = await getDocs(q)

    const transactions = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        type: data.type,
        category: data.category,
        amount: data.amount,
        date: data.date instanceof Timestamp
          ? data.date.toDate().toISOString()
          : typeof data.date === 'string'
          ? data.date
          : new Date().toISOString(),
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      } as Transaction
    })
    
    return transactions
  } catch (error: any) {
    // Se o erro for sobre índice faltando, tentar sem orderBy
    if (error.code === 'failed-precondition' || error.message?.includes('index')) {
      console.warn('Índice composto não encontrado, buscando sem orderBy. Crie o índice no Firebase Console.')
      try {
        const constraints: QueryConstraint[] = [where('userId', '==', userId)]
        if (filters?.type) {
          constraints.push(where('type', '==', filters.type))
        }
        const q = query(collection(db, TRANSACTIONS_COLLECTION), ...constraints)
        const querySnapshot = await getDocs(q)
        
        const transactions = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            userId: data.userId,
            type: data.type,
            category: data.category,
            amount: data.amount,
            date: data.date instanceof Timestamp
              ? data.date.toDate().toISOString()
              : typeof data.date === 'string'
              ? data.date
              : new Date().toISOString(),
            createdAt: data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt,
          } as Transaction
        })
        
        // Ordenar manualmente por data
        return transactions.sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return dateB - dateA // Descendente
        })
      } catch (fallbackError: any) {
        console.error('Erro ao buscar transações:', fallbackError)
        throw new Error(fallbackError.message || 'Erro ao buscar transações')
      }
    }
    console.error('Erro ao buscar transações:', error)
    throw new Error(error.message || 'Erro ao buscar transações')
  }
}

/**
 * Obter transações de um mês específico
 */
export async function getMonthlyTransactions(
  userId: string,
  year: number,
  month: number
): Promise<Transaction[]> {
  try {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()

    return getUserTransactions(userId, { startDate, endDate })
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao buscar transações do mês')
  }
}

