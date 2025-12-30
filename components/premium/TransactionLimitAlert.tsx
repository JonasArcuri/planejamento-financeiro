'use client'

// Alerta de limite de transações
import { usePlan } from '@/hooks/usePlan'
import UpgradePrompt from './UpgradePrompt'

export default function TransactionLimitAlert() {
  const { isFree, currentTransactionCount, limit, remainingTransactions, canCreate } = usePlan()

  if (!isFree || canCreate.allowed) {
    return null
  }

  return (
    <div className="mb-4">
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="flex-1">
            <h4 className="font-semibold text-red-900 mb-1">Limite de Transações Atingido</h4>
            <p className="text-sm text-red-700 mb-3">
              Você atingiu o limite de {limit} transações no plano gratuito. 
              Faça upgrade para Premium e tenha transações ilimitadas!
            </p>
            <UpgradePrompt
              title="Upgrade para Premium"
              message="Desbloqueie transações ilimitadas e todas as funcionalidades premium"
              variant="inline"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

