// Configuração do Stripe
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não está configurada')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Preço mensal (deve ser criado no Stripe Dashboard)
export const MONTHLY_PRICE_ID = process.env.STRIPE_PRICE_ID || ''

