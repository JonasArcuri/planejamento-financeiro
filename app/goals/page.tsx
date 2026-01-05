'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useGoals } from '@/hooks/useGoals'
import { useTransactions } from '@/hooks/useTransactions'
import { useToast } from '@/contexts/ToastContext'
import { useState } from 'react'
import { Goal, GoalFormData } from '@/types'
import GoalForm from '@/components/goals/GoalForm'
import GoalList from '@/components/goals/GoalList'
import AddMoneyModal from '@/components/goals/AddMoneyModal'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import SettingsButton from '@/components/ui/SettingsButton'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'
import { logout } from '@/services/firebase/auth'
import Loading from '@/components/Loading'

export default function GoalsPage() {
  const { user, userData } = useAuth()
  const { goals, loading, addGoal, editGoal, removeGoal, addMoney } = useGoals(user?.uid || null)
  const { transactions, fetchTransactions } = useTransactions(user?.uid || null)
  const { showToast } = useToast()
  const router = useRouter()
  const { t } = useLanguage()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleCreate = () => {
    setSelectedGoal(null)
    setIsFormOpen(true)
  }

  const handleEdit = (goal: Goal) => {
    setSelectedGoal(goal)
    setIsFormOpen(true)
  }

  const handleDelete = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId)
    setSelectedGoal(goal || null)
    setIsDeleteModalOpen(true)
  }

  const handleAddMoney = (goal: Goal) => {
    setSelectedGoal(goal)
    setIsAddMoneyModalOpen(true)
  }

  const handleAddMoneyConfirm = async (amount: number, fromBalance: boolean) => {
    if (!selectedGoal) return

    setIsSubmitting(true)
    try {
      await addMoney(selectedGoal.id, amount, fromBalance, selectedGoal.title)
      const message = fromBalance
        ? `R$ ${amount.toFixed(2)} adicionado à meta e descontado do saldo mensal!`
        : `R$ ${amount.toFixed(2)} adicionado à meta com sucesso!`
      showToast(message, 'success')
      setIsAddMoneyModalOpen(false)
      setSelectedGoal(null)
      
      // Atualizar transações se foi descontado do saldo
      if (fromBalance) {
        await fetchTransactions()
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao adicionar dinheiro', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormSubmit = async (data: GoalFormData) => {
    setIsSubmitting(true)
    try {
      if (selectedGoal) {
        await editGoal(selectedGoal.id, data)
        showToast('Meta atualizada com sucesso!', 'success')
      } else {
        await addGoal(data)
        showToast('Meta criada com sucesso!', 'success')
      }
      setIsFormOpen(false)
      setSelectedGoal(null)
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar meta', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedGoal) return

    setIsSubmitting(true)
    try {
      await removeGoal(selectedGoal.id)
      showToast('Meta excluída com sucesso!', 'success')
      setIsDeleteModalOpen(false)
      setSelectedGoal(null)
    } catch (error: any) {
      showToast(error.message || 'Erro ao excluir meta', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && goals.length === 0) {
    return (
      <ProtectedRoute requireAuth>
        <Loading />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32 lg:pb-0">
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-14 items-center gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">{t('goals.title')}</h1>
                {/* Botão Voltar para Dashboard - Desktop */}
                <button
                  onClick={() => router.push('/dashboard')}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label={t('common.dashboard')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>{t('common.dashboard')}</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                {/* Botão Relatório - Ícone no mobile, texto no desktop */}
                <button
                  onClick={() => router.push('/reports')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation sm:hidden"
                  aria-label={t('reports.title')}
                >
                  <svg
                    className="w-6 h-6 text-gray-700 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <SettingsButton />
                {/* Informações apenas no desktop */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-[120px]">
                    {userData?.name || user?.email?.split('@')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-5xl md:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-8">
          {/* Header com título e ações - Tablet/Desktop */}
          <div className="hidden sm:flex justify-between items-center mb-4 md:mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t('goals.yourGoals')}</h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                {t('goals.subtitle')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/reports')}
                className="flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                {t('reports.title')}
              </Button>
              <Button variant="primary" onClick={handleCreate}>
                {t('goals.newGoal')}
              </Button>
            </div>
          </div>

          {/* Header simplificado - Mobile */}
          <div className="sm:hidden mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('goals.yourGoals')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('goals.subtitle')}
            </p>
          </div>

          <GoalList
            goals={goals}
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddMoney={handleAddMoney}
            isLoading={loading}
          />

          {/* Modal de Formulário */}
          <Modal
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false)
              setSelectedGoal(null)
            }}
            title={selectedGoal ? 'Editar Meta' : 'Nova Meta'}
          >
            <GoalForm
              goal={selectedGoal || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false)
                setSelectedGoal(null)
              }}
              isLoading={isSubmitting}
            />
          </Modal>

          {/* Modal de Adicionar Dinheiro */}
          <AddMoneyModal
            isOpen={isAddMoneyModalOpen}
            onClose={() => {
              setIsAddMoneyModalOpen(false)
              setSelectedGoal(null)
            }}
            onConfirm={handleAddMoneyConfirm}
            goal={selectedGoal}
            isLoading={isSubmitting}
          />

          {/* Modal de Confirmação de Exclusão */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false)
              setSelectedGoal(null)
            }}
            title={t('goals.deleteGoal')}
          >
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                {t('goals.deleteConfirm')}
                {selectedGoal && (
                  <span className="font-medium"> &quot;{selectedGoal.title}&quot;</span>
                )}
                {t('goals.deleteConfirmDesc')}
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSelectedGoal(null)
                }} disabled={isSubmitting}>
                  {t('common.cancel')}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDeleteConfirm}
                  isLoading={isSubmitting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {t('common.delete')}
                </Button>
              </div>
            </div>
          </Modal>
        </main>

        {/* FAB (Floating Action Button) - Mobile Only */}
        <button
          onClick={handleCreate}
          className="fixed bottom-24 right-4 lg:hidden z-50 w-14 h-14 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 touch-manipulation flex items-center justify-center mb-safe"
          aria-label={t('goals.newGoal')}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </ProtectedRoute>
  )
}

