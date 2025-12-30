'use client'

// Contador de transações restantes
import { usePlan } from '@/hooks/usePlan'

export default function TransactionCounter() {
  const { isFree, currentTransactionCount, limit, remainingTransactions } = usePlan()

  if (!isFree) {
    return null
  }

  const percentage = (currentTransactionCount / limit) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 100

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Transações do Plano Free
        </span>
        <span
          className={`text-sm font-bold ${
            isAtLimit
              ? 'text-red-600'
              : isNearLimit
              ? 'text-orange-600'
              : 'text-gray-600'
          }`}
        >
          {currentTransactionCount} / {limit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isAtLimit
              ? 'bg-red-500'
              : isNearLimit
              ? 'bg-orange-500'
              : 'bg-primary-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {remainingTransactions > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {remainingTransactions} transação{remainingTransactions !== 1 ? 'ões' : ''} restante{remainingTransactions !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

