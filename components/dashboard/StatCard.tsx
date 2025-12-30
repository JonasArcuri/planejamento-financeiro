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
    default: 'bg-white border-gray-200',
    income: 'bg-green-50 border-green-200',
    expense: 'bg-red-50 border-red-200',
    balance: 'bg-blue-50 border-blue-200',
  }

  const textColors = {
    default: 'text-gray-900',
    income: 'text-green-700',
    expense: 'text-red-700',
    balance: 'text-blue-700',
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
          <p className="text-sm font-medium text-gray-600">{title}</p>
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

