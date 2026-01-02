// Serviços para exclusão de conta do usuário
import { 
  deleteUser, 
  reauthenticateWithCredential,
  EmailAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth, db } from './config'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc,
  writeBatch,
} from 'firebase/firestore'

const TRANSACTIONS_COLLECTION = 'transactions'
const GOALS_COLLECTION = 'goals'
const USERS_COLLECTION = 'users'

/**
 * Reautenticar usuário antes de operações sensíveis
 */
export async function reauthenticateUser(
  user: FirebaseUser,
  password: string
): Promise<void> {
  if (!auth || !user.email) {
    throw new Error('Usuário não autenticado ou sem e-mail')
  }

  try {
    // Criar credencial de e-mail/senha
    const credential = EmailAuthProvider.credential(user.email, password)
    
    // Reautenticar
    await reauthenticateWithCredential(user, credential)
  } catch (error: any) {
    // Se o usuário fez login com Google, não precisa de senha
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Senha incorreta. Por favor, verifique e tente novamente.')
    }
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('Por favor, faça login novamente antes de continuar.')
    }
    throw new Error(error.message || 'Erro ao reautenticar usuário')
  }
}

/**
 * Excluir todas as transações de um usuário
 */
async function deleteAllUserTransactions(userId: string): Promise<void> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }

  try {
    // Buscar todas as transações do usuário
    const transactionsQuery = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('userId', '==', userId)
    )
    const transactionsSnapshot = await getDocs(transactionsQuery)

    // Usar batch para excluir em lote (máximo 500 por batch)
    const MAX_BATCH_SIZE = 500
    const docs = transactionsSnapshot.docs
    let batchCount = 0
    let currentBatch = writeBatch(db)

    for (const transactionDoc of docs) {
      if (batchCount >= MAX_BATCH_SIZE) {
        // Se atingir o limite, executar batch e criar novo
        await currentBatch.commit()
        currentBatch = writeBatch(db)
        batchCount = 0
      }
      currentBatch.delete(transactionDoc.ref)
      batchCount++
    }

    // Executar batch final
    if (batchCount > 0) {
      await currentBatch.commit()
    }
  } catch (error: any) {
    throw new Error(`Erro ao excluir transações: ${error.message}`)
  }
}

/**
 * Excluir todas as metas de um usuário
 */
async function deleteAllUserGoals(userId: string): Promise<void> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }

  try {
    // Buscar todas as metas do usuário
    const goalsQuery = query(
      collection(db, GOALS_COLLECTION),
      where('userId', '==', userId)
    )
    const goalsSnapshot = await getDocs(goalsQuery)

    // Usar batch para excluir em lote
    const MAX_BATCH_SIZE = 500
    const docs = goalsSnapshot.docs
    let batchCount = 0
    let currentBatch = writeBatch(db)

    for (const goalDoc of docs) {
      if (batchCount >= MAX_BATCH_SIZE) {
        // Se atingir o limite, executar batch e criar novo
        await currentBatch.commit()
        currentBatch = writeBatch(db)
        batchCount = 0
      }
      currentBatch.delete(goalDoc.ref)
      batchCount++
    }

    // Executar batch final
    if (batchCount > 0) {
      await currentBatch.commit()
    }
  } catch (error: any) {
    throw new Error(`Erro ao excluir metas: ${error.message}`)
  }
}

/**
 * Excluir documento do usuário no Firestore
 */
async function deleteUserDocument(userId: string): Promise<void> {
  if (!db) {
    throw new Error('Firestore não está inicializado')
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, userId)
    await deleteDoc(userRef)
  } catch (error: any) {
    throw new Error(`Erro ao excluir documento do usuário: ${error.message}`)
  }
}

/**
 * Excluir conta do Firebase Auth
 */
async function deleteAuthAccount(user: FirebaseUser): Promise<void> {
  if (!auth) {
    throw new Error('Firebase Auth não está inicializado')
  }

  try {
    await deleteUser(user)
  } catch (error: any) {
    // Se o erro for de reautenticação necessária, relançar
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('Reautenticação necessária. Por favor, faça login novamente.')
    }
    throw new Error(`Erro ao excluir conta: ${error.message}`)
  }
}

/**
 * Excluir conta completa do usuário (todos os dados + conta Auth)
 * 
 * @param user - Usuário autenticado do Firebase
 * @param password - Senha do usuário para reautenticação (opcional se login foi via Google)
 * @returns Promise que resolve quando a exclusão for concluída
 */
export async function deleteUserAccount(
  user: FirebaseUser,
  password?: string
): Promise<void> {
  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const userId = user.uid

  try {
    // 1. Reautenticar usuário (se necessário e se senha fornecida)
    // Nota: Usuários que fizeram login com Google não precisam de senha
    if (password && user.email && user.providerData[0]?.providerId === 'password') {
      await reauthenticateUser(user, password)
    }

    // 2. Excluir todas as transações do usuário
    await deleteAllUserTransactions(userId)

    // 3. Excluir todas as metas do usuário
    await deleteAllUserGoals(userId)

    // 4. Excluir documento do usuário no Firestore
    await deleteUserDocument(userId)

    // 5. Excluir conta do Firebase Auth (deve ser o último passo)
    await deleteAuthAccount(user)

    // Se chegou aqui, tudo foi excluído com sucesso
  } catch (error: any) {
    // Se houver erro, relançar com mensagem clara
    throw new Error(error.message || 'Erro ao excluir conta. Tente novamente.')
  }
}

