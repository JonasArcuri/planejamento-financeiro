import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/contexts/ToastContext'
import Toast from '@/components/ui/Toast'
import ThemeProviderWrapper from '@/components/providers/ThemeProviderWrapper'
import { GuestProvider } from '@/contexts/GuestContext'
import NavigationWrapper from '@/components/navigation/NavigationWrapper'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Planejamento Financeiro Pessoal',
  description: 'Gerencie suas finanças pessoais de forma simples e eficiente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleAnalytics />
        <ThemeProviderWrapper>
          <GuestProvider>
            <ToastProvider>
              {children}
              <Toast />
              <NavigationWrapper />
            </ToastProvider>
          </GuestProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}

