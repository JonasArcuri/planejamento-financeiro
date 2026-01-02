'use client'

// Componente de alerta para gastos altos
import { Transaction } from '@/types'
import { formatCurrency } from '@/lib/currency'
import { useCurrency } from '@/contexts/CurrencyContext'

interface HighExpensesAlertProps {
  highExpenses: Array<{
    transaction: Transaction
    isHigh: boolean
    percentage: number
  }>
}

export default function HighExpensesAlert({ highExpenses }: HighExpensesAlertProps) {
  const { currency } = useCurrency()
  const expenses = highExpenses.filter((item) => item.isHigh)

  if (expenses.length === 0) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  }

  return (
    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-orange-600"
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
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">
            Gastos Altos Detectados
          </h3>
          <p className="text-sm text-orange-700 mb-3">
            As seguintes despesas estão acima de 150% da média mensal:
          </p>
          <div className="space-y-2">
            {expenses.slice(0, 5).map((item) => (
              <div
                key={item.transaction.id}
                className="flex items-center justify-between p-2 bg-white rounded border border-orange-200"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {item.transaction.category === 'Outros' && item.transaction.customCategory
                      ? `Outros - ${item.transaction.customCategory}`
                      : item.transaction.category}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(item.transaction.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">
                    {formatCurrency(item.transaction.amount, currency)}
                  </p>
                  <p className="text-xs text-orange-500">
                    {item.percentage}% da média
                  </p>
                </div>
              </div>
            ))}
          </div>
          {expenses.length > 5 && (
            <p className="text-xs text-orange-600 mt-2">
              +{expenses.length - 5} outros gastos altos
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

