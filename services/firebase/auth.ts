// Serviços de autenticação Firebase
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from './config'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './config'
import { User, UserPlan } from '@/types'
import { migrateGuestTransactions } from '@/lib/guestMigration'

const googleProvider = new GoogleAuthProvider()

/**
 * Login com email e senha
 */
export async function loginWithEmail(email: string, password: string) {
  if (!auth) {
    throw new Error('Firebase Auth não está inicializado')
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Verificar se o e-mail está verificado
    if (!user.emailVerified) {
      // Não bloquear o login, mas retornar informação sobre verificação
      return user
    }
    
    return user
  } catch (error: any) {
    // Tratar erros comuns do Firebase
    let errorMessage = 'Erro ao fazer login'
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'E-mail ou senha incorretos'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'E-mail ou senha incorretos'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'E-mail inválido'
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'Esta conta foi desativada'
    } else if (error.message) {
      errorMessage = error.message
    }
    throw new Error(errorMessage)
  }
}

/**
 * Enviar e-mail de verificação
 */
export async function resendEmailVerification() {
  if (!auth || !auth.currentUser) {
    throw new Error('Usuário não autenticado')
  }
  try {
    await sendEmailVerification(auth.currentUser)
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao enviar e-mail de verificação')
  }
}

/**
 * Enviar e-mail de recuperação de senha
 */
export async function resetPassword(email: string) {
  if (!auth) {
    throw new Error('Firebase Auth não está inicializado')
  }
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    // Não revelar se o e-mail existe ou não
    let errorMessage = 'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha'
    if (error.code === 'auth/invalid-email') {
      errorMessage = 'E-mail inválido'
    } else if (error.code === 'auth/user-not-found') {
      // Mesmo erro genérico para não revelar se o e-mail existe
      errorMessage = 'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha'
    } else if (error.message) {
      errorMessage = error.message
    }
    throw new Error(errorMessage)
  }
}

/**
 * Cadastro com email e senha
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  if (!auth || !db) {
    throw new Error('Firebase não está inicializado')
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    // Enviar e-mail de verificação
    try {
      await sendEmailVerification(user)
    } catch (error) {
      console.error('Erro ao enviar e-mail de verificação:', error)
      // Não falhar o cadastro se o envio do e-mail falhar
    }

    // Criar documento do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      plan: 'free' as UserPlan,
      createdAt: serverTimestamp(),
    })

    // Migrar transações do visitante se houver
    try {
      await migrateGuestTransactions(user.uid)
    } catch (error) {
      console.error('Erro ao migrar dados do visitante:', error)
      // Não falhar o cadastro se a migração falhar
    }

    return user
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao criar conta')
  }
}

/**
 * Login com Google
 */
export async function loginWithGoogle() {
  if (!auth || !db) {
    throw new Error('Firebase não está inicializado')
  }
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Verificar se o usuário já existe no Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))

    // Se não existir, criar documento
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || 'Usuário',
        email: user.email,
        plan: 'free' as UserPlan,
        createdAt: serverTimestamp(),
      })

      // Migrar transações do visitante se houver
      try {
        await migrateGuestTransactions(user.uid)
      } catch (error) {
        console.error('Erro ao migrar dados do visitante:', error)
        // Não falhar o login se a migração falhar
      }
    }

    return user
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao fazer login com Google')
  }
}

/**
 * Logout
 */
export async function logout() {
  if (!auth) {
    throw new Error('Firebase Auth não está inicializado')
  }
  try {
    await signOut(auth)
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao fazer logout')
  }
}

/**
 * Obter dados do usuário do Firestore
 */
export async function getUserData(userId: string): Promise<User | null> {
  if (!db) {
    return null
  }
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data(),
      } as User
    }
    return null
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
    return null
  }
}

/**
 * Observar mudanças no estado de autenticação
 */
export function onAuthStateChange(
  callback: (user: FirebaseUser | null) => void
) {
  if (!auth) {
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

/**
 * Obter usuário atual
 */
export function getCurrentUser(): FirebaseUser | null {
  if (!auth) {
    return null
  }
  return auth.currentUser
}

