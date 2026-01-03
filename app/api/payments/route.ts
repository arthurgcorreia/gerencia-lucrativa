import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const payments = await prisma.payment.findMany({
      where: { userId: decoded.userId },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar histórico de pagamentos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const body = await request.json()
    const { planId, paymentMethod } = body

    if (!planId) {
      return NextResponse.json(
        { error: 'Plano não especificado' },
        { status: 400 }
      )
    }

    // Buscar o plano
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 })
    }

    if (!plan.isActive) {
      return NextResponse.json({ error: 'Plano não está ativo' }, { status: 400 })
    }

    // Criar pagamento (simulado - em produção integrar com gateway de pagamento)
    const payment = await prisma.payment.create({
      data: {
        userId: decoded.userId,
        planId: plan.id,
        amount: plan.price,
        status: plan.price === 0 ? 'paid' : 'pending', // Planos gratuitos são pagos automaticamente
        paymentMethod: paymentMethod || (plan.price === 0 ? 'free' : null),
        metadata: {
          planName: plan.name,
          planDuration: plan.duration,
        },
      },
      include: {
        plan: true,
      },
    })

    // Se o pagamento for de um plano gratuito ou já estiver pago, atualizar o plano do usuário
    if (payment.status === 'paid') {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + plan.duration)

      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          currentPlanId: plan.id,
          planExpiresAt: expiresAt,
        },
      })
    }

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    )
  }
}

