// Componente de input reutilizável
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', type, ...props }, ref) => {
    // Garantir font-size mínimo de 16px para evitar zoom no iOS
    const fontSize = type === 'date' || type === 'time' || type === 'datetime-local' 
      ? 'text-base' 
      : 'text-base sm:text-sm'
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-3 sm:py-2.5 border-2 rounded-xl
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all min-h-[48px] sm:min-h-[44px]
            ${fontSize}
            ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

