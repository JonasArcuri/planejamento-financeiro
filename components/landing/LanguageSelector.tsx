'use client'

// Componente de seletor de idioma para a landing page
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = async (newLanguage: 'pt' | 'en') => {
    await setLanguage(newLanguage)
    // Atualizar o atributo lang do HTML para SEO
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLanguage === 'pt' ? 'pt-BR' : 'en-US'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLanguageChange('pt')}
        className={`
          px-3 py-1.5 rounded-md text-sm font-medium transition-colors
          ${
            language === 'pt'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }
        `}
        aria-label="Português"
      >
        PT
      </button>
      <span className="text-gray-400 dark:text-gray-600">|</span>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`
          px-3 py-1.5 rounded-md text-sm font-medium transition-colors
          ${
            language === 'en'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }
        `}
        aria-label="English"
      >
        EN
      </button>
    </div>
  )
}

