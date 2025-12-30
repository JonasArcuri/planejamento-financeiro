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
import { useRouter } from 'next/navigation'
import { logout } from '@/services/firebase/auth'
import Loading from '@/components/Loading'

export default function GoalsPage() {
  const { user, userData } = useAuth()
  const { goals, loading, addGoal, editGoal, removeGoal, addMoney } = useGoals(user?.uid || null)
  const { transactions, fetchTransactions } = useTransactions(user?.uid || null)
  const { showToast } = useToast()
  const router = useRouter()

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
      <ProtectedRoute>
        <Loading />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Dashboard
                </button>
                <h1 className="text-xl font-bold text-gray-900">Metas Financeiras</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {userData?.name || user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Suas Metas</h2>
              <p className="text-sm text-gray-600 mt-1">
                Defina e acompanhe suas metas de poupança
              </p>
            </div>
            <Button variant="primary" onClick={handleCreate}>
              Nova Meta
            </Button>
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
            title="Confirmar Exclusão"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Tem certeza que deseja excluir a meta
                {selectedGoal && (
                  <span className="font-medium"> "{selectedGoal.title}"</span>
                )}
                ? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSelectedGoal(null)
                }} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDeleteConfirm}
                  isLoading={isSubmitting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </Button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </ProtectedRoute>
  )
}

