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

    const [totalProducts, products, sales] = await Promise.all([
      prisma.product.count({ where: { userId: decoded.userId } }),
      prisma.product.findMany({
        where: { userId: decoded.userId },
        select: { stock: true, minStock: true },
      }),
      prisma.sale.findMany({
        where: { userId: decoded.userId },
        select: { total: true },
      }),
    ])

    const lowStockCount = products.filter(p => p.stock <= p.minStock).length
    const totalSales = sales.length
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)

    return NextResponse.json({
      totalProducts,
      lowStockCount,
      totalSales,
      totalRevenue,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}

