import { NextRequest, NextResponse } from 'next/server'
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
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
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
    const { name, barcode, price, stock, minStock, description } = body

    // Se barcode for fornecido, verificar se já existe
    if (barcode && barcode.trim()) {
      const existing = await prisma.product.findUnique({
        where: { barcode: barcode.trim() },
      })

      if (existing && existing.userId !== decoded.userId) {
        return NextResponse.json(
          { error: 'Código de barras já cadastrado' },
          { status: 400 }
        )
      }
    }

    // Gerar um código único se barcode não for fornecido
    const finalBarcode = barcode?.trim() || `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const product = await prisma.product.create({
      data: {
        name,
        barcode: finalBarcode,
        price: parseFloat(price),
        stock: parseInt(stock),
        minStock: parseInt(minStock) || 5,
        description: description || null,
        userId: decoded.userId,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Código de barras já cadastrado' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}

