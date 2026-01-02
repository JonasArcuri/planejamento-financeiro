'use client'

// Lista de transações
import { Transaction } from '@/types'
import { formatCurrency } from '@/lib/utils'
import Button from '@/components/ui/Button'

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
        <p className="text-gray-500">Nenhuma transação registrada</p>
        <p className="text-sm text-gray-400 mt-2">
          Clique em &quot;Nova Transação&quot; para começar
        </p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
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
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
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
                  <p className="font-medium text-gray-900">
                    {transaction.category === 'Outros' && transaction.customCategory
                      ? `Outros - ${transaction.customCategory}`
                      : transaction.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p
                className={`
                  font-bold text-lg
                  ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                `}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(transaction)}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

