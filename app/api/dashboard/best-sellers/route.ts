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

    const sales = await prisma.saleItem.findMany({
      where: {
        sale: { userId: decoded.userId },
      },
      include: {
        product: true,
      },
    })

    const productSales = sales.reduce((acc, item) => {
      const productId = item.productId
      if (!acc[productId]) {
        acc[productId] = {
          name: item.product.name,
          quantity: 0,
        }
      }
      acc[productId].quantity += item.quantity
      return acc
    }, {} as Record<string, { name: string; quantity: number }>)

    const bestSellers = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    return NextResponse.json(bestSellers)
  } catch (error) {
    console.error('Error fetching best sellers:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos mais vendidos' },
      { status: 500 }
    )
  }
}

