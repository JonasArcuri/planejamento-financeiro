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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  Dashboard
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('goals.title')}</h1>
              </div>
              <div className="flex items-center gap-4">
                <SettingsButton />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {userData?.name || user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  {t('common.logout')}
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('goals.yourGoals')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
      </div>
    </ProtectedRoute>
  )
}

