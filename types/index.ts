// Tipos principais da aplicação

export type TransactionType = 'income' | 'expense'

export type UserPlan = 'free' | 'premium'
export type Theme = 'light' | 'dark'
export type Language = 'pt' | 'en'

export interface UserPreferences {
  theme?: Theme
  language?: Language
}

export interface User {
  id: string
  name: string
  email: string
  plan: UserPlan
  preferences?: UserPreferences
}

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  category: string
  customCategory?: string // Campo opcional para especificar categoria quando "Outros" é selecionado
  amount: number
  date: string // ISO date string
  createdAt: string // ISO date string
}

export interface TransactionFormData {
  type: TransactionType
  category: string
  customCategory?: string // Campo opcional para especificar categoria quando "Outros" é selecionado
  amount: number
  date: string
}

// Categorias padrão
export const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Lazer',
  'Saúde',
  'Outros',
] as const

export type Category = typeof DEFAULT_CATEGORIES[number]

// Metas financeiras
export interface Goal {
  id: string
  userId: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string // ISO date string
  description?: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export interface GoalFormData {
  title: string
  targetAmount: number
  deadline: string
  description?: string
}

