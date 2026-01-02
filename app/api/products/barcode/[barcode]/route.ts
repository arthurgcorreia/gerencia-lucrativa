import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(
  request: NextRequest,
  { params }: { params: { barcode: string } }
) {
  try {
    const barcode = params.barcode

    // Integração com API de código de barras (exemplo: UPCItemDB)
    // Você pode substituir por outra API de sua escolha
    const apiUrl = process.env.BARCODE_API_URL || 'https://api.upcitemdb.com/prod/trial/lookup'
    
    try {
      const response = await axios.get(`${apiUrl}?upc=${barcode}`)
      
      if (response.data?.items && response.data.items.length > 0) {
        const item = response.data.items[0]
        return NextResponse.json({
          name: item.title || item.description || '',
          description: item.description || '',
          price: null, // A API gratuita geralmente não fornece preços
        })
      }
    } catch (apiError) {
      // Se a API externa falhar, retornamos vazio
      console.log('Barcode API not available, returning empty')
    }

    // Retornar vazio se não encontrar
    return NextResponse.json({ name: '', description: '', price: null })
  } catch (error) {
    console.error('Error fetching barcode data:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados do código de barras' },
      { status: 500 }
    )
  }
}

