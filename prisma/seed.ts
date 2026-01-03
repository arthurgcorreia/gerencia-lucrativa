import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Criar planos
  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      slug: 'basic',
      description: 'Perfeito para começar',
      price: 0,
      duration: 30,
      isPopular: false,
      isActive: true,
      features: [
        'Até 50 produtos',
        'Gestão de estoque básica',
        'Relatórios simples',
        'Suporte por email',
        '1 usuário',
      ],
    },
    {
      id: 'professional',
      name: 'Profissional',
      slug: 'professional',
      description: 'Para negócios em crescimento',
      price: 49.90,
      duration: 30,
      isPopular: true,
      isActive: true,
      features: [
        'Produtos ilimitados',
        'Gestão avançada de estoque',
        'Relatórios detalhados e gráficos',
        'Leitor de código de barras',
        'Suporte prioritário',
        'Até 5 usuários',
        'Backup automático',
        'Exportação de dados',
      ],
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      slug: 'enterprise',
      description: 'Para empresas de grande porte',
      price: 149.90,
      duration: 30,
      isPopular: false,
      isActive: true,
      features: [
        'Tudo do plano Profissional',
        'Múltiplas lojas/filiais',
        'API personalizada',
        'Suporte 24/7',
        'Usuários ilimitados',
        'Relatórios customizados',
        'Integrações avançadas',
        'Gerente de conta dedicado',
      ],
    },
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    })
    console.log(`✅ Plano ${plan.name} criado/atualizado`)
  }

  console.log('🎉 Seeding concluído!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
