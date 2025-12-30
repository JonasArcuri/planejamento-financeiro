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
        const subscriptionId = session.subscription as string

        console.log(`📦 Checkout concluído - userId: ${userId}, subscriptionId: ${subscriptionId}`)

        if (userId) {
          // Buscar subscription para verificar status
          if (subscriptionId) {
            try {
              const subscription = await stripe.subscriptions.retrieve(subscriptionId)
              console.log(`📋 Subscription status: ${subscription.status}`)
              
              if (subscription.status === 'active') {
                await updateUserPlan(userId, 'premium', subscriptionId)
                console.log(`✅ Usuário ${userId} atualizado para premium após checkout`)
              } else {
                console.log(`⚠️ Subscription não está ativa ainda: ${subscription.status}`)
              }
            } catch (err: any) {
              console.error('Erro ao buscar subscription:', err.message)
              // Mesmo assim, tentar atualizar
              await updateUserPlan(userId, 'premium', subscriptionId)
            }
          } else {
            // Se não tiver subscriptionId, atualizar mesmo assim
            await updateUserPlan(userId, 'premium')
          }
        } else {
          console.warn('⚠️ Checkout concluído mas userId não encontrado no metadata')
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        console.log(`🔄 Subscription ${event.type} - userId: ${userId}, status: ${subscription.status}`)

        if (userId) {
          const newPlan = subscription.status === 'active' ? 'premium' : 'free'
          await updateUserPlan(userId, newPlan, subscription.id)
          console.log(`✅ Usuário ${userId} atualizado para ${newPlan}`)
        } else {
          // Tentar buscar userId pelo customer
          if (subscription.customer) {
            try {
              const customer = await stripe.customers.retrieve(subscription.customer as string)
              if (customer && !customer.deleted && 'metadata' in customer) {
                const customerUserId = customer.metadata?.userId
                if (customerUserId) {
                  const newPlan = subscription.status === 'active' ? 'premium' : 'free'
                  await updateUserPlan(customerUserId, newPlan, subscription.id)
                  console.log(`✅ Usuário ${customerUserId} atualizado para ${newPlan} via customer metadata`)
                } else {
                  console.warn(`⚠️ Customer ${subscription.customer} não tem userId no metadata`)
                }
              }
            } catch (err: any) {
              console.error('Erro ao buscar customer:', err.message)
            }
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        console.log(`🗑️ Subscription deletada - userId: ${userId}`)

        if (userId) {
          await updateUserPlan(userId, 'free')
          console.log(`✅ Usuário ${userId} rebaixado para free`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        console.log(`💳 Pagamento bem-sucedido - subscriptionId: ${subscriptionId}`)

        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)
            const userId = subscription.metadata?.userId || 
              (subscription.customer ? 
                (await stripe.customers.retrieve(subscription.customer as string) as any)?.metadata?.userId : 
                null)

            if (userId) {
              await updateUserPlan(userId, 'premium', subscriptionId)
              console.log(`✅ Usuário ${userId} confirmado como premium após pagamento`)
            } else {
              console.warn(`⚠️ Pagamento bem-sucedido mas userId não encontrado para subscription ${subscriptionId}`)
            }
          } catch (err: any) {
            console.error('Erro ao processar invoice.payment_succeeded:', err.message)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        console.log(`❌ Pagamento falhou - subscriptionId: ${subscriptionId}`)

        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)
            const userId = subscription.metadata?.userId

            if (userId) {
              console.log(`⚠️ Pagamento falhou para usuário ${userId}. Subscription status: ${subscription.status}`)
              // Não rebaixar imediatamente - o Stripe tentará novamente
              // Só rebaixar se a subscription for cancelada
              if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
                await updateUserPlan(userId, 'free')
                console.log(`✅ Usuário ${userId} rebaixado para free devido a falha de pagamento`)
              }
            }
          } catch (err: any) {
            console.error('Erro ao processar invoice.payment_failed:', err.message)
          }
        }
        break
      }

      default:
        console.log(`ℹ️ Evento não tratado: ${event.type}`)
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

