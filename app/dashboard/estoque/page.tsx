'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Search, Edit, Trash2, Barcode, Camera, X, AlertCircle } from 'lucide-react'
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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleBarcodeSearch = async (barcode: string) => {
    try {
      const response = await fetch(`/api/products/barcode/${barcode}`)
      if (response.ok) {
        const data = await response.json()
        if (data.name) {
          setFormData({
            ...formData,
            barcode: barcode,
            name: data.name,
            price: data.price?.toString() || '',
            description: data.description || formData.description,
          })
        } else {
          // Se não encontrou dados da API, apenas atualiza o código de barras
          setFormData({
            ...formData,
            barcode: barcode,
          })
        }
      }
    } catch (error) {
      console.error('Error fetching barcode data:', error)
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
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Estoque</h1>
          <p className="text-gray-600 mt-2">Gerencie seus produtos e estoque</p>
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
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Adicionar Produto
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

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum produto encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                        <span className={isLowStock ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                          {product.stock}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          (mín: {product.minStock})
                        </span>
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
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                      <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) => {
                          const value = e.target.value
                          setFormData({ ...formData, barcode: value })
                          // Limpa erro ao digitar
                          if (errors.barcode) {
                            setErrors({ ...errors, barcode: '' })
                          }
                          if (value.length >= 8) {
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
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all bg-white font-mono text-lg ${
                          errors.barcode
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="Digite ou escaneie o código (opcional)"
                      />
                      {errors.barcode && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.barcode}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
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
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
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
    </div>
  )
}

