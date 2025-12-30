'use client'

// Componente de prompt para upgrade
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

interface UpgradePromptProps {
  title: string
  message: string
  onUpgrade?: () => void
  variant?: 'default' | 'inline' | 'banner'
}

export default function UpgradePrompt({
  title,
  message,
  onUpgrade,
  variant = 'default',
}: UpgradePromptProps) {
  const router = useRouter()

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      // Redirecionar para página de upgrade
      router.push('/upgrade')
    }
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-purple-50 border-2 border-primary-200 rounded-lg">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleUpgrade} className="ml-4">
          Fazer Upgrade
        </Button>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg">{title}</h4>
            <p className="text-sm text-primary-100 mt-1">{message}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpgrade}
            className="bg-white text-primary-600 hover:bg-primary-50 border-white"
          >
            Upgrade Agora
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-primary-200 rounded-lg p-6 text-center">
      <div className="mb-4">
        <svg
          className="w-16 h-16 mx-auto text-primary-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <Button variant="primary" onClick={handleUpgrade}>
        Fazer Upgrade para Premium
      </Button>
    </div>
  )
}

