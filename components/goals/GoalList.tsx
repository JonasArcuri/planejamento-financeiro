'use client'

// Lista de metas financeiras
import { Goal, Transaction } from '@/types'
import GoalCard from './GoalCard'
import Loading from '@/components/Loading'

interface GoalListProps {
  goals: Goal[]
  transactions: Transaction[]
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onAddMoney: (goal: Goal) => void
  isLoading?: boolean
}

export default function GoalList({
  goals,
  transactions,
  onEdit,
  onDelete,
  onAddMoney,
  isLoading = false,
}: GoalListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading />
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
        <p className="text-gray-500 mb-2">Nenhuma meta criada ainda</p>
        <p className="text-sm text-gray-400">
          Crie sua primeira meta de poupança para começar
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          transactions={transactions}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddMoney={onAddMoney}
        />
      ))}
    </div>
  )
}

