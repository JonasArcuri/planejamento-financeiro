// Limites e configurações de planos
import { UserPlan } from '@/types'

export const PLAN_LIMITS = {
  free: {
    maxTransactions: 10, // Limite de transações no plano free
    features: {
      transactions: true,
      dashboard: true,
      charts: true,
      monthlyComparison: false, // Premium only
      categoryTotals: false, // Premium only
      highExpensesAlert: false, // Premium only
      export: false, // Premium only
    },
  },
  premium: {
    maxTransactions: Infinity,
    features: {
      transactions: true,
      dashboard: true,
      charts: true,
      monthlyComparison: true,
      categoryTotals: true,
      highExpensesAlert: true,
      export: true,
    },
  },
} as const

/**
 * Verificar se o usuário pode criar mais transações
 */
export function canCreateTransaction(
  plan: UserPlan,
  currentTransactionCount: number
): { allowed: boolean; reason?: string } {
  const limit = PLAN_LIMITS[plan].maxTransactions

  if (plan === 'free' && currentTransactionCount >= limit) {
    return {
      allowed: false,
      reason: `Você atingiu o limite de ${limit} transações no plano gratuito. Faça upgrade para Premium para transações ilimitadas.`,
    }
  }

  return { allowed: true }
}

/**
 * Verificar se uma funcionalidade está disponível no plano
 */
export function isFeatureAvailable(plan: UserPlan, feature: keyof typeof PLAN_LIMITS.free.features): boolean {
  return PLAN_LIMITS[plan].features[feature]
}

/**
 * Obter limite de transações do plano
 */
export function getTransactionLimit(plan: UserPlan): number {
  return PLAN_LIMITS[plan].maxTransactions
}

/**
 * Obter informações do plano
 */
export function getPlanInfo(plan: UserPlan) {
  return PLAN_LIMITS[plan]
}

