'use client'

// Componente para proteger rotas no cliente
// Permite acesso tanto para usuários autenticados quanto para modo visitante
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useGuest } from '@/contexts/GuestContext'
import Loading from './Loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean // Se true, exige autenticação real (não permite modo visitante)
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = false 
}: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const { isGuest } = useGuest()
  const router = useRouter()

  useEffect(() => {
    // Se a rota exige autenticação real, não permitir modo visitante
    if (requireAuth && !authLoading && !user) {
      router.push('/login')
      return
    }

    // Se não há usuário nem modo visitante, redirecionar para login
    if (!authLoading && !user && !isGuest) {
      router.push('/login')
    }
  }, [user, authLoading, isGuest, requireAuth, router])

  if (authLoading) {
    return <Loading />
  }

  // Se a rota exige autenticação real, verificar se há usuário
  if (requireAuth && !user) {
    return null
  }

  // Permitir acesso se houver usuário autenticado OU modo visitante ativo
  if (user || isGuest) {
    return <>{children}</>
  }

  return null
}

