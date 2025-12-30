'use client'

import AuthForm from '@/components/AuthForm'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Loading from '@/components/Loading'

function SignUpContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

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
