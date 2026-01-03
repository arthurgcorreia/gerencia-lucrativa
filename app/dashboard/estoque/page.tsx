'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Search, Edit, Trash2, Barcode, Camera, X, AlertCircle, Loader2, CheckCircle2, Minus } from 'lucide-react'
import BarcodeScanner from '@/components/BarcodeScanner'

interface Product {
  id: string
  name: string
  barcode: string
  price: number
  stock: number
  minStock: number
  description?: string
}

export default function EstoquePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    price: '',
    stock: '',
    minStock: '5',
    description: '',
  })

  // Função para formatar valor monetário
  const formatCurrency = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')
    
    if (!numbers) return ''
    
    // Converte para número e divide por 100 para ter centavos
    const amount = parseInt(numbers) / 100
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Função para converter valor formatado para número
  const parseCurrency = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')
    
    if (!numbers) return ''
    
    // Converte para número e divide por 100 para ter centavos
    const amount = parseInt(numbers) / 100
    
    return amount.toString()
  }

  const [showScanner, setShowScanner] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [barcodeLoading, setBarcodeLoading] = useState(false)
  const [barcodeSuccess, setBarcodeSuccess] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [showStockModal, setShowStockModal] = useState(false)
  const [productToUpdateStock, setProductToUpdateStock] = useState<Product | null>(null)
  const [stockQuantity, setStockQuantity] = useState('')
  const [stockOperation, setStockOperation] = useState<'add' | 'remove'>('add')

  // Funções de validação
  const validateName = (name: string): string => {
    if (!name || name.trim().length === 0) {
      return 'Nome do produto é obrigatório'
    }
    if (name.trim().length < 3) {
      return 'Nome deve ter pelo menos 3 caracteres'
    }
    if (name.trim().length > 200) {
      return 'Nome deve ter no máximo 200 caracteres'
    }
    return ''
  }

  const validatePrice = (price: string): string => {
    if (!price || price.trim() === '' || price === 'R$') {
      return 'Preço é obrigatório'
    }
    const numericValue = parseFloat(parseCurrency(price))
    if (isNaN(numericValue) || numericValue < 0) {
      return 'Preço deve ser um valor válido'
    }
    if (numericValue < 0.01) {
      return 'Preço deve ser no mínimo R$ 0,01'
    }
    if (numericValue > 999999.99) {
      return 'Preço não pode ser maior que R$ 999.999,99'
    }
    return ''
  }

  const validateStock = (stock: string): string => {
    if (!stock || stock.trim() === '') {
      return 'Estoque é obrigatório'
    }
    const stockNum = parseInt(stock)
    if (isNaN(stockNum)) {
      return 'Estoque deve ser um número válido'
    }
    if (stockNum < 0) {
      return 'Estoque não pode ser negativo'
    }
    if (stockNum > 999999) {
      return 'Estoque não pode ser maior que 999.999'
    }
    if (!Number.isInteger(stockNum)) {
      return 'Estoque deve ser um número inteiro'
    }
    return ''
  }

  const validateMinStock = (minStock: string): string => {
    if (!minStock || minStock.trim() === '') {
      return 'Estoque mínimo é obrigatório'
    }
    const minStockNum = parseInt(minStock)
    if (isNaN(minStockNum)) {
      return 'Estoque mínimo deve ser um número válido'
    }
    if (minStockNum < 0) {
      return 'Estoque mínimo não pode ser negativo'
    }
    if (minStockNum > 999999) {
      return 'Estoque mínimo não pode ser maior que 999.999'
    }
    if (!Number.isInteger(minStockNum)) {
      return 'Estoque mínimo deve ser um número inteiro'
    }
    return ''
  }

  const validateBarcode = (barcode: string): string => {
    if (!barcode || barcode.trim() === '') {
      return '' // Opcional
    }
    const barcodeTrimmed = barcode.trim()
    if (barcodeTrimmed.length < 8) {
      return 'Código de barras deve ter pelo menos 8 caracteres'
    }
    if (barcodeTrimmed.length > 50) {
      return 'Código de barras deve ter no máximo 50 caracteres'
    }
    // Valida se contém apenas números (padrão EAN/UPC)
    if (!/^\d+$/.test(barcodeTrimmed)) {
      return 'Código de barras deve conter apenas números'
    }
    return ''
  }

  const validateDescription = (description: string): string => {
    if (description && description.length > 500) {
      return 'Descrição deve ter no máximo 500 caracteres'
    }
    return ''
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    const nameError = validateName(formData.name)
    if (nameError) newErrors.name = nameError

    const priceError = validatePrice(formData.price)
    if (priceError) newErrors.price = priceError

    const stockError = validateStock(formData.stock)
    if (stockError) newErrors.stock = stockError

    const minStockError = validateMinStock(formData.minStock)
    if (minStockError) newErrors.minStock = minStockError

    const barcodeError = validateBarcode(formData.barcode)
    if (barcodeError) newErrors.barcode = barcodeError

    const descriptionError = validateDescription(formData.description)
    if (descriptionError) newErrors.description = descriptionError

    // Validação adicional: estoque mínimo não pode ser maior que estoque atual
    if (!stockError && !minStockError) {
      const stockNum = parseInt(formData.stock)
      const minStockNum = parseInt(formData.minStock)
      if (minStockNum > stockNum) {
        newErrors.minStock = 'Estoque mínimo não pode ser maior que o estoque atual'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setErrors({})

    // Validar formulário antes de enviar
    if (!validateForm()) {
      setSubmitError('Por favor, corrija os erros no formulário')
      return
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(parseCurrency(formData.price)),
          stock: parseInt(formData.stock),
          minStock: parseInt(formData.minStock),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowModal(false)
        setEditingProduct(null)
        setErrors({})
        setSubmitError('')
        setFormData({
          name: '',
          barcode: '',
          price: '',
          stock: '',
          minStock: '5',
          description: '',
        })
        fetchProducts()
      } else {
        setSubmitError(data.error || 'Erro ao salvar produto')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      setSubmitError('Erro ao conectar com o servidor')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      barcode: product.barcode,
      price: formatCurrency((product.price * 100).toString()), // Converte para centavos e formata
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      description: product.description || '',
    })
    setErrors({})
    setSubmitError('')
    setShowModal(true)
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProducts()
        setShowDeleteModal(false)
        setProductToDelete(null)
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao excluir produto')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Erro ao excluir produto')
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setProductToDelete(null)
  }

  const handleStockUpdateClick = (product: Product, operation: 'add' | 'remove') => {
    setProductToUpdateStock(product)
    setStockOperation(operation)
    setStockQuantity('')
    setShowStockModal(true)
  }

  const handleStockUpdateCancel = () => {
    setShowStockModal(false)
    setProductToUpdateStock(null)
    setStockQuantity('')
  }

  const handleStockUpdate = async () => {
    if (!productToUpdateStock) return

    const quantity = parseInt(stockQuantity)
    if (isNaN(quantity) || quantity <= 0) {
      alert('Digite uma quantidade válida')
      return
    }

    const newStock = stockOperation === 'add' 
      ? productToUpdateStock.stock + quantity
      : Math.max(0, productToUpdateStock.stock - quantity)

    try {
      const response = await fetch(`/api/products/${productToUpdateStock.id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      })

      if (response.ok) {
        await fetchProducts()
        setShowStockModal(false)
        setProductToUpdateStock(null)
        setStockQuantity('')
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao atualizar estoque')
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Erro ao atualizar estoque')
    }
  }

  const handleBarcodeSearch = async (barcode: string) => {
    // Limpa sucesso anterior
    setBarcodeSuccess(false)
    
    // Valida se o código de barras tem tamanho mínimo
    if (!barcode || barcode.trim().length < 8) {
      return
    }

    setBarcodeLoading(true)
    try {
      console.log('Buscando código de barras:', barcode.trim())
      const response = await fetch(`/api/products/barcode/${barcode.trim()}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Dados recebidos da API:', data)
        
        if (data.name && data.name.trim() !== '') {
          // Formata o preço se existir
          let formattedPrice = ''
          if (data.price && typeof data.price === 'number' && data.price > 0) {
            formattedPrice = formatCurrency((data.price * 100).toString())
          }
          
          // Atualiza o formulário com os dados encontrados
          setFormData((prevFormData) => ({
            ...prevFormData,
            barcode: barcode.trim(),
            name: data.name.trim(),
            price: formattedPrice,
            description: data.description?.trim() || prevFormData.description,
          }))
          
          console.log('Formulário atualizado com:', { name: data.name, price: formattedPrice })
          
          // Mostra feedback de sucesso
          setBarcodeSuccess(true)
          setTimeout(() => setBarcodeSuccess(false), 3000) // Remove após 3 segundos
          
          // Limpa erros dos campos preenchidos
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors }
            if (newErrors.name) delete newErrors.name
            if (newErrors.barcode) delete newErrors.barcode
            if (formattedPrice && newErrors.price) delete newErrors.price
            return newErrors
          })
        } else {
          console.log('Nome do produto não encontrado na resposta da API')
          // Se não encontrou dados da API, apenas atualiza o código de barras
          setFormData((prevFormData) => ({
            ...prevFormData,
            barcode: barcode.trim(),
          }))
        }
      } else {
        console.error('Erro na resposta da API:', response.status, response.statusText)
        const errorData = await response.json().catch(() => ({}))
        console.error('Dados do erro:', errorData)
        // Em caso de erro, apenas atualiza o código de barras
        setFormData((prevFormData) => ({
          ...prevFormData,
          barcode: barcode.trim(),
        }))
      }
    } catch (error) {
      console.error('Error fetching barcode data:', error)
      // Em caso de erro, apenas atualiza o código de barras
      setFormData((prevFormData) => ({
        ...prevFormData,
        barcode: barcode.trim(),
      }))
    } finally {
      setBarcodeLoading(false)
    }
  }

  const handleScan = (barcode: string) => {
    setFormData({
      ...formData,
      barcode: barcode,
    })
    // Buscar informações do código de barras
    handleBarcodeSearch(barcode)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  )

  return (
    <div className="p-3 md:p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestão de Estoque</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Gerencie seus produtos e estoque</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null)
            setErrors({})
            setSubmitError('')
            setFormData({
              name: '',
              barcode: '',
              price: '',
              stock: '',
              minStock: '5',
              description: '',
            })
            setShowModal(true)
          }}
          className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm md:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Adicionar Produto</span>
          <span className="sm:hidden">Adicionar</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou código de barras..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Table/Cards */}
      {loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum produto encontrado</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Produto</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Código de Barras</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Preço</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Estoque</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const isLowStock = product.stock <= product.minStock
                    return (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500">{product.description}</div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Barcode className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-sm">{product.barcode}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold">R$ {product.price.toFixed(2)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className={isLowStock ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                              {product.stock}
                            </span>
                            <span className="text-gray-500 text-sm">
                              (mín: {product.minStock})
                            </span>
                            <div className="flex items-center gap-1 ml-2">
                              <button
                                onClick={() => handleStockUpdateClick(product, 'add')}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Adicionar ao estoque"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStockUpdateClick(product, 'remove')}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remover do estoque"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {isLowStock ? (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              Estoque Baixo
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              OK
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredProducts.map((product) => {
              const isLowStock = product.stock <= product.minStock
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Barcode className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-mono truncate">{product.barcode}</span>
                      </div>
                    </div>
                    {isLowStock ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex-shrink-0 ml-2">
                        Baixo
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex-shrink-0 ml-2">
                        OK
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Preço:</span>
                      <span className="font-semibold text-gray-900">R$ {product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Estoque:</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                        <span className="text-gray-500 text-xs">(mín: {product.minStock})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleStockUpdateClick(product, 'add')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                      title="Adicionar ao estoque"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Adicionar</span>
                    </button>
                    <button
                      onClick={() => handleStockUpdateClick(product, 'remove')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                      title="Remover do estoque"
                    >
                      <Minus className="w-4 h-4" />
                      <span className="text-sm font-medium">Remover</span>
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm">
                    {editingProduct ? 'Atualize as informações do produto' : 'Preencha os dados do novo produto'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-8 space-y-6">
                {/* Mensagem de erro geral */}
                {submitError && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{submitError}</span>
                  </div>
                )}

                {/* Código de Barras Section */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Barcode className="w-5 h-5 text-blue-600" />
                    Código de Barras
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.barcode}
                          onChange={(e) => {
                            const value = e.target.value
                            setFormData({ ...formData, barcode: value })
                            // Limpa erro e sucesso ao digitar
                            if (errors.barcode) {
                              setErrors({ ...errors, barcode: '' })
                            }
                            setBarcodeSuccess(false)
                            if (value.length >= 8 && /^\d+$/.test(value)) {
                              handleBarcodeSearch(value)
                            }
                          }}
                          onBlur={() => {
                            const error = validateBarcode(formData.barcode)
                            if (error) {
                              setErrors({ ...errors, barcode: error })
                            } else {
                              const newErrors = { ...errors }
                              delete newErrors.barcode
                              setErrors(newErrors)
                            }
                          }}
                          disabled={barcodeLoading}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all bg-white font-mono text-lg pr-12 ${
                            errors.barcode
                              ? 'border-red-500 focus:border-red-500'
                              : barcodeSuccess
                              ? 'border-green-500 focus:border-green-500'
                              : 'border-gray-300 focus:border-blue-500'
                          } ${barcodeLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                          placeholder="Digite ou escaneie o código (opcional)"
                        />
                        {/* Ícone de loading ou sucesso */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {barcodeLoading && (
                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                          )}
                          {barcodeSuccess && !barcodeLoading && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </div>
                      {errors.barcode && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.barcode}
                        </p>
                      )}
                      {barcodeSuccess && !errors.barcode && (
                        <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Dados do produto encontrados e preenchidos automaticamente!
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      disabled={barcodeLoading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all flex items-center gap-2 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Escanear código de barras com a câmera"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Escanear</span>
                    </button>
                  </div>
                </div>

                {/* Grid de campos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        // Limpa erro ao digitar
                        if (errors.name) {
                          setErrors({ ...errors, name: '' })
                        }
                      }}
                      onBlur={() => {
                        const error = validateName(formData.name)
                        if (error) {
                          setErrors({ ...errors, name: error })
                        } else {
                          const newErrors = { ...errors }
                          delete newErrors.name
                          setErrors(newErrors)
                        }
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all bg-white ${
                        errors.name
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Nome completo do produto"
                      maxLength={200}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                    {!errors.name && formData.name && (
                      <p className="mt-1 text-xs text-gray-500">
                        {formData.name.length}/200 caracteres
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Preço (R$) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => {
                          const formatted = formatCurrency(e.target.value)
                          setFormData({ ...formData, price: formatted })
                          // Limpa erro ao digitar
                          if (errors.price) {
                            setErrors({ ...errors, price: '' })
                          }
                        }}
                        onBlur={(e) => {
                          // Garante que sempre tenha pelo menos R$ 0,00
                          if (!e.target.value || e.target.value === 'R$') {
                            setFormData({ ...formData, price: 'R$ 0,00' })
                          }
                          const error = validatePrice(formData.price || 'R$ 0,00')
                          if (error) {
                            setErrors({ ...errors, price: error })
                          } else {
                            const newErrors = { ...errors }
                            delete newErrors.price
                            setErrors(newErrors)
                          }
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all bg-white font-semibold text-lg ${
                          errors.price
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Estoque Atual *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="999999"
                      step="1"
                      value={formData.stock}
                      onChange={(e) => {
                        const value = e.target.value
                        // Permite apenas números inteiros
                        if (value === '' || /^\d+$/.test(value)) {
                          setFormData({ ...formData, stock: value })
                          // Limpa erro ao digitar
                          if (errors.stock) {
                            setErrors({ ...errors, stock: '' })
                          }
                        }
                      }}
                      onBlur={() => {
                        const error = validateStock(formData.stock)
                        if (error) {
                          setErrors({ ...errors, stock: error })
                        } else {
                          const newErrors = { ...errors }
                          delete newErrors.stock
                          setErrors(newErrors)
                          // Revalida estoque mínimo se necessário
                          if (formData.minStock) {
                            const minStockError = validateMinStock(formData.minStock)
                            if (!minStockError && parseInt(formData.minStock) > parseInt(formData.stock || '0')) {
                              setErrors({ ...newErrors, minStock: 'Estoque mínimo não pode ser maior que o estoque atual' })
                            }
                          }
                        }
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all bg-white ${
                        errors.stock
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Quantidade em estoque"
                    />
                    {errors.stock && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.stock}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Estoque Mínimo *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="999999"
                      step="1"
                      value={formData.minStock}
                      onChange={(e) => {
                        const value = e.target.value
                        // Permite apenas números inteiros
                        if (value === '' || /^\d+$/.test(value)) {
                          setFormData({ ...formData, minStock: value })
                          // Limpa erro ao digitar
                          if (errors.minStock) {
                            setErrors({ ...errors, minStock: '' })
                          }
                        }
                      }}
                      onBlur={() => {
                        const error = validateMinStock(formData.minStock)
                        if (error) {
                          setErrors({ ...errors, minStock: error })
                        } else {
                          // Valida se não é maior que estoque atual
                          const stockNum = parseInt(formData.stock || '0')
                          const minStockNum = parseInt(formData.minStock)
                          if (minStockNum > stockNum) {
                            setErrors({ ...errors, minStock: 'Estoque mínimo não pode ser maior que o estoque atual' })
                          } else {
                            const newErrors = { ...errors }
                            delete newErrors.minStock
                            setErrors(newErrors)
                          }
                        }
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all bg-white ${
                        errors.minStock
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Quantidade mínima"
                    />
                    {errors.minStock && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.minStock}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Descrição do Produto
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length <= 500) {
                          setFormData({ ...formData, description: value })
                          // Limpa erro ao digitar
                          if (errors.description) {
                            setErrors({ ...errors, description: '' })
                          }
                        }
                      }}
                      onBlur={() => {
                        const error = validateDescription(formData.description)
                        if (error) {
                          setErrors({ ...errors, description: error })
                        } else {
                          const newErrors = { ...errors }
                          delete newErrors.description
                          setErrors(newErrors)
                        }
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all bg-white resize-none ${
                        errors.description
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      rows={4}
                      placeholder="Adicione uma descrição detalhada do produto (opcional)"
                      maxLength={500}
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                    {!errors.description && (
                      <p className="mt-1 text-xs text-gray-500">
                        {formData.description.length}/500 caracteres
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
                  }}
                  className="px-4 md:px-6 py-2.5 md:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 transition-all font-semibold text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 md:px-8 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {editingProduct ? (
                    <>
                      <Package className="w-5 h-5" />
                      Salvar Alterações
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Adicionar Produto
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScan}
      />

      {/* Stock Update Modal */}
      {showStockModal && productToUpdateStock && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-white rounded-none md:rounded-2xl shadow-2xl max-w-md w-full h-full md:h-auto md:max-h-[90vh] flex flex-col">
            <div className="px-4 md:px-8 py-4 md:py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {stockOperation === 'add' ? 'Adicionar ao Estoque' : 'Remover do Estoque'}
                  </h2>
                  <p className="text-gray-600 mt-1 text-xs md:text-sm line-clamp-2">
                    {stockOperation === 'add' 
                      ? `Adicionar quantidade ao produto: ${productToUpdateStock.name}`
                      : `Remover quantidade do produto: ${productToUpdateStock.name}`
                    }
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStockUpdateCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="mb-4 md:mb-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-gray-600">Estoque Atual</p>
                  <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">
                    {productToUpdateStock.stock} unidades
                  </p>
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Quantidade a {stockOperation === 'add' ? 'adicionar' : 'remover'}:
                </label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-lg font-semibold"
                  placeholder="Digite a quantidade"
                  autoFocus
                />
                {stockOperation === 'remove' && stockQuantity && parseInt(stockQuantity) > productToUpdateStock.stock && (
                  <p className="mt-2 text-xs md:text-sm text-red-600">
                    A quantidade não pode ser maior que o estoque atual ({productToUpdateStock.stock})
                  </p>
                )}
              </div>

              {stockQuantity && !isNaN(parseInt(stockQuantity)) && parseInt(stockQuantity) > 0 && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600">Novo Estoque:</p>
                  <p className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                    {stockOperation === 'add' 
                      ? productToUpdateStock.stock + parseInt(stockQuantity)
                      : Math.max(0, productToUpdateStock.stock - parseInt(stockQuantity))
                    } unidades
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-end pt-4 border-t border-gray-200 md:border-0">
                <button
                  type="button"
                  onClick={handleStockUpdateCancel}
                  className="px-4 md:px-6 py-2.5 md:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleStockUpdate}
                  disabled={
                    !stockQuantity || 
                    isNaN(parseInt(stockQuantity)) || 
                    parseInt(stockQuantity) <= 0 ||
                    (stockOperation === 'remove' && parseInt(stockQuantity) > productToUpdateStock.stock)
                  }
                  className="px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {stockOperation === 'add' ? 'Adicionar' : 'Remover'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Excluir Produto</h3>
                  <p className="text-gray-600 text-sm mt-1">Esta ação não pode ser desfeita</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">
                  Tem certeza que deseja excluir o produto <strong className="font-semibold text-gray-900">{productToDelete.name}</strong>?
                </p>
                {productToDelete.stock > 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <AlertCircle className="w-4 h-4 inline-block mr-1" />
                      Este produto possui <strong>{productToDelete.stock}</strong> unidades em estoque.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-all font-semibold flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Produto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

