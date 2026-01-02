'use client'

// Componente de filtro de mês e ano
import { useState, useEffect } from 'react'
import Select from '@/components/ui/Select'
import { useLanguage } from '@/contexts/LanguageContext'

interface MonthYearFilterProps {
  onFilterChange: (month: number, year: number) => void
  defaultMonth?: number
  defaultYear?: number
}

export default function MonthYearFilter({
  onFilterChange,
  defaultMonth,
  defaultYear,
}: MonthYearFilterProps) {
  const { t } = useLanguage()
  const now = new Date()
  const currentMonth = defaultMonth || now.getMonth() + 1
  const currentYear = defaultYear || now.getFullYear()

  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  // Gerar opções de meses
  const monthOptions = [
    { value: '1', label: t('months.january') },
    { value: '2', label: t('months.february') },
    { value: '3', label: t('months.march') },
    { value: '4', label: t('months.april') },
    { value: '5', label: t('months.may') },
    { value: '6', label: t('months.june') },
    { value: '7', label: t('months.july') },
    { value: '8', label: t('months.august') },
    { value: '9', label: t('months.september') },
    { value: '10', label: t('months.october') },
    { value: '11', label: t('months.november') },
    { value: '12', label: t('months.december') },
  ]

  // Gerar opções de anos (últimos 5 anos + próximos 2 anos)
  const yearOptions = []
  const startYear = now.getFullYear() - 5
  const endYear = now.getFullYear() + 2
  for (let year = startYear; year <= endYear; year++) {
    yearOptions.push({ value: year.toString(), label: year.toString() })
  }

  // Notificar mudanças no filtro
  useEffect(() => {
    onFilterChange(selectedMonth, selectedYear)
  }, [selectedMonth, selectedYear, onFilterChange])

  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <Select
          label={t('reports.month')}
          value={selectedMonth.toString()}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          options={monthOptions}
        />
      </div>
      <div className="flex-1">
        <Select
          label={t('reports.year')}
          value={selectedYear.toString()}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          options={yearOptions}
        />
      </div>
    </div>
  )
}

