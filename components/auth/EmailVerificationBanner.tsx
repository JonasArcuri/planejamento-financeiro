'use client'

// Banner de aviso para e-mail não verificado
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { resendEmailVerification, getCurrentUser } from '@/services/firebase/auth'
import { useToast } from '@/contexts/ToastContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function EmailVerificationBanner() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const [isResending, setIsResending] = useState(false)
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null)

  // Verificar status de verificação do e-mail periodicamente
  useEffect(() => {
    if (!user) {
      setEmailVerified(null)
      return
    }

    // Verificar inicialmente
    setEmailVerified(user.emailVerified)

    // Verificar periodicamente (a cada 5 segundos) para atualizar quando o usuário verificar
    const interval = setInterval(() => {
      const currentUser = getCurrentUser()
      if (currentUser) {
        setEmailVerified(currentUser.emailVerified)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [user])

  // Não mostrar se o e-mail estiver verificado ou não houver usuário
  if (!user || emailVerified === true) {
    return null
  }

  const handleResendEmail = async () => {
    setIsResending(true)
    try {
      await resendEmailVerification()
      showToast('E-mail de verificação reenviado! Verifique sua caixa de entrada.', 'success')
    } catch (error: any) {
      showToast(error.message || 'Erro ao reenviar e-mail de verificação', 'error')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400 dark:text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Verifique seu e-mail
          </h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p>
              Enviamos um e-mail de verificação para <strong>{user.email}</strong>. 
              Por favor, verifique sua caixa de entrada e clique no link para confirmar sua conta.
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={isResending}
              className="text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Enviando...' : 'Reenviar e-mail de verificação'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

