'use client'

// Resumo de metas no dashboard
import { Goal, Transaction } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { calculateGoalProgress, getDaysRemaining } from '@/lib/goals'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

interface GoalsSummaryProps {
  goals: Goal[]
  transactions: Transaction[]
}

export default function GoalsSummary({ goals, transactions }: GoalsSummaryProps) {
  const router = useRouter()

  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma Meta Criada
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Crie metas de poupança e acompanhe seu progresso
          </p>
          <Button variant="primary" size="sm" onClick={() => router.push('/goals')}>
            Criar Primeira Meta
          </Button>
        </div>
      </div>
    )
  }

  const activeGoals = goals.filter((goal) => {
    const progress = calculateGoalProgress(goal, transactions)
    return !progress.isCompleted
  })

  const completedGoals = goals.filter((goal) => {
    const progress = calculateGoalProgress(goal, transactions)
    return progress.isCompleted
  })

  // Mostrar até 3 metas ativas
  const displayGoals = activeGoals.slice(0, 3)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Metas Financeiras</h3>
        <Button variant="ghost" size="sm" onClick={() => router.push('/goals')}>
          Ver Todas
        </Button>
      </div>

      {displayGoals.length > 0 ? (
        <div className="space-y-4">
          {displayGoals.map((goal) => {
            const progress = calculateGoalProgress(goal, transactions)
            const daysRemaining = getDaysRemaining(goal.deadline)

            return (
              <div key={goal.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(progress.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary-600">
                    {progress.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Prazo vencido'}
                </p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-2">
            🎉 Todas as metas foram alcançadas!
          </p>
          <p className="text-xs text-gray-500">
            {completedGoals.length} meta{completedGoals.length !== 1 ? 's' : ''} completada{completedGoals.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/goals')}
        >
          {activeGoals.length > 0 ? 'Gerenciar Metas' : 'Criar Nova Meta'}
        </Button>
      </div>
    </div>
  )
}

