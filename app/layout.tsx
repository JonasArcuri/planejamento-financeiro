import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/contexts/ToastContext'
import Toast from '@/components/ui/Toast'
import ThemeProviderWrapper from '@/components/providers/ThemeProviderWrapper'

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
        <ThemeProviderWrapper>
          <ToastProvider>
            {children}
            <Toast />
          </ToastProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}

