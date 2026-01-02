'use client'

// Context para gerenciar tema (Light/Dark)
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Theme } from '@/types'
import { updateUserPreferences } from '@/services/firebase/user'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  loading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  userId?: string | null
  initialTheme?: Theme
}

export function ThemeProvider({
  children,
  userId,
  initialTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme || 'light')
  const [loading, setLoading] = useState(true)

  // Carregar tema inicial
  useEffect(() => {
    // 1. Tentar carregar do localStorage primeiro (mais rápido)
    const savedTheme = localStorage.getItem('theme') as Theme | null

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme)
      applyTheme(savedTheme)
      setLoading(false)
      return
    }

    // 2. Se não houver no localStorage, verificar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const systemTheme: Theme = prefersDark ? 'dark' : 'light'
    
    setThemeState(systemTheme)
    applyTheme(systemTheme)
    setLoading(false)
  }, [])

  // Aplicar tema ao HTML
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Atualizar tema
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    
    // Salvar no localStorage
    localStorage.setItem('theme', newTheme)

    // Salvar no Firestore se houver userId
    if (userId) {
      try {
        await updateUserPreferences(userId, { theme: newTheme })
      } catch (error) {
        console.error('Erro ao salvar preferência de tema:', error)
        // Não bloquear a UI se houver erro ao salvar
      }
    }
  }

  // Alternar entre light e dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
}

