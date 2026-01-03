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

    // Função para normalizar texto (remover acentos e converter para lowercase)
    const normalizeText = (text: string): string => {
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    }

    const normalizedSearch = normalizeText(searchTerm)

    // Busca todos os produtos do usuário (limitado para performance)
    const allProducts = await prisma.product.findMany({
      where: {
        userId: decoded.userId,
      },
      take: 500, // Limita para performance
    })

    // Filtra produtos normalizando nome e código de barras (case-insensitive e sem acentos)
    const filteredProducts = allProducts.filter(product => {
      const normalizedName = normalizeText(product.name)
      const normalizedBarcode = normalizeText(product.barcode)
      return normalizedName.includes(normalizedSearch) || 
             normalizedBarcode.includes(normalizedSearch)
    })

    // Ordena: prioriza correspondências exatas de código de barras, depois ordena por nome
    const sortedProducts = filteredProducts.sort((a, b) => {
      const aExactBarcode = normalizeText(a.barcode) === normalizedSearch
      const bExactBarcode = normalizeText(b.barcode) === normalizedSearch
      if (aExactBarcode && !bExactBarcode) return -1
      if (!aExactBarcode && bExactBarcode) return 1
      return a.name.localeCompare(b.name)
    })

    // Limita a 10 resultados
    const products = sortedProducts.slice(0, 10)

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}
