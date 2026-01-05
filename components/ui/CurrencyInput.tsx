'use client'

// Componente de input formatado para valores monetários
import { InputHTMLAttributes, forwardRef, useState, useEffect, useRef } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Currency } from '@/types'

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string
  error?: string
  value?: number | undefined
  onChange?: (value: number | undefined) => void
}

/**
 * Converte um número para string formatada conforme a moeda
 */
function formatNumberToCurrency(value: number | undefined, currency: Currency): string {
  if (value === undefined || value === null || isNaN(value)) {
    return ''
  }

  const config = currency === 'BRL' 
    ? { locale: 'pt-BR', symbol: 'R$' }
    : { locale: 'en-US', symbol: '$' }

  // Formatar com 2 casas decimais
  const formatted = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

  return formatted
}

/**
 * Converte uma string formatada de volta para número
 */
function parseCurrencyToNumber(value: string, currency: Currency): number | undefined {
  if (!value || value.trim() === '') {
    return undefined
  }

  // Remover símbolos e caracteres não numéricos (exceto ponto e vírgula)
  let cleaned = value.replace(/[^\d,.-]/g, '')

  if (currency === 'BRL') {
    // Formato brasileiro: 1.234,56
    // Substituir ponto por nada (separador de milhar) e vírgula por ponto (decimal)
    cleaned = cleaned.replace(/\./g, '').replace(',', '.')
  } else {
    // Formato americano: 1,234.56
    // Remover vírgulas (separador de milhar) e manter ponto (decimal)
    cleaned = cleaned.replace(/,/g, '')
  }

  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? undefined : parsed
}

/**
 * Formata o valor enquanto o usuário digita
 * Aceita números e formata automaticamente com 2 casas decimais
 */
function formatInputValue(value: string, currency: Currency): string {
  if (!value || value.trim() === '') {
    return ''
  }

  // Remover tudo exceto números
  let numbers = value.replace(/\D/g, '')

  if (numbers === '') {
    return ''
  }

  // Converter para número (já em centavos se necessário)
  // Se o usuário digitar "1234", vamos tratar como 1234.00
  // Se digitar "123456", vamos tratar como 1234.56 (últimos 2 dígitos são centavos)
  let number: number
  if (numbers.length <= 2) {
    // Se tiver 1 ou 2 dígitos, são centavos
    number = parseInt(numbers, 10) / 100
  } else {
    // Se tiver mais de 2 dígitos, os últimos 2 são centavos
    const reais = numbers.slice(0, -2)
    const centavos = numbers.slice(-2)
    number = parseFloat(`${reais}.${centavos}`)
  }

  // Formatar conforme a moeda
  if (currency === 'BRL') {
    // Formato brasileiro: 1.234,56
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number)
  } else {
    // Formato americano: 1,234.56
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number)
  }
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, error, value, onChange, className = '', ...props }, ref) => {
    const { currency } = useCurrency()
    const [displayValue, setDisplayValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const cursorPositionRef = useRef<number>(0)

    // Atualizar displayValue quando value externo mudar
    useEffect(() => {
      if (value !== undefined && value !== null && !isNaN(value)) {
        const formatted = formatNumberToCurrency(value, currency)
        setDisplayValue(formatted)
      } else {
        setDisplayValue('')
      }
    }, [value, currency])

    // Garantir font-size mínimo de 16px para evitar zoom no iOS
    const fontSize = 'text-base sm:text-sm'

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      cursorPositionRef.current = e.target.selectionStart || 0

      // Formatar o valor conforme o usuário digita
      const formatted = formatInputValue(inputValue, currency)
      setDisplayValue(formatted)

      // Converter para número e chamar onChange
      const numericValue = parseCurrencyToNumber(formatted, currency)
      onChange?.(numericValue)

      // Restaurar posição do cursor após formatação
      setTimeout(() => {
        const input = inputRef.current || (ref as React.RefObject<HTMLInputElement>)?.current
        if (input) {
          // Calcular nova posição do cursor
          const lengthDiff = formatted.length - inputValue.length
          const newPosition = Math.min(
            cursorPositionRef.current + lengthDiff,
            formatted.length
          )
          input.setSelectionRange(newPosition, newPosition)
        }
      }, 0)
    }

    const handleBlur = () => {
      // Garantir que sempre tenha 2 casas decimais ao perder o foco
      if (displayValue && value !== undefined) {
        const formatted = formatNumberToCurrency(value, currency)
        setDisplayValue(formatted)
      }
    }

    // Usar ref interno ou externo
    const inputRefToUse = ref || inputRef

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none">
            {currency === 'BRL' ? 'R$' : '$'}
          </span>
          <input
            ref={inputRefToUse}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`
              w-full pl-10 pr-4 py-3 sm:py-2.5 border-2 rounded-xl
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-all min-h-[48px] sm:min-h-[44px]
              ${fontSize}
              ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
              ${className}
            `}
            placeholder={currency === 'BRL' ? '0,00' : '0.00'}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'

export default CurrencyInput

