import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import StatusBadge from '@/components/molecules/StatusBadge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import invoiceService from '@/services/api/invoiceService'
import clientService from '@/services/api/clientService'
import { format } from 'date-fns'

const InvoiceView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadInvoice()
  }, [id])
  
  const loadInvoice = async () => {
    try {
      setLoading(true)
      setError('')
      
      const invoiceData = await invoiceService.getById(parseInt(id))
      const clientData = await clientService.getById(invoiceData.clientId)
      
      setInvoice(invoiceData)
      setClient(clientData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleStatusUpdate = async (newStatus) => {
    try {
      await invoiceService.update(invoice.Id, { ...invoice, status: newStatus })
      setInvoice(prev => ({ ...prev, status: newStatus }))
      toast.success(`Invoice marked as ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update invoice status')
    }
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }
  
  if (loading) {
    return <Loading message="Loading invoice..." />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadInvoice} />
  }
  
  if (!invoice || !client) {
    return <Error message="Invoice not found" />
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
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            icon="ArrowLeft"
            onClick={() => navigate('/invoices')}
          >
            Back
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-1">
              {invoice.invoiceNumber}
            </h1>
            <div className="flex items-center space-x-3">
              <StatusBadge status={invoice.status} />
              <span className="text-secondary-500">
                Created {format(new Date(invoice.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {invoice.status === 'draft' && (
            <Button
              variant="primary"
              icon="Send"
              onClick={() => handleStatusUpdate('sent')}
            >
              Send Invoice
            </Button>
          )}
          
          {invoice.status === 'sent' && (
            <Button
              variant="success"
              icon="CheckCircle"
              onClick={() => handleStatusUpdate('paid')}
            >
              Mark as Paid
            </Button>
          )}
          
          <Button
            variant="secondary"
            icon="Edit"
            onClick={() => navigate(`/invoices/create?edit=${invoice.Id}`)}
          >
            Edit
          </Button>
          
          <Button
            variant="secondary"
            icon="Download"
          >
            Download PDF
          </Button>
        </div>
      </div>
      
      {/* Invoice Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-3 rounded-lg">
                    <ApperIcon name="Receipt" size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900">InvoiceFlow Pro</h2>
                    <p className="text-secondary-600">Professional Invoicing</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                  INVOICE
                </h3>
                <p className="text-secondary-600">#{invoice.invoiceNumber}</p>
              </div>
            </div>
            
            {/* Bill To & Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-3">
                  Bill To
                </h4>
                <div className="space-y-1">
                  <p className="font-semibold text-secondary-900">{client.name}</p>
                  {client.company && (
                    <p className="text-secondary-600">{client.company}</p>
                  )}
                  <p className="text-secondary-600">{client.email}</p>
                  <p className="text-secondary-600">{client.phone}</p>
                  {client.address && (
                    <div className="text-secondary-600">
                      {client.address.street && <p>{client.address.street}</p>}
                      <p>
                        {[client.address.city, client.address.state, client.address.zipCode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  )}
                  {client.gstin && (
                    <p className="text-secondary-600">GSTIN: {client.gstin}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-3">
                  Invoice Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Invoice Date:</span>
                    <span className="font-medium">
                      {format(new Date(invoice.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Due Date:</span>
                    <span className="font-medium">
                      {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Status:</span>
                    <StatusBadge status={invoice.status} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Line Items */}
            <div className="mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50 border-b border-secondary-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-700">
                        Description
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-secondary-700">
                        Qty
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-secondary-700">
                        Price
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-secondary-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-secondary-200">
                        <td className="py-4 px-4">
                          <div className="font-medium text-secondary-900">
                            Product {item.productId}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Tax ({invoice.tax || 18}%):</span>
                  <span className="font-medium">{formatCurrency(invoice.taxAmount || 0)}</span>
                </div>
                
                <div className="border-t border-secondary-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-secondary-900">Total:</span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatCurrency(invoice.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            {invoice.notes && (
              <div className="mt-8 pt-8 border-t border-secondary-200">
                <h4 className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-3">
                  Notes
                </h4>
                <p className="text-secondary-600">{invoice.notes}</p>
              </div>
            )}
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-secondary-900">Quick Actions</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <Button variant="primary" className="w-full" icon="Mail">
                  Send via Email
                </Button>
                <Button variant="success" className="w-full" icon="MessageSquare">
                  Send via WhatsApp
                </Button>
                <Button variant="secondary" className="w-full" icon="Copy">
                  Duplicate Invoice
                </Button>
                <Button variant="secondary" className="w-full" icon="Printer">
                  Print Invoice
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          {/* Payment Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-secondary-900">Payment Information</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary-700">Amount Due</label>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(invoice.total)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-secondary-700">Due Date</label>
                  <p className="text-secondary-900">
                    {format(new Date(invoice.dueDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-secondary-700">Days Remaining</label>
                  <p className="text-secondary-900">
                    {Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default InvoiceView