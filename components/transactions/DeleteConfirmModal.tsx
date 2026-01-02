'use client'

// Modal de confirmação para exclusão
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
  transactionCategory?: string
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  transactionCategory,
}: DeleteConfirmModalProps) {
  const { t } = useLanguage()
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('transactions.deleteTransaction')}>
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          {t('transactions.deleteConfirm')}
          {transactionCategory && (
            <span className="font-medium"> ({transactionCategory})</span>
          )}
          {t('transactions.deleteConfirmDesc')}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {t('common.delete')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

