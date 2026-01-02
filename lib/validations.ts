// Schemas de validação com Zod
import { z } from 'zod'
import { DEFAULT_CATEGORIES } from '@/types'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'Tipo é obrigatório',
  }),
  category: z
    .string()
    .min(1, 'Categoria é obrigatória'),
  customCategory: z
    .string()
    .optional(), // Campo opcional por padrão
  amount: z
    .number()
    .min(0.01, 'Valor deve ser maior que zero')
    .positive('Valor deve ser positivo'),
  date: z
    .string()
    .min(1, 'Data é obrigatória'),
}).refine(
  (data) => {
    // Se a categoria for "Outros", customCategory é obrigatório
    if (data.category === 'Outros') {
      return data.customCategory && data.customCategory.trim().length > 0
    }
    return true
  },
  {
    message: 'Especifique o gasto/receita quando selecionar "Outros"',
    path: ['customCategory'], // Mensagem de erro aparecerá no campo customCategory
  }
)

export type LoginFormData = z.infer<typeof loginSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type TransactionFormData = z.infer<typeof transactionSchema>
