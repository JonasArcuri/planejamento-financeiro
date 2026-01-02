'use client'

// Componente de totais por categoria
import { formatCurrency } from '@/lib/currency'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCurrency } from '@/contexts/CurrencyContext'

interface CategoryTotalsProps {
  data: Array<{
    category: string
    income: number
    expense: number
    total: number
  }>
}

export default function CategoryTotals({ data }: CategoryTotalsProps) {
  const { t } = useLanguage()
  const { currency } = useCurrency()
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">{t('transactions.noTransactions')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('dashboard.categoryTotals')}
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {data.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{item.category}</p>
              <div className="flex gap-4 mt-1 text-sm">
                {item.income > 0 && (
                  <span className="text-green-600 dark:text-green-400">
                    +{formatCurrency(item.income, currency)}
                  </span>
                )}
                {item.expense > 0 && (
                  <span className="text-red-600 dark:text-red-400">
                    -{formatCurrency(item.expense, currency)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-bold ${
                  item.total >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {formatCurrency(item.total, currency)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.balance')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

