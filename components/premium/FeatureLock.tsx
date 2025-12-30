'use client'

// Componente para bloquear funcionalidades premium
import UpgradePrompt from './UpgradePrompt'

interface FeatureLockProps {
  isLocked: boolean
  featureName: string
  children: React.ReactNode
  upgradeMessage?: string
  onUpgrade?: () => void
}

export default function FeatureLock({
  isLocked,
  featureName,
  children,
  upgradeMessage,
  onUpgrade,
}: FeatureLockProps) {
  if (!isLocked) {
    return <>{children}</>
  }

  const defaultMessage = `Esta funcionalidade está disponível apenas no plano Premium. Faça upgrade para desbloquear ${featureName}.`

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
        <UpgradePrompt
          title={`${featureName} - Premium`}
          message={upgradeMessage || defaultMessage}
          variant="inline"
          onUpgrade={onUpgrade}
        />
      </div>
    </div>
  )
}

