// Helper para formatação e manipulação de moedas
import { Currency } from '@/types'

/**
 * Configurações de formatação por moeda
 */
const CURRENCY_CONFIG: Record<Currency, { locale: string; symbol: string; name: string }> = {
  BRL: {
    locale: 'pt-BR',
    symbol: 'R$',
    name: 'Real Brasileiro',
  },
  USD: {
    locale: 'en-US',
    symbol: '$',
    name: 'US Dollar',
  },
}

/**
 * Formatar valor monetário de acordo com a moeda selecionada
 * 
 * @param value - Valor numérico a ser formatado
 * @param currency - Moeda a ser usada (padrão: BRL)
 * @returns String formatada (ex: "R$ 1.234,56" ou "$1,234.56")
 * 
 * @example
 * formatCurrency(1234.56, 'BRL') // "R$ 1.234,56"
 * formatCurrency(1234.56, 'USD') // "$1,234.56"
 */
export function formatCurrency(value: number, currency: Currency = 'BRL'): string {
  const config = CURRENCY_CONFIG[currency]
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Obter símbolo da moeda
 * 
 * @param currency - Moeda
 * @returns Símbolo da moeda (ex: "R$" ou "$")
 */
export function getCurrencySymbol(currency: Currency = 'BRL'): string {
  return CURRENCY_CONFIG[currency].symbol
}

/**
 * Obter nome da moeda
 * 
 * @param currency - Moeda
 * @returns Nome da moeda (ex: "Real Brasileiro" ou "US Dollar")
 */
export function getCurrencyName(currency: Currency = 'BRL'): string {
  return CURRENCY_CONFIG[currency].name
}

/**
 * Obter locale da moeda para formatação
 * 
 * @param currency - Moeda
 * @returns Locale (ex: "pt-BR" ou "en-US")
 */
export function getCurrencyLocale(currency: Currency = 'BRL'): string {
  return CURRENCY_CONFIG[currency].locale
}

/**
 * Validar se uma string é uma moeda válida
 * 
 * @param currency - String a ser validada
 * @returns true se for uma moeda válida
 */
export function isValidCurrency(currency: string): currency is Currency {
  return currency === 'BRL' || currency === 'USD'
}

/**
 * Obter moeda padrão
 * 
 * @returns Moeda padrão (BRL)
 */
export function getDefaultCurrency(): Currency {
  return 'BRL'
}

