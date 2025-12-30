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

    // Recarregar dados do usuário periodicamente para pegar atualizações de plano
    // (útil quando o plano é atualizado via webhook)
    const refreshInterval = setInterval(async () => {
      const currentUser = getCurrentUser()
      if (currentUser) {
        try {
          const data = await getUserData(currentUser.uid)
          // Só atualizar se o plano mudou para evitar re-renders desnecessários
          setUserData((prev) => {
            if (!prev || (data && data.plan !== prev.plan)) {
              return data
            }
            return prev
          })
        } catch (error) {
          console.error('Erro ao atualizar dados do usuário:', error)
        }
      }
    }, 10000) // A cada 10 segundos

    return () => {
      unsubscribe()
      clearInterval(refreshInterval)
    }
  }, [])

  return { user, userData, loading }
}

