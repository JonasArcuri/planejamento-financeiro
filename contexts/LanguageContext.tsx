'use client'

// Context para gerenciar idioma (PT/EN)
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { updateUserPreferences } from '@/services/firebase/user'
import ptTranslations from '@/locales/pt.json'
import enTranslations from '@/locales/en.json'

export type Language = 'pt' | 'en'

interface Translations {
  [key: string]: any
}

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  loading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
  userId?: string | null
  initialLanguage?: Language
}

const translations: Record<Language, Translations> = {
  pt: ptTranslations,
  en: enTranslations,
}

export function LanguageProvider({
  children,
  userId,
  initialLanguage,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage || 'pt')
  const [loading, setLoading] = useState(false) // Começar como false para SSR

  // Carregar idioma inicial (apenas no cliente)
  useEffect(() => {
    // 1. Tentar carregar do localStorage primeiro (mais rápido)
    const savedLanguage = localStorage.getItem('language') as Language | null

    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage)
      return
    }

    // 2. Se não houver no localStorage e não houver initialLanguage, usar português como padrão
    if (!initialLanguage) {
      setLanguageState('pt')
    }
  }, [initialLanguage])

  // Função de tradução
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback para português se a chave não existir
        value = translations.pt
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2]
          } else {
            return key // Retornar a chave se não encontrar tradução
          }
        }
        break
      }
    }

    return typeof value === 'string' ? value : key
  }

  // Atualizar idioma
  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage)
    
    // Salvar no localStorage
    localStorage.setItem('language', newLanguage)

    // Salvar no Firestore se houver userId
    if (userId) {
      try {
        await updateUserPreferences(userId, { language: newLanguage })
      } catch (error) {
        console.error('Erro ao salvar preferência de idioma:', error)
        // Não bloquear a UI se houver erro ao salvar
      }
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, loading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider')
  }
  return context
}

