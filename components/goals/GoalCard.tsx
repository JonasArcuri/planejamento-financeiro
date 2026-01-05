'use client'

// Card de meta financeira com barra de progresso
import { Goal } from '@/types'
import { formatCurrency } from '@/lib/currency'
import { calculateGoalProgress, getDaysRemaining, isGoalOverdue, isGoalNearDeadline } from '@/lib/goals'
import { Transaction } from '@/types'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCurrency } from '@/contexts/CurrencyContext'

interface GoalCardProps {
  goal: Goal
  transactions: Transaction[]
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onAddMoney: (goal: Goal) => void
}

export default function GoalCard({
  goal,
  transactions,
  onEdit,
  onDelete,
  onAddMoney,
}: GoalCardProps) {
  const { t } = useLanguage()
  const { currency } = useCurrency()
  const progress = calculateGoalProgress(goal, transactions)
  const daysRemaining = getDaysRemaining(goal.deadline)
  const isOverdue = isGoalOverdue(goal.deadline)
  const isNearDeadline = isGoalNearDeadline(goal.deadline)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getProgressColor = () => {
    if (progress.isCompleted) return 'bg-green-500'
    if (isOverdue) return 'bg-red-500'
    if (isNearDeadline) return 'bg-orange-500'
    return 'bg-primary-500'
  }

  const getStatusText = () => {
    if (progress.isCompleted) return t('goals.goalReached')
    if (isOverdue) return t('goals.deadlineExpired')
    if (daysRemaining <= 7) return `${daysRemaining} ${t('goals.daysRemaining')}`
    if (isNearDeadline) return `${daysRemaining} ${t('goals.daysRemaining')}`
    return `${daysRemaining} ${t('goals.daysRemaining')}`
  }

  const getStatusColor = () => {
    if (progress.isCompleted) return 'text-green-600 dark:text-green-400'
    if (isOverdue) return 'text-red-600 dark:text-red-400'
    if (isNearDeadline) return 'text-orange-600 dark:text-orange-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl border-2 p-4 md:p-5 lg:p-6
        ${progress.isCompleted ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'}
        hover:shadow-md dark:hover:shadow-lg transition-all active:scale-[0.99] touch-manipulation
      `}
    >
      {/* Layout Mobile-first: Vertical */}
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Cabeçalho: Título, Descrição e Ações */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">{goal.title}</h3>
            {goal.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 line-clamp-2">{goal.description}</p>
            )}
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t('goals.deadline')}: {formatDate(goal.deadline)}
            </p>
          </div>
          
          {/* Ações: Ícones */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Botão Adicionar Dinheiro - Ícone (apenas se não completada) */}
            {!progress.isCompleted && (
              <button
                onClick={() => onAddMoney(goal)}
                className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors touch-manipulation active:scale-95"
                aria-label={t('goals.addMoney')}
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            )}
            
            {/* Botão Editar - Ícone */}
            <button
              onClick={() => onEdit(goal)}
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
              onClick={() => onDelete(goal.id)}
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

        {/* Barra de progresso - Mobile-first */}
        <div>
          {/* Valores e Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('goals.progress')}</p>
              <p className="text-xl sm:text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(progress.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
              </p>
              {progress.incomeContribution > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{formatCurrency(progress.incomeContribution, currency)} {t('transactions.income')}
                </p>
              )}
            </div>
            <div className="text-left sm:text-right">
              <p className={`text-lg sm:text-sm font-semibold ${getStatusColor()}`}>
                {progress.percentage.toFixed(1)}%
              </p>
              <p className={`text-xs ${getStatusColor()}`}>
                {getStatusText()}
              </p>
            </div>
          </div>
          
          {/* Barra de progresso visual */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
          
          {/* Informações adicionais */}
          {progress.remaining > 0 && !progress.isCompleted && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('goals.remaining')} {formatCurrency(progress.remaining, currency)} {t('goals.toReachGoal')}
            </p>
          )}
          {progress.isCompleted && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              {t('goals.congratulations')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

