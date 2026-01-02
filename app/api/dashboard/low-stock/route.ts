import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET() {
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

    const products = await prisma.product.findMany({
      where: {
        userId: decoded.userId,
        stock: { lte: prisma.product.fields.minStock },
      },
      orderBy: { stock: 'asc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching low stock:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos com estoque baixo' },
      { status: 500 }
    )
  }
}

