'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Search, Edit, Trash2, Barcode, Camera, X } from 'lucide-react'
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
  const [showScanner, setShowScanner] = useState(false)

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
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          minStock: parseInt(formData.minStock),
        }),
      })

      if (response.ok) {
        setShowModal(false)
        setEditingProduct(null)
        setFormData({
          name: '',
          barcode: '',
          price: '',
          stock: '',
          minStock: '5',
          description: '',
        })
        fetchProducts()
      }
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      barcode: product.barcode,
      price: product.price.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      description: product.description || '',
    })
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
                {/* Código de Barras Section */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Barcode className="w-5 h-5 text-blue-600" />
                    Código de Barras *
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => {
                        setFormData({ ...formData, barcode: e.target.value })
                        if (e.target.value.length >= 8) {
                          handleBarcodeSearch(e.target.value)
                        }
                      }}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white font-mono text-lg"
                      placeholder="Digite ou escaneie o código"
                      required
                    />
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
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      placeholder="Nome completo do produto"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Preço (R$) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Estoque Atual *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      placeholder="Quantidade em estoque"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Estoque Mínimo *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      placeholder="Quantidade mínima"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Descrição do Produto
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white resize-none"
                      rows={4}
                      placeholder="Adicione uma descrição detalhada do produto (opcional)"
                    />
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

