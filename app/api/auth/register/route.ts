import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já cadastrado' },
        { status: 400 }
      )
    }

    // Criar usuário
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        onboardingCompleted: true,
      }
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Log detalhado para debug em produção
    if (process.env.NODE_ENV === 'production') {
      console.error('Registration error details:', {
        message: error?.message,
        code: error?.code,
        meta: error?.meta,
        stack: error?.stack,
      })
    }

    // Retornar erro mais específico se possível
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Se for erro de conexão com banco
    if (error?.message?.includes('DATABASE_URL') || error?.message?.includes('connection')) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados. Por favor, tente novamente mais tarde.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao criar conta. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}

