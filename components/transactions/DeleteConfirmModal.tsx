'use client'

// Modal de confirmação para exclusão
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão">
      <div className="space-y-4">
        <p className="text-gray-600">
          Tem certeza que deseja excluir esta transação
          {transactionCategory && (
            <span className="font-medium"> ({transactionCategory})</span>
          )}
          ? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  )
}

