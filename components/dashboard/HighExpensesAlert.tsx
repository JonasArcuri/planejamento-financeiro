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
    // Se a string já estiver no formato YYYY-MM-DD, usar diretamente
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-')
      const date = new Date(Number(year), Number(month) - 1, Number(day))
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      })
    }
    // Caso contrário, tentar converter normalmente
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  }

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4 md:p-5 lg:p-6">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400"
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
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-orange-900 dark:text-orange-200 mb-1.5 sm:mb-2">
            Gastos Altos Detectados
          </h3>
          <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 mb-3">
            As seguintes despesas estão acima de 150% da média mensal:
          </p>
          <div className="space-y-2">
            {expenses.slice(0, 5).map((item) => (
              <div
                key={item.transaction.id}
                className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-800"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                    {(item.transaction.category === 'Outros' || item.transaction.category === 'Assinaturas') && item.transaction.customCategory
                      ? `${item.transaction.category} - ${item.transaction.customCategory}`
                      : item.transaction.category}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatDate(item.transaction.date)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm sm:text-base font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(item.transaction.amount, currency)}
                  </p>
                  <p className="text-xs text-orange-500 dark:text-orange-400">
                    {item.percentage}% da média
                  </p>
                </div>
              </div>
            ))}
          </div>
          {expenses.length > 5 && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
              +{expenses.length - 5} outros gastos altos
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

