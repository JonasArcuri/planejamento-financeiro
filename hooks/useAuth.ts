// Hook para gerenciar autenticação
import { useState, useEffect } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import {
  onAuthStateChange,
  getCurrentUser,
  getUserData,
} from '@/services/firebase/auth'
import { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar usuário atual
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      // Buscar dados do usuário no Firestore
      getUserData(currentUser.uid).then((data) => {
        setUserData(data)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }

    // Observar mudanças no estado de autenticação
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const data = await getUserData(firebaseUser.uid)
        setUserData(data)
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, userData, loading }
}

