// Serviços de autenticação Firebase
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './config'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './config'
import { User, UserPlan } from '@/types'

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
    return userCredential.user
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao fazer login')
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

    // Criar documento do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      plan: 'free' as UserPlan,
      createdAt: serverTimestamp(),
    })

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

