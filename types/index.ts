// Tipos principais da aplicação

export type TransactionType = 'income' | 'expense'

export type UserPlan = 'free' | 'premium'

export interface User {
  id: string
  name: string
  email: string
  plan: UserPlan
}

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  category: string
  amount: number
  date: string // ISO date string
  createdAt: string // ISO date string
}

export interface TransactionFormData {
  type: TransactionType
  category: string
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

