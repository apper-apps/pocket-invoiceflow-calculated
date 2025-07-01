import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import invoiceService from '@/services/api/invoiceService'
import clientService from '@/services/api/clientService'
import productService from '@/services/api/productService'
import { format, addDays } from 'date-fns'

const InvoiceCreate = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const duplicateId = searchParams.get('duplicate')
  
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  
  const [formData, setFormData] = useState({
    clientId: '',
    dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    items: [{ productId: '', quantity: 1, price: 0, total: 0 }],
    subtotal: 0,
    tax: 18,
    taxAmount: 0,
    total: 0,
    notes: ''
  })
  
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    loadData()
  }, [])
  
  useEffect(() => {
    if (editId) {
      loadInvoiceForEdit(editId)
    } else if (duplicateId) {
      loadInvoiceForDuplicate(duplicateId)
    }
  }, [editId, duplicateId])
  
  useEffect(() => {
    calculateTotals()
  }, [formData.items, formData.tax])
  
  const loadData = async () => {
    try {
      const [clientsData, productsData] = await Promise.all([
        clientService.getAll(),
        productService.getAll()
      ])
      setClients(clientsData)
      setProducts(productsData)
    } catch (err) {
      toast.error('Failed to load data')
    }
  }
  
  const loadInvoiceForEdit = async (id) => {
    try {
      const invoice = await invoiceService.getById(parseInt(id))
      setFormData({
        clientId: invoice.clientId,
        dueDate: format(new Date(invoice.dueDate), 'yyyy-MM-dd'),
        items: invoice.items,
        subtotal: invoice.subtotal,
        tax: invoice.tax || 18,
        taxAmount: invoice.taxAmount || 0,
        total: invoice.total,
        notes: invoice.notes || ''
      })
    } catch (err) {
      toast.error('Failed to load invoice')
      navigate('/invoices')
    }
  }
  
  const loadInvoiceForDuplicate = async (id) => {
    try {
      const invoice = await invoiceService.getById(parseInt(id))
      setFormData({
        clientId: invoice.clientId,
        dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        items: invoice.items,
        subtotal: invoice.subtotal,
        tax: invoice.tax || 18,
        taxAmount: invoice.taxAmount || 0,
        total: invoice.total,
        notes: invoice.notes || ''
      })
    } catch (err) {
      toast.error('Failed to load invoice')
      navigate('/invoices')
    }
  }
  
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0)
    const taxAmount = (subtotal * formData.tax) / 100
    const total = subtotal + taxAmount
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }))
  }
  
  const handleChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // If product is selected, auto-fill price
    if (field === 'productId' && value) {
      const product = products.find(p => p.Id === parseInt(value))
      if (product) {
        newItems[index].price = product.price
      }
    }
    
    // Calculate item total
    newItems[index].total = newItems[index].quantity * newItems[index].price
    
    setFormData(prev => ({ ...prev, items: newItems }))
  }
  
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1, price: 0, total: 0 }]
    }))
  }
  
  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, items: newItems }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client'
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Please select a due date'
    }
    
    formData.items.forEach((item, index) => {
      if (!item.productId) {
        newErrors[`item_${index}_product`] = 'Please select a product'
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0'
      }
      if (item.price <= 0) {
        newErrors[`item_${index}_price`] = 'Price must be greater than 0'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (status = 'draft') => {
    if (!validateForm()) {
      return
    }
    
    try {
      setLoading(true)
      
      const client = clients.find(c => c.Id === parseInt(formData.clientId))
      
      const invoiceData = {
        ...formData,
        clientId: parseInt(formData.clientId),
        clientName: client.name,
        clientEmail: client.email,
        status,
        createdAt: new Date().toISOString(),
        dueDate: new Date(formData.dueDate).toISOString()
      }
      
      if (editId) {
        await invoiceService.update(parseInt(editId), invoiceData)
        toast.success('Invoice updated successfully')
      } else {
        await invoiceService.create(invoiceData)
        toast.success('Invoice created successfully')
      }
      
      navigate('/invoices')
    } catch (err) {
      toast.error('Failed to save invoice')
    } finally {
      setLoading(false)
    }
  }
  
  const clientOptions = clients.map(client => ({
    value: client.Id,
    label: `${client.name} (${client.email})`
  }))
  
  const productOptions = products.map(product => ({
    value: product.Id,
    label: `${product.name} - ₹${product.price}`
  }))
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }
  
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            {editId ? 'Edit Invoice' : 'Create New Invoice'}
          </h1>
          <p className="text-secondary-600">
            {editId ? 'Update your invoice details' : 'Generate a professional invoice for your client'}
          </p>
        </div>
        
        <Button
          variant="secondary"
          icon="ArrowLeft"
          onClick={() => navigate('/invoices')}
        >
          Back
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Date */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-secondary-900">Invoice Details</h3>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  type="select"
                  label="Client"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  options={clientOptions}
                  error={errors.clientId}
                  required
                  placeholder="Select a client"
                />
                
                <FormField
                  type="date"
                  label="Due Date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  error={errors.dueDate}
                  required
                />
              </div>
            </Card.Body>
          </Card>
          
          {/* Line Items */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-secondary-900">Line Items</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="Plus"
                  onClick={addItem}
                >
                  Add Item
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-5">
                      <FormField
                        type="select"
                        label="Product/Service"
                        value={item.productId}
                        onChange={(value) => handleItemChange(index, 'productId', value)}
                        options={productOptions}
                        error={errors[`item_${index}_product`]}
                        placeholder="Select product"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <FormField
                        type="number"
                        label="Quantity"
                        value={item.quantity}
                        onChange={(value) => handleItemChange(index, 'quantity', parseFloat(value) || 1)}
                        error={errors[`item_${index}_quantity`]}
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <FormField
                        type="number"
                        label="Price"
                        value={item.price}
                        onChange={(value) => handleItemChange(index, 'price', parseFloat(value) || 0)}
                        error={errors[`item_${index}_price`]}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <div className="form-group">
                        <label className="form-label">Total</label>
                        <div className="font-semibold text-secondary-900 py-3">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-error-600 hover:text-error-700 transition-colors duration-200"
                        >
                          <ApperIcon name="Trash2" size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
          
          {/* Tax & Notes */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-secondary-900">Additional Details</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-6">
                <FormField
                  type="number"
                  label="Tax Rate (%)"
                  name="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                />
                
                <FormField
                  type="textarea"
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes or terms..."
                />
              </div>
            </Card.Body>
          </Card>
        </div>
        
        {/* Summary */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-secondary-900">Invoice Summary</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(formData.subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Tax ({formData.tax}%)</span>
                  <span className="font-medium">{formatCurrency(formData.taxAmount)}</span>
                </div>
                
                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-secondary-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatCurrency(formData.total)}
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          {/* Actions */}
          <Card>
            <Card.Body>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleSubmit('sent')}
                  loading={loading}
                  icon="Send"
                >
                  {editId ? 'Update & Send' : 'Create & Send'}
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleSubmit('draft')}
                  loading={loading}
                  icon="Save"
                >
                  Save as Draft
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default InvoiceCreate