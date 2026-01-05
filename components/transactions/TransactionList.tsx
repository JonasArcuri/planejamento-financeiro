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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-5 hover:shadow-md dark:hover:shadow-lg transition-all active:scale-[0.99] touch-manipulation"
        >
          {/* Layout Mobile-first: Vertical */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Conteúdo Principal */}
            <div className="flex-1 min-w-0">
              {/* Categoria e Indicador */}
              <div className="flex items-start gap-3 mb-2">
                <div
                  className={`
                    w-2 h-2 rounded-full mt-2 flex-shrink-0
                    ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}
                  `}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base text-gray-900 dark:text-white truncate">
                    {transaction.category === 'Outros' && transaction.customCategory
                      ? `Outros - ${transaction.customCategory}`
                      : transaction.category}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Valor e Ações */}
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              {/* Valor em Destaque */}
              <p
                className={`
                  font-bold text-xl sm:text-lg
                  ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
                `}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount, currency)}
              </p>

              {/* Ações: Ícones Editar e Excluir */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Botão Editar - Ícone */}
                <button
                  onClick={() => onEdit(transaction)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors touch-manipulation active:scale-95"
                  aria-label={t('common.edit')}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                {/* Botão Excluir - Ícone */}
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors touch-manipulation active:scale-95"
                  aria-label={t('common.delete')}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

