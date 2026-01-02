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
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'

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
  const { theme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === 'dark'
  const textColor = isDark ? '#e5e7eb' : '#111827'
  const gridColor = isDark ? '#374151' : '#e5e7eb'

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">{t('transactions.noTransactions')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('dashboard.monthlyChart')}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: textColor }}
            stroke={gridColor}
          />
          <YAxis
            tick={{ fill: textColor }}
            stroke={gridColor}
            tickFormatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
              }).format(value)
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `1px solid ${gridColor}`,
              borderRadius: '8px',
              color: textColor,
            }}
            formatter={(value: number) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value)
            }
          />
          <Legend 
            wrapperStyle={{ color: textColor }}
          />
          <Bar dataKey="income" fill="#10b981" name={t('transactions.income')} />
          <Bar dataKey="expense" fill="#ef4444" name={t('transactions.expense')} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

