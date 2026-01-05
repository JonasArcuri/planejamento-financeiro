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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32 lg:pb-0">
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-14 items-center gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  {t('transactions.title')}
                </h1>
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
                {!isGuest && <SettingsButton />}
                {/* Informações apenas no desktop */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-[120px]">
                    {isGuest ? 'Visitante' : (userData?.name || user?.email?.split('@')[0])}
                  </span>
                  {!isGuest && !isPremium && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      Free
                    </span>
                  )}
                  {!isGuest && isPremium && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-5xl md:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-8">
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

          {/* Header com título e ações - Desktop */}
          <div className="hidden sm:flex justify-between items-center mb-6">
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

          {/* Header simplificado - Mobile */}
          <div className="sm:hidden mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('transactions.yourTransactions')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('transactions.subtitle')}
            </p>
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

        {/* FAB (Floating Action Button) - Mobile Only */}
        <button
          onClick={handleCreate}
          className="fixed bottom-24 right-4 lg:hidden z-50 w-14 h-14 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 touch-manipulation flex items-center justify-center mb-safe"
          aria-label={t('transactions.newTransaction')}
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
