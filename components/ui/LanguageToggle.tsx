'use client'

// Componente para alternar entre idioma PT e EN
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage, loading } = useLanguage()

  if (loading) {
    return (
      <button
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        disabled
        aria-label="Carregando idioma"
      >
        <svg
          className="w-5 h-5 text-gray-400 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={language === 'pt' ? 'Switch to English' : 'Alternar para Português'}
      title={language === 'pt' ? 'English' : 'Português'}
    >
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {language === 'pt' ? 'PT' : 'EN'}
      </span>
    </button>
  )
}

