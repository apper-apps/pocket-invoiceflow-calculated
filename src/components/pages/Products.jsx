import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import Modal from '@/components/atoms/Modal'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import productService from '@/services/api/productService'

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    description: '',
    category: ''
  })
  const [formErrors, setFormErrors] = useState({})
  
  useEffect(() => {
    loadProducts()
  }, [])
  
  useEffect(() => {
    // Filter products based on search term
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [products, searchTerm])
  
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await productService.getAll()
      setProducts(data)
      setFilteredProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  
  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      sku: '',
      price: '',
      description: '',
      category: ''
    })
    setFormErrors({})
    setShowModal(true)
  }
  
  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      description: product.description,
      category: product.category
    })
    setFormErrors({})
    setShowModal(true)
  }
  
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id)
        await loadProducts()
        toast.success('Product deleted successfully')
      } catch (err) {
        toast.error('Failed to delete product')
      }
    }
  }
  
  const handleFormChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required'
    }
    
    if (!formData.sku.trim()) {
      errors.sku = 'SKU is required'
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Valid price is required'
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setFormLoading(true)
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      }
      
      if (editingProduct) {
        await productService.update(editingProduct.Id, productData)
        toast.success('Product updated successfully')
      } else {
        await productService.create(productData)
        toast.success('Product added successfully')
      }
      
      setShowModal(false)
      setEditingProduct(null)
      await loadProducts()
    } catch (err) {
      toast.error('Failed to save product')
    } finally {
      setFormLoading(false)
    }
  }
  
  const handleModalClose = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormErrors({})
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
  if (error) {
    return <Error message={error} onRetry={loadProducts} />
  }
  
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Products</h1>
          <p className="text-secondary-600">
            Manage your product catalog and pricing information.
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products by name, SKU, or category..."
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'grid' 
                ? 'bg-primary-100 text-primary-600' 
                : 'text-secondary-400 hover:text-secondary-600'
            }`}
          >
            <ApperIcon name="Grid3X3" size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'list' 
                ? 'bg-primary-100 text-primary-600' 
                : 'text-secondary-400 hover:text-secondary-600'
            }`}
          >
            <ApperIcon name="List" size={20} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-card border border-secondary-200">
              <div className="space-y-3">
                <div className="w-24 h-4 bg-secondary-200 rounded shimmer"></div>
                <div className="w-16 h-3 bg-secondary-200 rounded shimmer"></div>
                <div className="w-20 h-6 bg-secondary-200 rounded shimmer"></div>
                <div className="w-full h-3 bg-secondary-200 rounded shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Empty
          icon="Package"
          title="No products found"
          description={products.length === 0 
            ? "Add your first product to start creating invoices with proper line items."
            : "No products match your search criteria. Try adjusting your search terms."
          }
          actionLabel="Add First Product"
          onAction={handleAddProduct}
          showAction={products.length === 0}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.Id}
              className="bg-white rounded-xl shadow-card border border-secondary-200 hover:shadow-lift transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-success-100 to-success-200 p-3 rounded-full">
                      <ApperIcon name="Package" size={20} className="text-success-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">{product.name}</h3>
                      <p className="text-sm text-secondary-600">SKU: {product.sku}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-1 text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.Id)}
                      className="p-1 text-secondary-400 hover:text-error-600 transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                    {product.category}
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-secondary-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-card border border-secondary-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-secondary-700">Product</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-secondary-700">SKU</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-secondary-700">Category</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-secondary-700">Price</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-secondary-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.Id}
                    className="table-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-secondary-900">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-secondary-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-secondary-700">{product.sku}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold text-secondary-900">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-1 text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.Id)}
                          className="p-1 text-secondary-400 hover:text-error-600 transition-colors duration-200"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              error={formErrors.name}
              required
              placeholder="Enter product name"
            />
            
            <FormField
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleFormChange}
              error={formErrors.sku}
              required
              placeholder="Enter SKU"
            />
            
            <FormField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleFormChange}
              error={formErrors.price}
              required
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            
            <FormField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              error={formErrors.category}
              required
              placeholder="Enter category"
            />
          </div>
          
          <FormField
            type="textarea"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            placeholder="Enter product description (optional)"
          />
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formLoading}
              icon="Save"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}

export default Products