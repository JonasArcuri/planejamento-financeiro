'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import { useGuest } from '@/contexts/GuestContext'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import Link from 'next/link'
import Image from 'next/image'
import LanguageSelector from '@/components/landing/LanguageSelector'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const { enableGuest } = useGuest()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null)
  }, [])

  const handleGetStarted = () => {
    router.push('/signup')
  }

  const handleUpgrade = () => {
    router.push('/signup?upgrade=true')
  }

  const handleTryAsGuest = () => {
    enableGuest()
    router.push('/dashboard')
  }

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        handleCloseModal()
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage, handleCloseModal])

  if (loading) {
    return <Loading />
  }

  if (user) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <header>
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {t('landing.nav.appName')}
                </h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <LanguageSelector />
                <Link
                  href="/login"
                  className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium px-2 sm:px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                >
                  {t('landing.nav.login')}
                </Link>
                <Button 
                  variant="primary" 
                  onClick={handleGetStarted}
                  className="text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5"
                >
                  <span className="hidden sm:inline">{t('landing.nav.getStarted')}</span>
                  <span className="sm:hidden">Começar</span>
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-12 sm:py-16 md:py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                  {t('landing.hero.headline').split('{highlight}')[0]}
                  <span className="text-primary-600 dark:text-primary-400">{t('landing.hero.highlight')}</span>
                  {t('landing.hero.headline').split('{highlight}')[1]}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {t('landing.hero.subheadline')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGetStarted}
                    className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] sm:min-h-[52px]"
                  >
                    {t('landing.hero.ctaPrimary')}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleTryAsGuest}
                    className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] sm:min-h-[52px] border-2"
                  >
                    {t('landing.hero.ctaGuest')}
                  </Button>
                </div>
                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {t('landing.hero.guestNotice')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {t('landing.hero.trustBadge')}
                  </p>
                </div>
              </div>
              <div className="relative mt-8 lg:mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                  <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold">{t('landing.hero.balanceCard.title')}</h3>
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold">{t('landing.hero.balanceCard.value')}</p>
                    <p className="text-primary-100 text-xs sm:text-sm mt-2">
                      {t('landing.hero.balanceCard.change')}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('landing.hero.balanceCard.income')}</span>
                      <span className="font-semibold text-green-600 dark:text-green-400 text-sm sm:text-base">
                        {t('landing.hero.balanceCard.incomeValue')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('landing.hero.balanceCard.expenses')}</span>
                      <span className="font-semibold text-red-600 dark:text-red-400 text-sm sm:text-base">
                        {t('landing.hero.balanceCard.expensesValue')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-700 hidden md:block">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('landing.hero.balanceCard.goalReached')}
                    </span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('landing.benefits.title').split('{highlight}')[0]}
              <span className="text-primary-600 dark:text-primary-400">{t('landing.benefits.highlight')}</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              {t('landing.benefits.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Benefit 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('landing.benefits.items.dashboard.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('landing.benefits.items.dashboard.description')}
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('landing.benefits.items.control.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('landing.benefits.items.control.description')}
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('landing.benefits.items.goals.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('landing.benefits.items.goals.description')}
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('landing.benefits.items.analytics.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('landing.benefits.items.analytics.description')}
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('landing.benefits.items.security.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('landing.benefits.items.security.description')}
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('landing.benefits.items.security.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('landing.benefits.items.security.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('landing.screenshots.title').split('{highlight}')[0]}
              <span className="text-primary-600 dark:text-primary-400">{t('landing.screenshots.highlight')}</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              {t('landing.screenshots.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Screenshot 1 - Dashboard Charts (Gráficos) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300">
              <div 
                className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-2 mb-3 sm:mb-4 overflow-hidden cursor-pointer group touch-manipulation"
                onClick={() => handleImageClick('/images/Screenshot_1.jpg')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleImageClick('/images/Screenshot_1.jpg')
                  }
                }}
                aria-label={t('landing.screenshots.items.charts.alt')}
              >
                <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/images/Screenshot_1.jpg"
                    alt={t('landing.screenshots.items.charts.alt')}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg">
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t('landing.screenshots.items.charts.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {t('landing.screenshots.items.charts.description')}
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-2 font-medium">
                {t('landing.screenshots.items.charts.clickToZoom')}
              </p>
            </div>

            {/* Screenshot 2 - Dashboard Cards */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300">
              <div 
                className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-2 mb-3 sm:mb-4 overflow-hidden cursor-pointer group touch-manipulation"
                onClick={() => handleImageClick('/images/Screenshot_2.jpg')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleImageClick('/images/Screenshot_2.jpg')
                  }
                }}
                aria-label={t('landing.screenshots.items.overview.alt')}
              >
                <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/images/Screenshot_2.jpg"
                    alt={t('landing.screenshots.items.overview.alt')}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg">
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t('landing.screenshots.items.overview.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {t('landing.screenshots.items.overview.description')}
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-2 font-medium">
                {t('landing.screenshots.items.overview.clickToZoom')}
              </p>
            </div>

            {/* Screenshot 3 - Goals (Metas) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300">
              <div 
                className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-2 mb-3 sm:mb-4 overflow-hidden cursor-pointer group touch-manipulation"
                onClick={() => handleImageClick('/images/Screenshot_3.jpg')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleImageClick('/images/Screenshot_3.jpg')
                  }
                }}
                aria-label={t('landing.screenshots.items.goals.alt')}
              >
                <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/images/Screenshot_3.jpg"
                    alt={t('landing.screenshots.items.goals.alt')}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg">
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t('landing.screenshots.items.goals.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {t('landing.screenshots.items.goals.description')}
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-2 font-medium">
                {t('landing.screenshots.items.goals.clickToZoom')}
              </p>
            </div>
          </div>

          {/* Modal de Zoom */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 dark:bg-opacity-95 p-2 sm:p-4"
              onClick={handleCloseModal}
              role="dialog"
              aria-modal="true"
              aria-label={t('landing.screenshots.modal.alt')}
            >
              <div className="relative max-w-7xl max-h-[95vh] sm:max-h-[90vh] w-full h-full flex items-center justify-center">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={t('landing.screenshots.modal.close')}
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div
                  className="relative w-full h-full max-w-6xl max-h-[95vh] sm:max-h-[90vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={selectedImage}
                    alt={t('landing.screenshots.modal.alt')}
                    fill
                    className="object-contain rounded-lg"
                    sizes="95vw"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center text-white shadow-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {t('landing.pricing.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              {t('landing.pricing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleGetStarted}
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50 dark:bg-white dark:text-primary-600 dark:hover:bg-primary-50 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 border-2 border-white min-h-[48px] sm:min-h-[52px]"
              >
                {t('landing.pricing.ctaPrimary')}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleUpgrade}
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50 dark:bg-white dark:text-primary-600 dark:hover:bg-primary-50 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 border-2 border-white min-h-[48px] sm:min-h-[52px]"
              >
                {t('landing.pricing.ctaSecondary')}
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-primary-100 mt-4 sm:mt-6">
              {t('landing.pricing.trustBadge')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t('landing.footer.brand')}</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                {t('landing.footer.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">{t('landing.footer.quickLinks.title')}</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1">
                    {t('landing.footer.quickLinks.login')}
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1">
                    {t('landing.footer.quickLinks.signup')}
                  </Link>
                </li>
                <li>
                  <Link href="/upgrade" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1">
                    {t('landing.footer.quickLinks.premium')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">{t('landing.footer.features.title')}</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li>{t('landing.footer.features.dashboard')}</li>
                <li>{t('landing.footer.features.goals')}</li>
                <li>{t('landing.footer.features.analytics')}</li>
                <li>{t('landing.footer.features.security')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-xs sm:text-sm">{t('landing.footer.copyright')}</p>
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1 text-xs sm:text-sm">
                {t('landing.footer.privacy')}
              </Link>
              <span className="hidden sm:inline text-gray-600">|</span>
              <Link href="/terms" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1 text-xs sm:text-sm">
                {t('landing.footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
