// Componente de card de estatística
interface StatCardProps {
  title: string
  value: string
  icon?: React.ReactNode
  variant?: 'default' | 'income' | 'expense' | 'balance'
}

export default function StatCard({
  title,
  value,
  icon,
  variant = 'default',
}: StatCardProps) {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    income: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    expense: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    balance: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  }

  const textColors = {
    default: 'text-gray-900 dark:text-white',
    income: 'text-green-700 dark:text-green-400',
    expense: 'text-red-700 dark:text-red-400',
    balance: 'text-blue-700 dark:text-blue-400',
  }

  return (
    <div
      className={`
        rounded-lg border-2 p-6 shadow-sm
        ${variants[variant]}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${textColors[variant]}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className={`text-4xl ${textColors[variant]} opacity-50`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

