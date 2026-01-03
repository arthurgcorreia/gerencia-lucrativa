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

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    if (!query || query.trim().length < 1) {
      return NextResponse.json([])
    }

    const searchTerm = query.trim()

    // Busca produtos por nome ou código de barras
    const products = await prisma.product.findMany({
      where: {
        userId: decoded.userId,
        OR: [
          {
            name: {
              contains: searchTerm,
            },
          },
          {
            barcode: {
              contains: searchTerm,
            },
          },
        ],
      },
      orderBy: [
        // Prioriza correspondências exatas de código de barras primeiro
        {
          name: 'asc',
        },
      ],
      take: 10, // Limita a 10 resultados
    })
    
    // Ordena manualmente para priorizar correspondências exatas de código de barras
    const sortedProducts = products.sort((a, b) => {
      const aExactBarcode = a.barcode === searchTerm
      const bExactBarcode = b.barcode === searchTerm
      if (aExactBarcode && !bExactBarcode) return -1
      if (!aExactBarcode && bExactBarcode) return 1
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json(sortedProducts)
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}
