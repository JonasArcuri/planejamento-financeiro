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
        bg-white dark:bg-gray-800 rounded-lg border-2 p-6
        ${progress.isCompleted ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'}
        hover:shadow-md dark:hover:shadow-lg transition-shadow
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{goal.description}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('goals.deadline')}: {formatDate(goal.deadline)}
          </p>
        </div>
        <div className="flex gap-2">
          {!progress.isCompleted && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddMoney(goal)}
            >
              {t('goals.addMoney')}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(goal)}
          >
            {t('common.edit')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(goal.id)}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            Excluir
          </Button>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('goals.progress')}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(progress.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
            </p>
            {progress.incomeContribution > 0 && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                +{formatCurrency(progress.incomeContribution, currency)} {t('transactions.income')}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${getStatusColor()}`}>
              {progress.percentage.toFixed(1)}%
            </p>
            <p className={`text-xs ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
          />
        </div>
        {progress.remaining > 0 && !progress.isCompleted && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {t('goals.remaining')} {formatCurrency(progress.remaining, currency)} {t('goals.toReachGoal')}
          </p>
        )}
        {progress.isCompleted && (
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">
            {t('goals.congratulations')}
          </p>
        )}
      </div>
    </div>
  )
}

