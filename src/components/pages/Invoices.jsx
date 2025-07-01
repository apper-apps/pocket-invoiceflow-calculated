import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import Select from '@/components/atoms/Select'
import InvoiceTable from '@/components/organisms/InvoiceTable'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import invoiceService from '@/services/api/invoiceService'
import GSTExportModal from '@/components/organisms/GSTExportModal'

const Invoices = () => {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showGSTExport, setShowGSTExport] = useState(false)
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' }
  ]
  
  const loadInvoices = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await invoiceService.getAll()
      setInvoices(data)
      setFilteredInvoices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadInvoices()
  }, [])
  
  useEffect(() => {
    let filtered = invoices
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(invoice => invoice.status === statusFilter)
    }
    
    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, statusFilter])
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  
  const handleStatusFilter = (value) => {
    setStatusFilter(value)
  }
  
  const handleEdit = (invoice) => {
    navigate(`/invoices/create?edit=${invoice.Id}`)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceService.delete(id)
        await loadInvoices()
        toast.success('Invoice deleted successfully')
      } catch (err) {
        toast.error('Failed to delete invoice')
      }
    }
  }
  
  const handleDuplicate = (invoice) => {
    navigate(`/invoices/create?duplicate=${invoice.Id}`)
  }
  
  if (error) {
    return <Error message={error} onRetry={loadInvoices} />
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
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Invoices</h1>
          <p className="text-secondary-600">
            Manage your invoices and track payments.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            icon="Download"
            onClick={() => setShowGSTExport(true)}
            className="order-2 sm:order-1"
          >
            GST Export
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => navigate('/invoices/create')}
            className="order-1 sm:order-2"
          >
            Create Invoice
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by invoice number, client name, or email..."
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            options={statusOptions}
            placeholder="Filter by status"
          />
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <Loading type="table" />
      ) : filteredInvoices.length === 0 ? (
        <Empty
          icon="FileText"
          title="No invoices found"
          description={invoices.length === 0 
            ? "Create your first invoice to get started with billing your clients."
            : "No invoices match your current filters. Try adjusting your search criteria."
          }
          actionLabel="Create First Invoice"
          onAction={() => navigate('/invoices/create')}
          showAction={invoices.length === 0}
        />
) : (
        <InvoiceTable
          invoices={filteredInvoices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      )}

      {/* GST Export Modal */}
      <GSTExportModal
        isOpen={showGSTExport}
        onClose={() => setShowGSTExport(false)}
        invoices={invoices}
      />
    </motion.div>
  )
}

export default Invoices