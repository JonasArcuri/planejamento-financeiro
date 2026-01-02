'use client'

import AuthForm from '@/components/AuthForm'
import { useAuth } from '@/hooks/useAuth'
import { useGuest } from '@/contexts/GuestContext'
import { hasGuestData, getGuestTransactionCount } from '@/lib/guestMigration'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Loading from '@/components/Loading'
import { useLanguage } from '@/contexts/LanguageContext'

function SignUpContent() {
  const { user, loading } = useAuth()
  const { isGuest } = useGuest()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasGuestTransactions = hasGuestData()

  useEffect(() => {
    if (!loading && user) {
      const shouldUpgrade = searchParams.get('upgrade') === 'true'
      if (shouldUpgrade) {
        router.push('/upgrade')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, loading, router, searchParams])

  if (loading) {
    return <Loading />
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Comece a gerenciar suas finanças hoje
          </p>
          {hasGuestTransactions && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                💡 {(() => {
                  const count = getGuestTransactionCount()
                  return count === 1 
                    ? 'Sua transação do modo visitante será salva automaticamente após criar a conta.'
                    : `Suas ${count} transações do modo visitante serão salvas automaticamente após criar a conta.`
                })()}
              </p>
            </div>
          )}
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignUpContent />
    </Suspense>
  )
}
