'use client'

// Card de meta financeira com barra de progresso
import { Goal } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { calculateGoalProgress, getDaysRemaining, isGoalOverdue, isGoalNearDeadline } from '@/lib/goals'
import { Transaction } from '@/types'
import Button from '@/components/ui/Button'

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
    if (progress.isCompleted) return 'Meta alcançada!'
    if (isOverdue) return 'Prazo vencido'
    if (daysRemaining <= 7) return `${daysRemaining} dias restantes`
    if (isNearDeadline) return `${daysRemaining} dias restantes`
    return `${daysRemaining} dias restantes`
  }

  const getStatusColor = () => {
    if (progress.isCompleted) return 'text-green-600'
    if (isOverdue) return 'text-red-600'
    if (isNearDeadline) return 'text-orange-600'
    return 'text-gray-600'
  }

  return (
    <div
      className={`
        bg-white rounded-lg border-2 p-6
        ${progress.isCompleted ? 'border-green-200' : 'border-gray-200'}
        hover:shadow-md transition-shadow
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
          )}
          <p className="text-sm text-gray-500">
            Prazo: {formatDate(goal.deadline)}
          </p>
        </div>
        <div className="flex gap-2">
          {!progress.isCompleted && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddMoney(goal)}
            >
              Guardar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(goal)}
          >
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(goal.id)}
            className="text-red-600 hover:text-red-700"
          >
            Excluir
          </Button>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-gray-700">Progresso</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(progress.currentAmount)} / {formatCurrency(goal.targetAmount)}
            </p>
            {progress.incomeContribution > 0 && (
              <p className="text-xs text-green-600 mt-1">
                +{formatCurrency(progress.incomeContribution)} de receitas
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
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
          />
        </div>
        {progress.remaining > 0 && !progress.isCompleted && (
          <p className="text-xs text-gray-500 mt-2">
            Faltam {formatCurrency(progress.remaining)} para alcançar a meta
          </p>
        )}
        {progress.isCompleted && (
          <p className="text-xs text-green-600 font-medium mt-2">
            🎉 Parabéns! Você alcançou sua meta!
          </p>
        )}
      </div>
    </div>
  )
}

