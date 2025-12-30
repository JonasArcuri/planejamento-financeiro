// API Route para atualizar plano do usuário (usado pelo webhook)
// NOTA: Em produção, proteja esta rota com autenticação adequada
import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, doc, updateDoc, Timestamp } from 'firebase/firestore'

// Inicializar Firebase no servidor (para API routes)
let serverDb: any = null

try {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  if (!getApps().length) {
    const app = initializeApp(firebaseConfig)
    serverDb = getFirestore(app)
  } else {
    serverDb = getFirestore(getApps()[0])
  }
} catch (error) {
  console.error('Erro ao inicializar Firebase no servidor:', error)
}

export async function POST(request: NextRequest) {
  try {
    const { userId, plan, subscriptionId } = await request.json()

    console.log(`🔄 Tentando atualizar plano - userId: ${userId}, plan: ${plan}, subscriptionId: ${subscriptionId}`)

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'userId e plan são obrigatórios' },
        { status: 400 }
      )
    }

    if (!serverDb) {
      console.error('❌ Firestore não inicializado no servidor')
      return NextResponse.json(
        { error: 'Firestore não está inicializado' },
        { status: 500 }
      )
    }

    // Atualizar plano do usuário
    const userRef = doc(serverDb, 'users', userId)
    const updateData: any = {
      plan,
      updatedAt: Timestamp.now(),
    }

    if (subscriptionId) {
      updateData.stripeSubscriptionId = subscriptionId
    }

    await updateDoc(userRef, updateData)

    console.log(`✅ Usuário ${userId} atualizado para plano ${plan}${subscriptionId ? ` (subscription: ${subscriptionId})` : ''}`)
    
    return NextResponse.json({ 
      success: true, 
      message: `Plano atualizado para ${plan}`,
      userId,
      plan 
    })
  } catch (error: any) {
    console.error('❌ Erro ao atualizar plano:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar plano' },
      { status: 500 }
    )
  }
}

