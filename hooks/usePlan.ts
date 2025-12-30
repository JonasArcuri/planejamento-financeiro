// Hook para gerenciar plano do usuário
import { useAuth } from './useAuth'
import { useTransactions } from './useTransactions'
import {
  canCreateTransaction,
  isFeatureAvailable,
  getTransactionLimit,
  getPlanInfo,
} from '@/lib/planLimits'
import { UserPlan } from '@/types'

export function usePlan() {
  const { userData } = useAuth()
  const { transactions } = useTransactions(userData?.id || null)
  const plan = userData?.plan || 'free'

  const currentTransactionCount = transactions.length
  const limit = getTransactionLimit(plan as UserPlan)
  const planInfo = getPlanInfo(plan as UserPlan)

  const canCreate = canCreateTransaction(plan as UserPlan, currentTransactionCount)
  const isPremium = plan === 'premium'
  const isFree = plan === 'free'
  const remainingTransactions = isPremium
    ? Infinity
    : Math.max(0, limit - currentTransactionCount)

  const checkFeature = (feature: keyof typeof planInfo.features) => {
    return isFeatureAvailable(plan as UserPlan, feature)
  }

  return {
    plan: plan as UserPlan,
    isPremium,
    isFree,
    currentTransactionCount,
    limit,
    remainingTransactions,
    canCreate,
    checkFeature,
    planInfo,
  }
}

