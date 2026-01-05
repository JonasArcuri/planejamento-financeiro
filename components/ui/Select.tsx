// Componente de select reutilizável
import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 sm:py-2.5 border-2 rounded-xl text-base
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all min-h-[48px] sm:min-h-[44px] touch-manipulation
            ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select

