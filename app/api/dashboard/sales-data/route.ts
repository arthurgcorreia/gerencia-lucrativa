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

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const sales = await prisma.sale.findMany({
      where: {
        userId: decoded.userId,
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        total: true,
        createdAt: true,
      },
    })

    const salesByDate = sales.reduce((acc, sale) => {
      const date = sale.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { sales: 0, revenue: 0 }
      }
      acc[date].sales += 1
      acc[date].revenue += sale.total
      return acc
    }, {} as Record<string, { sales: number; revenue: number }>)

    const salesData = Object.entries(salesByDate)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        sales: data.sales,
        revenue: data.revenue,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json(salesData)
  } catch (error) {
    console.error('Error fetching sales data:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados de vendas' },
      { status: 500 }
    )
  }
}

