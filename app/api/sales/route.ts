import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

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
    const { items, total } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrinho vazio' },
        { status: 400 }
      )
    }

    // Verificar estoque e criar venda em transação
    const sale = await prisma.$transaction(async (tx) => {
      // Criar venda
      const newSale = await tx.sale.create({
        data: {
          userId: decoded.userId,
          total: parseFloat(total),
        },
      })

      // Criar itens da venda e atualizar estoque
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        })

        if (!product) {
          throw new Error(`Produto ${item.productId} não encontrado`)
        }

        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}`)
        }

        // Criar item da venda
        await tx.saleItem.create({
          data: {
            saleId: newSale.id,
            productId: item.productId,
            quantity: item.quantity,
            price: parseFloat(item.price),
            subtotal: parseFloat(item.price) * item.quantity,
          },
        })

        // Atualizar estoque
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: product.stock - item.quantity,
          },
        })
      }

      return newSale
    })

    return NextResponse.json({ sale }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating sale:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar venda' },
      { status: 500 }
    )
  }
}

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

    const sales = await prisma.sale.findMany({
      where: { userId: decoded.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar vendas' },
      { status: 500 }
    )
  }
}

