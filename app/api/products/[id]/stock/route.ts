import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()
    const { stock } = body

    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json(
        { error: 'Estoque deve ser um número maior ou igual a zero' },
        { status: 400 }
      )
    }

    // Verificar se produto pertence ao usuário
    const existing = await prisma.product.findFirst({
      where: { id, userId: decoded.userId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar apenas o estoque
    const product = await prisma.product.update({
      where: { id },
      data: {
        stock: Math.floor(stock),
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error updating stock:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar estoque' },
      { status: 500 }
    )
  }
}

