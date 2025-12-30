// Serviços do Firestore para usuários
import { doc, updateDoc } from 'firebase/firestore'
import { db } from './config'
import { UserPlan } from '@/types'

/**
 * Atualizar plano do usuário
 */
export async function updateUserPlan(
  userId: string,
  plan: UserPlan
): Promise<void> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      plan,
      updatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao atualizar plano do usuário')
  }
}

