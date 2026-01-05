// Tipos principais da aplicação

export type TransactionType = 'income' | 'expense'

export type UserPlan = 'free' | 'premium'
export type Theme = 'light' | 'dark'
export type Language = 'pt' | 'en'
export type Currency = 'BRL' | 'USD'

export interface UserPreferences {
  theme?: Theme
  language?: Language
  currency?: Currency
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

// Categorias de despesas
export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Lazer',
  'Saúde',
  'Outros',
] as const

// Categorias de receitas
export const INCOME_CATEGORIES = [
  // Principais / Fixas
  'Salário',
  'Pró-labore',
  'Aposentadoria',
  'Pensão',
  'Bolsa / Auxílio governamental',
  'Aluguel recebido',
  'Renda fixa mensal',
  // Variáveis / Complementares
  'Horas extras',
  'Comissões',
  'Bônus',
  'Participação nos lucros (PLR)',
  'Gorjetas',
  'Freelance',
  'Trabalhos pontuais',
  'Renda variável',
  'Outros',
] as const

// Categorias padrão (mantido para compatibilidade)
export const DEFAULT_CATEGORIES = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES.filter(cat => cat !== 'Outros'), // Remove duplicata de "Outros"
] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]
export type IncomeCategory = typeof INCOME_CATEGORIES[number]
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

