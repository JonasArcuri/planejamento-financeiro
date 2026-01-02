'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import Link from 'next/link'
import Image from 'next/image'
import LanguageSelector from '@/components/landing/LanguageSelector'
import InstallPrompt from '@/components/pwa/InstallPrompt'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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
  }, [selectedImage])

  if (loading) {
    return <Loading />
  }

  if (user) {
    return <Loading />
  }

  const handleGetStarted = () => {
    router.push('/signup')
  }

  const handleUpgrade = () => {
    router.push('/signup?upgrade=true')
  }

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                {t('landing.nav.appName')}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Link
                href="/login"
                className="text-gray-700 hover:text-primary-600 font-medium"
              >
                {t('landing.nav.login')}
              </Link>
              <Button variant="primary" onClick={handleGetStarted}>
                {t('landing.nav.getStarted')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-purple-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t('landing.hero.headline').split('{highlight}')[0]}
                <span className="text-primary-600">{t('landing.hero.highlight')}</span>
                {t('landing.hero.headline').split('{highlight}')[1]}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t('landing.hero.subheadline')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGetStarted}
                  className="text-lg px-8 py-4"
                >
                  {t('landing.hero.ctaPrimary')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleUpgrade}
                  className="text-lg px-8 py-4"
                >
                  {t('landing.hero.ctaSecondary')}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                {t('landing.hero.trustBadge')}
              </p>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{t('landing.hero.balanceCard.title')}</h3>
                    <svg
                      className="w-6 h-6"
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
                  <p className="text-4xl font-bold">{t('landing.hero.balanceCard.value')}</p>
                  <p className="text-primary-100 text-sm mt-2">
                    {t('landing.hero.balanceCard.change')}
                  </p>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('landing.hero.balanceCard.income')}</span>
                    <span className="font-semibold text-green-600">
                      {t('landing.hero.balanceCard.incomeValue')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('landing.hero.balanceCard.expenses')}</span>
                    <span className="font-semibold text-red-600">
                      {t('landing.hero.balanceCard.expensesValue')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {t('landing.hero.balanceCard.goalReached')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.benefits.title').split('{highlight}')[0]}
              <span className="text-primary-600">{t('landing.benefits.highlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.benefits.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('landing.benefits.items.dashboard.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.benefits.items.dashboard.description')}
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('landing.benefits.items.control.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.benefits.items.control.description')}
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('landing.benefits.items.goals.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.benefits.items.goals.description')}
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('landing.benefits.items.analytics.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.benefits.items.analytics.description')}
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('landing.benefits.items.security.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.benefits.items.security.description')}
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('landing.benefits.items.mobile.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.benefits.items.mobile.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.screenshots.title').split('{highlight}')[0]}
              <span className="text-primary-600">{t('landing.screenshots.highlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.screenshots.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Screenshot 1 - Dashboard Charts (Gráficos) */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow">
              <div 
                className="relative bg-gray-50 rounded-lg p-2 mb-4 overflow-hidden cursor-pointer group"
                onClick={() => handleImageClick('/images/Screenshot_1.jpg')}
              >
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
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
                    className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('landing.screenshots.items.charts.title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('landing.screenshots.items.charts.description')}
              </p>
              <p className="text-xs text-primary-600 mt-2 font-medium">
                {t('landing.screenshots.items.charts.clickToZoom')}
              </p>
            </div>

            {/* Screenshot 2 - Dashboard Cards */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow">
              <div 
                className="relative bg-gray-50 rounded-lg p-2 mb-4 overflow-hidden cursor-pointer group"
                onClick={() => handleImageClick('/images/Screenshot_2.jpg')}
              >
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
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
                    className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('landing.screenshots.items.overview.title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('landing.screenshots.items.overview.description')}
              </p>
              <p className="text-xs text-primary-600 mt-2 font-medium">
                {t('landing.screenshots.items.overview.clickToZoom')}
              </p>
            </div>

            {/* Screenshot 3 - Goals (Metas) */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow">
              <div 
                className="relative bg-gray-50 rounded-lg p-2 mb-4 overflow-hidden cursor-pointer group"
                onClick={() => handleImageClick('/images/Screenshot_3.jpg')}
              >
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
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
                    className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('landing.screenshots.items.goals.title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('landing.screenshots.items.goals.description')}
              </p>
              <p className="text-xs text-primary-600 mt-2 font-medium">
                {t('landing.screenshots.items.goals.clickToZoom')}
              </p>
            </div>
          </div>

          {/* Modal de Zoom */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
              onClick={handleCloseModal}
            >
              <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
                  aria-label={t('landing.screenshots.modal.close')}
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
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
                  className="relative w-full h-full max-w-6xl max-h-[90vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={selectedImage}
                    alt={t('landing.screenshots.modal.alt')}
                    fill
                    className="object-contain rounded-lg"
                    sizes="90vw"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('landing.pricing.title')}
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              {t('landing.pricing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleGetStarted}
                className="bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-4 border-white"
              >
                {t('landing.pricing.ctaPrimary')}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleUpgrade}
                className="bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-4 border-2 border-white"
              >
                {t('landing.pricing.ctaSecondary')}
              </Button>
            </div>
            <p className="text-sm text-primary-100 mt-6">
              {t('landing.pricing.trustBadge')}
            </p>
          </div>
        </div>
      </section>

      {/* Install Prompt */}
      <InstallPrompt />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">{t('landing.footer.brand')}</h3>
              <p className="text-gray-400">
                {t('landing.footer.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.quickLinks.title')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white">
                    {t('landing.footer.quickLinks.login')}
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white">
                    {t('landing.footer.quickLinks.signup')}
                  </Link>
                </li>
                <li>
                  <Link href="/upgrade" className="hover:text-white">
                    {t('landing.footer.quickLinks.premium')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.features.title')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{t('landing.footer.features.dashboard')}</li>
                <li>{t('landing.footer.features.goals')}</li>
                <li>{t('landing.footer.features.analytics')}</li>
                <li>{t('landing.footer.features.security')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('landing.footer.copyright')}</p>
            <div className="mt-4 flex justify-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                {t('landing.footer.privacy')}
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                {t('landing.footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
