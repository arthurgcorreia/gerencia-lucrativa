'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Barcode, Plus, Minus, Trash2, Check, Camera, Search, X, AlertCircle, CreditCard, DollarSign, QrCode, Info } from 'lucide-react'
import BarcodeScanner from '@/components/BarcodeScanner'

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
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchNotFound, setSearchNotFound] = useState(false)
  const [total, setTotal] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'money' | 'card' | 'pix' | null>(null)
  const [cardType, setCardType] = useState<'credit' | 'debit' | null>(null)
  const [moneyReceived, setMoneyReceived] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    calculateTotal()
  }, [cart])

  // Função para formatar valor monetário
  const formatCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''
    const amount = parseInt(numbers) / 100
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Função para converter valor formatado para número
  const parseCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''
    const amount = parseInt(numbers) / 100
    return amount.toString()
  }

  useEffect(() => {
    // Focar no input de busca ao carregar
    searchInputRef.current?.focus()
  }, [])

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Busca produtos enquanto digita (após 3 caracteres)
  useEffect(() => {
    const searchProducts = async () => {
      if (searchInput.trim().length < 3) {
        setSearchResults([])
        setShowResults(false)
        setSearchNotFound(false)
        return
      }

      setSearchLoading(true)
      setSearchNotFound(false)
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchInput.trim())}`)
        if (response.ok) {
          const products = await response.json()
          setSearchResults(products)
          setShowResults(products.length > 0)
          // Mostra mensagem se não encontrou e tem pelo menos 3 caracteres
          if (products.length === 0 && searchInput.trim().length >= 3) {
            setSearchNotFound(true)
          }
        }
      } catch (error) {
        console.error('Error searching products:', error)
        setSearchResults([])
        setSearchNotFound(false)
      } finally {
        setSearchLoading(false)
      }
    }

    const timeoutId = setTimeout(searchProducts, 300) // Debounce de 300ms
    return () => clearTimeout(timeoutId)
  }, [searchInput])

  const calculateTotal = () => {
    const sum = cart.reduce((acc, item) => acc + item.subtotal, 0)
    setTotal(sum)
  }

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return
    
    // Se há apenas um resultado ou resultado exato, adiciona diretamente
    if (searchResults.length === 1) {
      selectProduct(searchResults[0])
      return
    }
    
    // Caso contrário, tenta buscar por código de barras exato
    await searchAndAddProductByBarcode(searchInput.trim())
  }

  const searchAndAddProductByBarcode = async (barcode: string) => {
    setLoading(true)
    setSearchNotFound(false)
    try {
      // Buscar produto por código de barras exato no estoque cadastrado
      const response = await fetch(`/api/products/barcode-search/${encodeURIComponent(barcode)}`)
      if (response.ok) {
        const product = await response.json()
        if (product) {
          selectProduct(product)
        } else {
          setSearchNotFound(true)
        }
      } else {
        setSearchNotFound(true)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setSearchNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const selectProduct = (product: any) => {
    addToCart(product)
    setSearchInput('')
    setSearchResults([])
    setShowResults(false)
    setSearchNotFound(false)
    searchInputRef.current?.focus()
  }

  const handleScan = (barcode: string) => {
    // Fecha o scanner
    setShowScanner(false)
    // Busca e adiciona o produto ao carrinho por código de barras exato
    searchAndAddProductByBarcode(barcode)
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

  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      alert('Adicione produtos ao carrinho')
      return
    }
    // Abre modal de pagamento
    setShowPaymentModal(true)
    setPaymentMethod(null)
    setCardType(null)
    setMoneyReceived('')
  }

  const handlePaymentConfirm = async () => {
    if (!paymentMethod) {
      alert('Selecione uma forma de pagamento')
      return
    }

    if (paymentMethod === 'card' && !cardType) {
      alert('Selecione o tipo de cartão (crédito ou débito)')
      return
    }

    if (paymentMethod === 'money') {
      const received = parseFloat(parseCurrency(moneyReceived))
      if (isNaN(received) || received < total) {
        alert('Valor recebido deve ser maior ou igual ao total da venda')
        return
      }
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
          paymentMethod,
          cardType: paymentMethod === 'card' ? cardType : null,
        }),
      })

      if (response.ok) {
        setCart([])
        setShowPaymentModal(false)
        setPaymentMethod(null)
        setCardType(null)
        setMoneyReceived('')
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          searchInputRef.current?.focus()
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

  const calculateChange = (): number => {
    if (paymentMethod !== 'money' || !moneyReceived) return 0
    const received = parseFloat(parseCurrency(moneyReceived))
    if (isNaN(received)) return 0
    return Math.max(0, received - total)
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
          {/* Product Search */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Search className="w-6 h-6 text-blue-600" />
              Buscar Produto
            </h2>
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value)
                    if (e.target.value.trim().length >= 3) {
                      setShowResults(true)
                    }
                  }}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowResults(true)
                    }
                  }}
                  placeholder="Digite o nome ou código de barras do produto (mín. 3 letras)..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  disabled={loading}
                  autoFocus
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('')
                      setSearchResults([])
                      setShowResults(false)
                      searchInputRef.current?.focus()
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                
                {/* Lista de resultados */}
                {showResults && searchResults.length > 0 && (
                  <div
                    ref={searchResultsRef}
                    className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                  >
                    {searchLoading && (
                      <div className="p-4 text-center text-gray-500">
                        Buscando...
                      </div>
                    )}
                    {!searchLoading && searchResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => selectProduct(product)}
                        className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="font-mono">{product.barcode}</span>
                          <span className="text-blue-600 font-semibold">R$ {product.price.toFixed(2)}</span>
                          <span className="text-gray-500">Estoque: {product.stock}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                title="Escanear código de barras com a câmera"
              >
                <Camera className="w-5 h-5" />
                Escanear
              </button>
              <button
                type="submit"
                disabled={loading || !searchInput.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Buscando...' : 'Adicionar'}
              </button>
              </div>
              {searchNotFound && !searchLoading && searchInput.trim().length >= 3 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Nenhum produto encontrado no estoque com este termo.</span>
                </div>
              )}
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
                <p className="text-sm mt-2">Busque produtos por nome ou código de barras</p>
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
                  searchInputRef.current?.focus()
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

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScan}
      />
    </div>
  )
}

