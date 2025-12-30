'use client'

// Gráfico de barras: receitas vs despesas por mês
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface MonthlyComparisonChartProps {
  data: Array<{
    month: string
    income: number
    expense: number
  }>
}

export default function MonthlyComparisonChart({
  data,
}: MonthlyComparisonChartProps) {
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
        Receitas vs Despesas (Últimos 6 meses)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
              }).format(value)
            }
          />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value)
            }
          />
          <Legend />
          <Bar dataKey="income" fill="#10b981" name="Receitas" />
          <Bar dataKey="expense" fill="#ef4444" name="Despesas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

