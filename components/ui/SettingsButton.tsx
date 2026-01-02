'use client'

// Componente de botão de configurações com modal
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import Modal from './Modal'
import Button from './Button'
import DeleteAccountModal from '@/components/settings/DeleteAccountModal'
import { deleteUserAccount } from '@/services/firebase/account'
import { getCurrentUser } from '@/services/firebase/auth'

export default function SettingsButton() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleLanguageChange = async (newLanguage: 'pt' | 'en') => {
    await setLanguage(newLanguage)
  }

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    await setTheme(newTheme)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label={t('settings.title')}
        title={t('settings.title')}
      >
        <svg
          className="w-5 h-5 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('settings.title')}>
        <div className="space-y-6">
          {/* Seletor de Idioma */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('settings.language')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange('pt')}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    language === 'pt'
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                Português (PT)
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    language === 'en'
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                English (EN)
              </button>
            </div>
          </div>

          {/* Seletor de Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('settings.theme')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                  ${
                    theme === 'light'
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
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
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {t('settings.light')}
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                  ${
                    theme === 'dark'
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
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
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                {t('settings.dark')}
              </button>
            </div>
          </div>

          {/* Seção de Exclusão de Conta */}
          <div className="pt-4 border-t border-red-200 dark:border-red-800">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {t('settings.deleteAccount')}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                {t('settings.deleteAccountDescription')}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  setIsDeleteModalOpen(true)
                }}
                className="w-full border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                {t('settings.deleteAccountButton')}
              </Button>
            </div>
          </div>

          {/* Botão de Fechar */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="primary"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              {t('settings.close')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Exclusão de Conta */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async (password: string) => {
          if (!user) {
            showToast(t('settings.deleteAccountError'), 'error')
            return
          }

          setIsDeleting(true)
          try {
            // Obter usuário atual do Firebase Auth
            const currentUser = getCurrentUser()
            if (!currentUser) {
              throw new Error('Usuário não autenticado')
            }

            // Excluir conta e todos os dados
            await deleteUserAccount(currentUser, password)

            // Sucesso - mostrar mensagem e redirecionar
            showToast(t('settings.deleteAccountSuccess'), 'success')
            
            // Fechar modal
            setIsDeleteModalOpen(false)
            
            // Redirecionar para página inicial após um breve delay
            setTimeout(() => {
              router.push('/')
            }, 1500)
          } catch (error: any) {
            console.error('Erro ao excluir conta:', error)
            showToast(
              error.message || t('settings.deleteAccountError'),
              'error'
            )
          } finally {
            setIsDeleting(false)
          }
        }}
        isLoading={isDeleting}
      />
    </>
  )
}

