// API Route para atualizar plano do usuário (usado pelo webhook)
// NOTA: Em produção, proteja esta rota com autenticação adequada
import { NextRequest, NextResponse } from 'next/server'
import { doc, updateDoc, getFirestore } from 'firebase/firestore'
import { db } from '@/services/firebase/config'

export async function POST(request: NextRequest) {
  try {
    const { userId, plan, subscriptionId } = await request.json()

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'userId e plan são obrigatórios' },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Firestore não está inicializado' },
        { status: 500 }
      )
    }

    // Atualizar plano do usuário
    const userRef = doc(db, 'users', userId)
    const updateData: any = {
      plan,
      updatedAt: new Date().toISOString(),
    }

    if (subscriptionId) {
      updateData.stripeSubscriptionId = subscriptionId
    }

    await updateDoc(userRef, updateData)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao atualizar plano:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar plano' },
      { status: 500 }
    )
  }
}

