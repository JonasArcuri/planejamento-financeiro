// Serviços do Firestore para metas financeiras
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
} from 'firebase/firestore'
import { db } from './config'
import { Goal, GoalFormData } from '@/types'

const GOALS_COLLECTION = 'goals'

/**
 * Criar uma nova meta
 */
export async function createGoal(
  userId: string,
  data: GoalFormData
): Promise<string> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }
  try {
    const docRef = await addDoc(collection(db, GOALS_COLLECTION), {
      userId,
      ...data,
      currentAmount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao criar meta')
  }
}

/**
 * Atualizar uma meta existente
 */
export async function updateGoal(
  goalId: string,
  data: Partial<GoalFormData>
): Promise<void> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }
  try {
    const goalRef = doc(db, GOALS_COLLECTION, goalId)
    await updateDoc(goalRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao atualizar meta')
  }
}

/**
 * Atualizar valor atual da meta
 */
export async function updateGoalProgress(
  goalId: string,
  currentAmount: number
): Promise<void> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }
  try {
    const goalRef = doc(db, GOALS_COLLECTION, goalId)
    await updateDoc(goalRef, {
      currentAmount,
      updatedAt: Timestamp.now(),
    })
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao atualizar progresso da meta')
  }
}

/**
 * Adicionar dinheiro à meta (incrementar currentAmount)
 * Se fromBalance for true, cria uma transação de despesa automaticamente
 */
export async function addMoneyToGoal(
  goalId: string,
  amount: number,
  fromBalance: boolean = false,
  userId?: string,
  goalTitle?: string
): Promise<void> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }
  try {
    // Buscar meta atual para pegar o currentAmount
    const goalRef = doc(db, GOALS_COLLECTION, goalId)
    const goalSnap = await getDoc(goalRef)
    
    if (!goalSnap.exists()) {
      throw new Error('Meta não encontrada')
    }
    
    const goalData = goalSnap.data()
    const currentAmount = goalData.currentAmount || 0
    const newAmount = currentAmount + amount
    const title = goalTitle || goalData.title || 'Meta'
    
    // Atualizar o valor da meta
    await updateDoc(goalRef, {
      currentAmount: newAmount,
      updatedAt: Timestamp.now(),
    })

    // Se o dinheiro vier do saldo, criar uma transação de despesa
    if (fromBalance && userId) {
      const { createTransaction } = await import('./firestore')
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // Formato: YYYY-MM-DD
      const dateString = today.toISOString().split('T')[0]
      
      await createTransaction(userId, {
        type: 'expense',
        category: 'Outros',
        amount: amount,
        date: dateString,
      })
    }
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao adicionar dinheiro à meta')
  }
}

/**
 * Deletar uma meta
 */
export async function deleteGoal(goalId: string): Promise<void> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }
  try {
    const goalRef = doc(db, GOALS_COLLECTION, goalId)
    await deleteDoc(goalRef)
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao deletar meta')
  }
}

/**
 * Obter uma meta por ID
 */
export async function getGoal(goalId: string): Promise<Goal | null> {
  if (!db) {
    return null
  }
  try {
    const goalRef = doc(db, GOALS_COLLECTION, goalId)
    const goalSnap = await getDoc(goalRef)

    if (goalSnap.exists()) {
      const data = goalSnap.data()
      return {
        id: goalSnap.id,
        userId: data.userId,
        title: data.title,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount || 0,
        deadline: data.deadline instanceof Timestamp
          ? data.deadline.toDate().toISOString()
          : data.deadline,
        description: data.description,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt,
      } as Goal
    }
    return null
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao buscar meta')
  }
}

/**
 * Obter todas as metas de um usuário
 */
export async function getUserGoals(userId: string): Promise<Goal[]> {
  if (!db) {
    return []
  }
  try {
    const q = query(
      collection(db, GOALS_COLLECTION),
      where('userId', '==', userId),
      orderBy('deadline', 'asc')
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount || 0,
        deadline: data.deadline instanceof Timestamp
          ? data.deadline.toDate().toISOString()
          : data.deadline,
        description: data.description,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt,
      } as Goal
    })
  } catch (error: any) {
    // Se o erro for sobre índice faltando, tentar sem orderBy
    if (error.code === 'failed-precondition' || error.message?.includes('index')) {
      console.warn('Índice não encontrado, buscando sem orderBy')
      try {
        const q = query(
          collection(db, GOALS_COLLECTION),
          where('userId', '==', userId)
        )
        const querySnapshot = await getDocs(q)
        const goals = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            userId: data.userId,
            title: data.title,
            targetAmount: data.targetAmount,
            currentAmount: data.currentAmount || 0,
            deadline: data.deadline instanceof Timestamp
              ? data.deadline.toDate().toISOString()
              : data.deadline,
            description: data.description,
            createdAt: data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate().toISOString()
              : data.updatedAt,
          } as Goal
        })
        // Ordenar manualmente por deadline
        return goals.sort((a, b) => 
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        )
      } catch (fallbackError: any) {
        throw new Error(fallbackError.message || 'Erro ao buscar metas')
      }
    }
    throw new Error(error.message || 'Erro ao buscar metas')
  }
}

