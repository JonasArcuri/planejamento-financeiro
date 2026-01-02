/**
 * Componente para prompt de instalação do PWA
 * 
 * Este componente detecta se o PWA pode ser instalado e mostra
 * um botão para o usuário instalar o app.
 */

'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    // Detectar se o evento beforeinstallprompt está disponível
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Mostrar o prompt de instalação
    await deferredPrompt.prompt()

    // Aguardar a escolha do usuário
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA instalado com sucesso')
    } else {
      console.log('Instalação do PWA cancelada')
    }

    // Limpar o prompt
    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  // Não mostrar se já estiver instalado ou se não houver prompt
  if (!showInstallButton || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-primary-600 dark:text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {t('pwa.installTitle') || 'Instalar App'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              {t('pwa.installDescription') || 'Instale nosso app para acesso rápido e offline'}
            </p>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleInstallClick}
                className="flex-1"
              >
                {t('pwa.install') || 'Instalar'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstallButton(false)}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

