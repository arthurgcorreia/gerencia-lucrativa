'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Barcode, Plus, Minus, Trash2, Check } from 'lucide-react'

interface CartItem {
  id: string
  productId: string
  name: string
  barcode: string
  price: number
  quantity: number
  subtotal: number
}

export default function VendasPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [barcodeInput, setBarcodeInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    calculateTotal()
  }, [cart])

  useEffect(() => {
    // Focar no input de código de barras ao carregar
    barcodeInputRef.current?.focus()
  }, [])

  const calculateTotal = () => {
    const sum = cart.reduce((acc, item) => acc + item.subtotal, 0)
    setTotal(sum)
  }

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcodeInput.trim()) return

    setLoading(true)
    try {
      // Buscar produto por código de barras
      const response = await fetch(`/api/products/barcode-search/${barcodeInput}`)
      if (response.ok) {
        const product = await response.json()
        if (product) {
          addToCart(product)
          setBarcodeInput('')
          barcodeInputRef.current?.focus()
        } else {
          alert('Produto não encontrado')
        }
      } else {
        alert('Produto não encontrado')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Erro ao buscar produto')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.productId === product.id)

    if (existingItem) {
      // Aumentar quantidade
      setCart(cart.map(item =>
        item.productId === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.price,
            }
          : item
      ))
    } else {
      // Adicionar novo item
      setCart([
        ...cart,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          barcode: product.barcode,
          price: product.price,
          quantity: 1,
          subtotal: product.price,
        },
      ])
    }
  }

  const updateQuantity = (itemId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + change)
        return {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * item.price,
        }
      }
      return item
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      alert('Adicione produtos ao carrinho')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          total,
        }),
      })

      if (response.ok) {
        setCart([])
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          barcodeInputRef.current?.focus()
        }, 2000)
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao finalizar venda')
      }
    } catch (error) {
      console.error('Error finalizing sale:', error)
      alert('Erro ao finalizar venda')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
        <p className="text-gray-600 mt-2">Realize vendas de forma rápida e eficiente</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Barcode Input and Cart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Barcode Input */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Barcode className="w-6 h-6 text-blue-600" />
              Código de Barras
            </h2>
            <form onSubmit={handleBarcodeSubmit} className="flex gap-4">
              <div className="flex-1 relative">
                <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={barcodeInputRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Escaneie ou digite o código de barras..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  disabled={loading}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading || !barcodeInput.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Buscando...' : 'Adicionar'}
              </button>
            </form>
          </div>

          {/* Cart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              Carrinho ({cart.length})
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Carrinho vazio</p>
                <p className="text-sm mt-2">Adicione produtos usando o código de barras</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="font-mono">{item.barcode}</span>
                        <span>R$ {item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right min-w-[6rem]">
                        <div className="font-bold text-gray-900">
                          R$ {item.subtotal.toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo da Venda</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Itens:</span>
                <span className="font-semibold">{cart.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Quantidade Total:</span>
                <span className="font-semibold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {showSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span>Venda realizada com sucesso!</span>
              </div>
            )}

            <button
              onClick={handleFinalizeSale}
              disabled={cart.length === 0 || loading}
              className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processando...'
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Finalizar Venda
                </>
              )}
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setCart([])
                  barcodeInputRef.current?.focus()
                }}
                disabled={cart.length === 0}
                className="text-sm text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Limpar Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

