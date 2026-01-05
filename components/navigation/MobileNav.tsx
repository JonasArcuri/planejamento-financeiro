'use client'

// Navegação mobile simplificada - Bottom bar
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useGuest } from '@/contexts/GuestContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { logout } from '@/services/firebase/auth'
import { useToast } from '@/contexts/ToastContext'

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { isGuest } = useGuest()
  const { t } = useLanguage()
  const { showToast } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      showToast(t('auth.logoutSuccess') || 'Logout realizado com sucesso', 'success')
      router.push('/login')
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error)
      showToast(error.message || 'Erro ao fazer logout', 'error')
    }
  }

  // Não mostrar em páginas de auth ou landing
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return null
  }

  const navItems = [
    {
      path: '/dashboard',
      label: t('common.dashboard'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: '/transactions',
      label: t('common.transactions'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      path: '/goals',
      label: t('common.goals'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      path: '/reports',
      label: t('common.reports'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(path)
  }

  // Não mostrar logout para visitantes
  const showLogout = user && !isGuest

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe lg:hidden" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`
                relative flex flex-col items-center justify-center gap-1 flex-1 h-full
                transition-all touch-manipulation
                ${active 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400'
                }
              `}
            >
              <div className={`transition-transform ${active ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium transition-all ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
              )}
            </button>
          )
        })}
        
        {showLogout && (
          <button
            onClick={handleLogout}
            className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all touch-manipulation"
            aria-label="Logout"
          >
            <div className="transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="text-[10px] font-medium">Sair</span>
          </button>
        )}
      </div>
    </nav>
  )
}

