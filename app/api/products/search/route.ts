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

    const searchTerm = query.trim().toLowerCase()

    // Busca produtos por nome ou código de barras (case-insensitive e sem acentos)
    // Usa query raw para suportar ILIKE e unaccent (se disponível)
    // Fallback para busca normal se unaccent não estiver disponível
    let products: any[]
    
    try {
      // Tenta usar unaccent se estiver disponível (case-insensitive e sem acentos)
      products = await prisma.$queryRaw`
        SELECT * FROM "Product"
        WHERE "userId" = ${decoded.userId}::text
        AND (
          LOWER(UNACCENT("name")) LIKE ${`%${searchTerm}%`}
          OR LOWER("barcode") LIKE ${`%${searchTerm}%`}
        )
        ORDER BY 
          CASE WHEN "barcode" = ${query.trim()} THEN 0 ELSE 1 END,
          "name" ASC
        LIMIT 10
      `
    } catch (error: any) {
      // Se unaccent não estiver disponível, usa busca case-insensitive simples
      if (error.message?.includes('unaccent')) {
        products = await prisma.$queryRaw`
          SELECT * FROM "Product"
          WHERE "userId" = ${decoded.userId}::text
          AND (
            LOWER("name") LIKE ${`%${searchTerm}%`}
            OR LOWER("barcode") LIKE ${`%${searchTerm}%`}
          )
          ORDER BY 
            CASE WHEN "barcode" = ${query.trim()} THEN 0 ELSE 1 END,
            "name" ASC
          LIMIT 10
        `
      } else {
        throw error
      }
    }
    
    // Função para normalizar texto (remover acentos e converter para lowercase)
    const normalizeText = (text: string): string => {
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    }
    
    // Se unaccent não funcionou, filtra no código
    if (products.length === 0 || !products.some((p: any) => 
      normalizeText(p.name || '').includes(searchTerm) || 
      p.barcode?.toLowerCase().includes(searchTerm)
    )) {
      // Busca todos os produtos do usuário e filtra no código
      const allProducts = await prisma.product.findMany({
        where: {
          userId: decoded.userId,
        },
        take: 100, // Limita para performance
      })
      
      const normalizedSearch = normalizeText(searchTerm)
      products = allProducts
        .filter(product => {
          const normalizedName = normalizeText(product.name)
          const normalizedBarcode = product.barcode.toLowerCase()
          return normalizedName.includes(normalizedSearch) || 
                 normalizedBarcode.includes(normalizedSearch)
        })
        .sort((a, b) => {
          const aExactBarcode = a.barcode.toLowerCase() === query.trim().toLowerCase()
          const bExactBarcode = b.barcode.toLowerCase() === query.trim().toLowerCase()
          if (aExactBarcode && !bExactBarcode) return -1
          if (!aExactBarcode && bExactBarcode) return 1
          return a.name.localeCompare(b.name)
        })
        .slice(0, 10)
    } else {
      // Ordena manualmente se necessário
      products = products.sort((a: any, b: any) => {
        const aExactBarcode = a.barcode?.toLowerCase() === query.trim().toLowerCase()
        const bExactBarcode = b.barcode?.toLowerCase() === query.trim().toLowerCase()
        if (aExactBarcode && !bExactBarcode) return -1
        if (!aExactBarcode && bExactBarcode) return 1
        return (a.name || '').localeCompare(b.name || '')
      })
    }

    return NextResponse.json(sortedProducts)
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}
