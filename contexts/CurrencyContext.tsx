'use client'

// Context para gerenciar moeda (BRL/USD)
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { updateUserPreferences } from '@/services/firebase/user'
import { Currency } from '@/types'
import { getDefaultCurrency } from '@/lib/currency'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  loading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

interface CurrencyProviderProps {
  children: ReactNode
  userId?: string | null
  initialCurrency?: Currency
}

export function CurrencyProvider({
  children,
  userId,
  initialCurrency,
}: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency || getDefaultCurrency())
  const [loading, setLoading] = useState(false)

  // Carregar moeda inicial (apenas no cliente)
  useEffect(() => {
    // 1. Tentar carregar do localStorage primeiro (mais rápido)
    const savedCurrency = localStorage.getItem('currency') as Currency | null

    if (savedCurrency && (savedCurrency === 'BRL' || savedCurrency === 'USD')) {
      setCurrencyState(savedCurrency)
      return
    }

    // 2. Se não houver no localStorage e não houver initialCurrency, usar BRL como padrão
    if (!initialCurrency) {
      setCurrencyState(getDefaultCurrency())
    } else {
      setCurrencyState(initialCurrency)
    }
  }, [initialCurrency])

  // Atualizar moeda
  const setCurrency = async (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    
    // Salvar no localStorage
    localStorage.setItem('currency', newCurrency)

    // Salvar no Firestore se houver userId
    if (userId) {
      try {
        await updateUserPreferences(userId, { currency: newCurrency })
      } catch (error) {
        console.error('Erro ao salvar preferência de moeda:', error)
        // Não bloquear a UI se houver erro ao salvar
      }
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, loading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency deve ser usado dentro de um CurrencyProvider')
  }
  return context
}

