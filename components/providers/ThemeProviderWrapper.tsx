'use client'

// Wrapper client-side para ThemeProvider e LanguageProvider
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { useAuth } from '@/hooks/useAuth'
import { Theme, Language } from '@/types'
import { useEffect, useState } from 'react'

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userData } = useAuth()
  const [initialTheme, setInitialTheme] = useState<Theme | undefined>(undefined)
  const [initialLanguage, setInitialLanguage] = useState<Language | undefined>(undefined)
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
  }, [userData])

  // Sempre renderizar os providers, mesmo durante SSR
  // Usar valores padrão se ainda não estiverem carregados
  return (
    <LanguageProvider userId={user?.uid || null} initialLanguage={initialLanguage || 'pt'}>
      <ThemeProvider userId={user?.uid || null} initialTheme={initialTheme || 'light'}>
        {children}
      </ThemeProvider>
    </LanguageProvider>
  )
}

