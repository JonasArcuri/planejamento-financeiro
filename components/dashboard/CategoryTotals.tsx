'use client'

// Componente de totais por categoria
import { formatCurrency } from '@/lib/utils'

interface CategoryTotalsProps {
  data: Array<{
    category: string
    income: number
    expense: number
    total: number
  }>
}

export default function CategoryTotals({ data }: CategoryTotalsProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">Nenhuma transação registrada</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Totais por Categoria
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {data.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.category}</p>
              <div className="flex gap-4 mt-1 text-sm">
                {item.income > 0 && (
                  <span className="text-green-600">
                    +{formatCurrency(item.income)}
                  </span>
                )}
                {item.expense > 0 && (
                  <span className="text-red-600">
                    -{formatCurrency(item.expense)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-bold ${
                  item.total >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(item.total)}
              </p>
              <p className="text-xs text-gray-500">Saldo</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

