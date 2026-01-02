'use client'

// Componente de filtro de mês e ano
import { useState, useEffect } from 'react'
import Select from '@/components/ui/Select'

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
  const now = new Date()
  const currentMonth = defaultMonth || now.getMonth() + 1
  const currentYear = defaultYear || now.getFullYear()

  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  // Gerar opções de meses
  const monthOptions = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
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
          label="Mês"
          value={selectedMonth.toString()}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          options={monthOptions}
        />
      </div>
      <div className="flex-1">
        <Select
          label="Ano"
          value={selectedYear.toString()}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          options={yearOptions}
        />
      </div>
    </div>
  )
}

