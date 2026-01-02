'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useTransactions } from '@/hooks/useTransactions'
import { usePlan } from '@/hooks/usePlan'
import { useToast } from '@/contexts/ToastContext'
import { useState } from 'react'
import { Transaction, TransactionFormData } from '@/types'
import TransactionForm from '@/components/transactions/TransactionForm'
import TransactionList from '@/components/transactions/TransactionList'
import DeleteConfirmModal from '@/components/transactions/DeleteConfirmModal'
import TransactionLimitAlert from '@/components/premium/TransactionLimitAlert'
import TransactionCounter from '@/components/premium/TransactionCounter'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'
import { logout } from '@/services/firebase/auth'
import Loading from '@/components/Loading'

export default function TransactionsPage() {
  const { user, userData } = useAuth()
  const { transactions, loading, addTransaction, editTransaction, removeTransaction } =
    useTransactions(user?.uid || null)
  const { canCreate, isPremium } = usePlan()
  const { showToast } = useToast()
  const router = useRouter()
  const { t } = useLanguage()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
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
    if (!canCreate.allowed) {
      showToast(canCreate.reason || t('transactions.transactionLimitReached'), 'error')
      return
    }
    setSelectedTransaction(null)
    setIsFormOpen(true)
  }

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleDelete = (transactionId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId)
    setSelectedTransaction(transaction || null)
    setIsDeleteModalOpen(true)
  }

  const handleFormSubmit = async (data: TransactionFormData) => {
    // Verificar limite antes de criar nova transação
    if (!selectedTransaction && !canCreate.allowed) {
      showToast(canCreate.reason || t('transactions.transactionLimitReached'), 'error')
      return
    }

    setIsSubmitting(true)
    try {
      if (selectedTransaction) {
        await editTransaction(selectedTransaction.id, data)
        showToast(t('transactions.updateSuccess'), 'success')
      } else {
        await addTransaction(data)
        showToast(t('transactions.createSuccess'), 'success')
      }
      setIsFormOpen(false)
      setSelectedTransaction(null)
    } catch (error: any) {
      showToast(error.message || t('transactions.saveError'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return

    setIsSubmitting(true)
    try {
      await removeTransaction(selectedTransaction.id)
      showToast(t('transactions.deleteSuccess'), 'success')
      setIsDeleteModalOpen(false)
      setSelectedTransaction(null)
    } catch (error: any) {
      showToast(error.message || t('transactions.deleteError'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && transactions.length === 0) {
    return (
      <ProtectedRoute>
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
                  {t('common.dashboard')}
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('transactions.title')}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <LanguageToggle />
                <ThemeToggle />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {userData?.name || user?.email}
                </span>
                {!isPremium && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                    Free
                  </span>
                )}
                {isPremium && (
                  <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded">
                    Premium
                  </span>
                )}
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('transactions.yourTransactions')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t('transactions.subtitle')}
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
                {t('transactions.newTransaction')}
              </Button>
            </div>
          </div>

          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loading}
          />

          {/* Modal de Formulário */}
          <Modal
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false)
              setSelectedTransaction(null)
            }}
            title={selectedTransaction ? t('transactions.editTransaction') : t('transactions.newTransaction')}
          >
            <TransactionForm
              transaction={selectedTransaction || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false)
                setSelectedTransaction(null)
              }}
              isLoading={isSubmitting}
            />
          </Modal>

          {/* Modal de Confirmação de Exclusão */}
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false)
              setSelectedTransaction(null)
            }}
            onConfirm={handleDeleteConfirm}
            isLoading={isSubmitting}
            transactionCategory={selectedTransaction?.category}
          />
        </main>
      </div>
    </ProtectedRoute>
  )
}
