'use client'

// Wrapper client-side para ThemeProvider, LanguageProvider e CurrencyProvider
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { useAuth } from '@/hooks/useAuth'
import { Theme, Language, Currency } from '@/types'
import { useEffect, useState } from 'react'
import { getDefaultCurrency } from '@/lib/currency'

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userData } = useAuth()
  const [initialTheme, setInitialTheme] = useState<Theme | undefined>(undefined)
  const [initialLanguage, setInitialLanguage] = useState<Language | undefined>(undefined)
  const [initialCurrency, setInitialCurrency] = useState<Currency | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Carregar tema inicial
    // 1. Tentar do Firestore (se houver userData)
    if (userData?.preferences?.theme) {
      setInitialTheme(userData.preferences.theme)
    } else {
      // 2. Tentar do localStorage
      const savedTheme = localStorage.getItem('theme') as Theme | null
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setInitialTheme(savedTheme)
      } else {
        // 3. Usar preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setInitialTheme(prefersDark ? 'dark' : 'light')
      }
    }

    // Carregar idioma inicial
    // 1. Tentar do Firestore (se houver userData)
    if (userData?.preferences?.language) {
      setInitialLanguage(userData.preferences.language)
    } else {
      // 2. Tentar do localStorage
      const savedLanguage = localStorage.getItem('language') as Language | null
      if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
        setInitialLanguage(savedLanguage)
      } else {
        // 3. Usar português como padrão
        setInitialLanguage('pt')
      }
    }

    // Carregar moeda inicial
    // 1. Tentar do Firestore (se houver userData)
    if (userData?.preferences?.currency) {
      setInitialCurrency(userData.preferences.currency)
    } else {
      // 2. Tentar do localStorage
      const savedCurrency = localStorage.getItem('currency') as Currency | null
      if (savedCurrency && (savedCurrency === 'BRL' || savedCurrency === 'USD')) {
        setInitialCurrency(savedCurrency)
      } else {
        // 3. Usar BRL como padrão
        setInitialCurrency(getDefaultCurrency())
      }
    }
  }, [userData])

  // Sempre renderizar os providers, mesmo durante SSR
  // Usar valores padrão se ainda não estiverem carregados
  return (
    <LanguageProvider userId={user?.uid || null} initialLanguage={initialLanguage || 'pt'}>
      <ThemeProvider userId={user?.uid || null} initialTheme={initialTheme || 'light'}>
        <CurrencyProvider userId={user?.uid || null} initialCurrency={initialCurrency || getDefaultCurrency()}>
          {children}
        </CurrencyProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}

