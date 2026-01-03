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
      const response = await axios.get(`${apiUrl}?upc=${barcode}`, {
        timeout: 10000, // 10 segundos de timeout
      })
      
      console.log('Barcode API Response:', JSON.stringify(response.data, null, 2))
      
      if (response.data?.items && response.data.items.length > 0) {
        const item = response.data.items[0]
        const productName = item.title || item.description || item.brand || ''
        const productDescription = item.description || item.brand || ''
        
        console.log('Product found:', { name: productName, description: productDescription })
        
        if (productName) {
          return NextResponse.json({
            name: productName,
            description: productDescription,
            price: item.lowest_price || null, // Tenta pegar o preço mais baixo se disponível
          })
        }
      }
    } catch (apiError: any) {
      // Se a API externa falhar, retornamos vazio
      console.error('Barcode API error:', apiError.message)
      if (apiError.response) {
        console.error('API Response status:', apiError.response.status)
        console.error('API Response data:', apiError.response.data)
      }
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

