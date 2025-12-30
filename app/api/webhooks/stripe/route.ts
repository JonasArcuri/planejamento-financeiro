// Webhook do Stripe para processar eventos
// NOTA: Para produção, configure Firebase Admin ou use Cloud Functions
// Este é um exemplo básico que precisa ser adaptado para seu ambiente
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Função auxiliar para atualizar usuário no Firestore
// NOTA: Para produção, configure Firebase Admin SDK ou use Cloud Functions
// Esta função precisa ser implementada com acesso direto ao Firestore
async function updateUserPlan(userId: string, plan: 'free' | 'premium', subscriptionId?: string) {
  // Opção 1: Usar Firebase Admin (recomendado para produção)
  // const admin = require('firebase-admin')
  // await admin.firestore().collection('users').doc(userId).update({ plan, ... })
  
  // Opção 2: Usar Cloud Function do Firebase
  // await fetch('https://us-central1-seu-projeto.cloudfunctions.net/updateUserPlan', { ... })
  
  // Opção 3: Para desenvolvimento, você pode chamar a API local
  // (não recomendado para produção)
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // Em produção, use uma URL externa ou Firebase Admin
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? `${appUrl}/api/update-user-plan`
      : `http://localhost:3000/api/update-user-plan`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Adicione autenticação aqui se necessário
      },
      body: JSON.stringify({ userId, plan, subscriptionId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erro ao atualizar plano')
    }

    console.log(`✅ Usuário ${userId} atualizado para plano ${plan}`)
  } catch (error: any) {
    console.error('❌ Erro ao atualizar plano:', error.message)
    // Não lançar erro para não quebrar o webhook
    // O Stripe tentará novamente se necessário
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook secret não configurado' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Erro ao verificar webhook:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId) {
          await updateUserPlan(
            userId,
            'premium',
            session.subscription as string
          )
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          await updateUserPlan(
            userId,
            subscription.status === 'active' ? 'premium' : 'free',
            subscription.id
          )
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          await updateUserPlan(userId, 'free')
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          // TODO: Buscar userId pelo subscriptionId e atualizar
          console.log(`Pagamento bem-sucedido para subscription ${subscriptionId}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          // TODO: Buscar userId pelo subscriptionId e notificar
          console.log(`Pagamento falhou para subscription ${subscriptionId}`)
        }
        break
      }

      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

