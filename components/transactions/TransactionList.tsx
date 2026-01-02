'use client'

// Lista de transações
import { Transaction } from '@/types'
import { formatCurrency } from '@/lib/currency'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCurrency } from '@/contexts/CurrencyContext'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transactionId: string) => void
  isLoading?: boolean
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  isLoading = false,
}: TransactionListProps) {
  const { t, language } = useLanguage()
  const { currency } = useCurrency()
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{t('transactions.noTransactions')}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          {t('transactions.noTransactionsDesc')}
        </p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const locale = language === 'en' ? 'en-US' : 'pt-BR'
    return new Date(dateString).toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-3 h-3 rounded-full
                    ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}
                  `}
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.category === 'Outros' && transaction.customCategory
                      ? `Outros - ${transaction.customCategory}`
                      : transaction.category}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p
                className={`
                  font-bold text-lg
                  ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
                `}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount, currency)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(transaction)}
                >
                  {t('common.edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  {t('common.delete')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

