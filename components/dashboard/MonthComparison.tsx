'use client'

// Componente de comparação mês atual vs mês anterior
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface MonthComparisonProps {
  current: {
    income: number
    expense: number
    balance: number
  }
  previous: {
    income: number
    expense: number
    balance: number
  }
  diff: {
    income: number
    expense: number
    balance: number
  }
  percent: {
    income: number
    expense: number
    balance: number
  }
}

export default function MonthComparison({
  current,
  previous,
  diff,
  percent,
}: MonthComparisonProps) {
  const { t } = useLanguage()
  
  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const getPercentColor = (value: number, isExpense: boolean = false) => {
    if (isExpense) {
      // Para despesas, aumento é ruim (vermelho), redução é bom (verde)
      return value > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
    } else {
      // Para receitas e saldo, aumento é bom (verde), redução é ruim (vermelho)
      return value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    }
  }

  const getPercentIcon = (value: number) => {
    if (value > 0) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      )
    } else if (value < 0) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('dashboard.monthlyComparison')}
      </h3>
      <div className="space-y-4">
        {/* Receitas */}
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('transactions.income')}</p>
            <p className="text-lg font-semibold text-green-700 dark:text-green-400">
              {formatCurrency(current.income)}
            </p>
            {previous.income > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Mês anterior: {formatCurrency(previous.income)}
              </p>
            )}
          </div>
          {previous.income > 0 && (
            <div className={`flex items-center gap-1 ${getPercentColor(percent.income)}`}>
              {getPercentIcon(percent.income)}
              <span className="font-medium">{formatPercent(percent.income)}</span>
            </div>
          )}
        </div>

        {/* Despesas */}
        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('transactions.expense')}</p>
            <p className="text-lg font-semibold text-red-700 dark:text-red-400">
              {formatCurrency(current.expense)}
            </p>
            {previous.expense > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Mês anterior: {formatCurrency(previous.expense)}
              </p>
            )}
          </div>
          {previous.expense > 0 && (
            <div className={`flex items-center gap-1 ${getPercentColor(percent.expense, true)}`}>
              {getPercentIcon(percent.expense)}
              <span className="font-medium">{formatPercent(percent.expense)}</span>
            </div>
          )}
        </div>

        {/* Saldo */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          current.balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'
        }`}>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.balance')}</p>
            <p className={`text-lg font-semibold ${
              current.balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'
            }`}>
              {formatCurrency(current.balance)}
            </p>
            {previous.balance !== 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Mês anterior: {formatCurrency(previous.balance)}
              </p>
            )}
          </div>
          {previous.balance !== 0 && (
            <div className={`flex items-center gap-1 ${getPercentColor(percent.balance)}`}>
              {getPercentIcon(percent.balance)}
              <span className="font-medium">{formatPercent(percent.balance)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

