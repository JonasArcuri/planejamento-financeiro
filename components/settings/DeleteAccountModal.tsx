'use client'

// Modal de confirmação para exclusão de conta
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (password: string) => Promise<void>
  isLoading?: boolean
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteAccountModalProps) {
  const { t } = useLanguage()
  const [confirmationText, setConfirmationText] = useState('')
  const [password, setPassword] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)

  // Texto de confirmação necessário (ex: "EXCLUIR")
  const requiredConfirmation = 'EXCLUIR'

  // Verificar se o texto de confirmação está correto
  const handleConfirmationChange = (value: string) => {
    setConfirmationText(value)
    setIsConfirmed(value.toUpperCase() === requiredConfirmation)
  }

  // Resetar ao fechar
  const handleClose = () => {
    setConfirmationText('')
    setPassword('')
    setIsConfirmed(false)
    onClose()
  }

  // Confirmar exclusão
  const handleConfirm = async () => {
    if (isConfirmed) {
      await onConfirm(password)
      // Resetar após confirmação
      setConfirmationText('')
      setPassword('')
      setIsConfirmed(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('settings.deleteAccount')}
    >
      <div className="space-y-6">
        {/* Aviso Principal */}
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                {t('settings.deleteAccountWarning')}
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400">
                {t('settings.deleteAccountIrreversible')}
              </p>
            </div>
          </div>
        </div>

        {/* O que será excluído */}
        <div>
          <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
            {t('settings.deleteAccountWhatWillBeDeleted')}
          </h5>
          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>{t('settings.deleteAccountData1')}</li>
            <li>{t('settings.deleteAccountData2')}</li>
            <li>{t('settings.deleteAccountData3')}</li>
            <li>{t('settings.deleteAccountData4')}</li>
            <li>{t('settings.deleteAccountData5')}</li>
          </ul>
        </div>

        {/* Confirmação por texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.deleteAccountConfirmationLabel').replace('{text}', requiredConfirmation)}
          </label>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => handleConfirmationChange(e.target.value)}
            placeholder={requiredConfirmation}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isLoading}
            autoComplete="off"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {t('settings.deleteAccountConfirmationHint')}
          </p>
        </div>

        {/* Campo de senha para reautenticação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.deleteAccountPasswordLabel')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('settings.deleteAccountPasswordPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isLoading}
            autoComplete="current-password"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {t('settings.deleteAccountPasswordHint')}
          </p>
        </div>

        {/* Aviso final */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t('settings.deleteAccountFinalWarning')}
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!isConfirmed || isLoading}
            isLoading={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('settings.deleteAccountConfirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

