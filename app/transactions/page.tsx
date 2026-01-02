'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useTransactionsUnified } from '@/hooks/useTransactionsUnified'
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
import SettingsButton from '@/components/ui/SettingsButton'
import { useLanguage } from '@/contexts/LanguageContext'
import { useGuest } from '@/contexts/GuestContext'
import { getGuestTransactionCount } from '@/lib/guestMigration'
import { useRouter } from 'next/navigation'
import { logout } from '@/services/firebase/auth'
import Loading from '@/components/Loading'

export default function TransactionsPage() {
  const { user, userData } = useAuth()
  const { 
    transactions, 
    loading, 
    addTransaction, 
    editTransaction, 
    removeTransaction,
    canCreate: canCreateTransaction,
    isGuest,
  } = useTransactionsUnified()
  const { canCreate: canCreatePlan, isPremium } = usePlan()
  
  // Combinar limitações do plano e do modo visitante
  const canCreate = isGuest 
    ? canCreateTransaction 
    : canCreatePlan
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
      const message = isGuest 
        ? t('transactions.guestLimitReached') 
        : (canCreate.reason || t('transactions.transactionLimitReached'))
      showToast(message, 'error')
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
                {!isGuest && <SettingsButton />}
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {isGuest ? 'Visitante' : (userData?.name || user?.email)}
                </span>
                {!isGuest && !isPremium && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                    Free
                  </span>
                )}
                {!isGuest && isPremium && (
                  <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded">
                    Premium
                  </span>
                )}
                {!isGuest && (
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    {t('common.logout')}
                  </Button>
                )}
                {isGuest && (
                  <Button variant="primary" size="sm" onClick={() => router.push('/signup')}>
                    {t('dashboard.guestCtaCreateAccount')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Aviso de limite no modo visitante */}
          {isGuest && (() => {
            const count = getGuestTransactionCount()
            if (count >= 2) {
              return (
                <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                        {count >= 3 
                          ? t('dashboard.guestLimitReached')
                          : t('dashboard.guestLimitWarning').replace('{count}', String(count))
                        }
                      </p>
                      <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
                        {count >= 3 
                          ? t('dashboard.guestLimitReachedMessage')
                          : t('dashboard.guestWarningMessage')
                        }
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push('/signup')}
                      >
                        {t('dashboard.guestCtaCreateAccount')}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          })()}

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
