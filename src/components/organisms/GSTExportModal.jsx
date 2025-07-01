import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Modal from '@/components/atoms/Modal'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import invoiceService from '@/services/api/invoiceService'

const GSTExportModal = ({ isOpen, onClose, invoices = [] }) => {
  const [formData, setFormData] = useState({
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    format: 'excel',
    status: 'all'
  })
  const [isExporting, setIsExporting] = useState(false)

  const formatOptions = [
    { value: 'excel', label: 'Excel (XLSX) - Recommended' },
    { value: 'csv', label: 'CSV Format' },
    { value: 'json', label: 'JSON Format' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Invoices' },
    { value: 'paid', label: 'Paid Only' },
    { value: 'sent', label: 'Sent Only' },
    { value: 'draft', label: 'Draft Only' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateDateRange = () => {
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    
    if (start > end) {
      toast.error('Start date cannot be after end date')
      return false
    }
    
    if (start > new Date()) {
      toast.error('Start date cannot be in the future')
      return false
    }

    return true
  }

  const getFilteredInvoicesCount = () => {
    let filtered = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.createdAt)
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      
      if (invoiceDate < start || invoiceDate > end) return false
      if (formData.status !== 'all' && invoice.status !== formData.status) return false
      
      return true
    })
    
    return filtered.length
  }

  const handleExport = async () => {
    if (!validateDateRange()) return

    const filteredCount = getFilteredInvoicesCount()
    if (filteredCount === 0) {
      toast.warning('No invoices found for the selected criteria')
      return
    }

    setIsExporting(true)
    
    try {
      let result
      const filters = { ...formData }
      
      switch (formData.format) {
        case 'excel':
          result = await invoiceService.exportToExcel(filters)
          break
        case 'csv':
          result = await invoiceService.exportToCSV(filters)
          break
        case 'json':
          result = await invoiceService.exportToJSON(filters)
          break
        default:
          throw new Error('Invalid format selected')
      }

      // Create download link
      const blob = new Blob([result.data], { type: result.mimeType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = result.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(`GST report exported successfully (${filteredCount} invoices)`)
      onClose()
      
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export GST report. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const modalContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b border-secondary-200 pb-4">
        <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-3">
          <ApperIcon name="Download" size={24} className="text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          Export GST Report
        </h3>
        <p className="text-secondary-600 text-sm">
          Generate GST-ready reports for GSTR-1/GSTR-3B compliance
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Start Date" required>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              max={formData.endDate}
            />
          </FormField>
          
          <FormField label="End Date" required>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              min={formData.startDate}
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </FormField>
        </div>

        {/* Export Format */}
        <FormField label="Export Format" required>
          <Select
            value={formData.format}
            onChange={(e) => handleInputChange('format', e.target.value)}
            options={formatOptions}
          />
        </FormField>

        {/* Status Filter */}
        <FormField label="Invoice Status">
          <Select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            options={statusOptions}
          />
        </FormField>

        {/* Preview Info */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ApperIcon name="Info" size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-primary-900 mb-1">Export Preview</p>
              <p className="text-primary-700">
                {getFilteredInvoicesCount()} invoices will be exported
                {formData.format === 'excel' && ' with separate tabs for B2B, B2C, and CDNR transactions'}
              </p>
            </div>
          </div>
        </div>

        {/* GST Compliance Info */}
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ApperIcon name="Shield" size={18} className="text-secondary-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-secondary-900 mb-1">GST Compliance</p>
              <ul className="text-secondary-700 space-y-1">
                <li>• Includes GSTIN validation and HSN codes</li>
                <li>• Categorizes B2B, B2C, and CDNR transactions</li>
                <li>• Provides taxable value, CGST, SGST, and IGST details</li>
                <li>• Ready for GSTR-1 and GSTR-3B filing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-secondary-200">
        <Button
          variant="secondary"
          onClick={onClose}
          className="flex-1 sm:flex-none"
          disabled={isExporting}
        >
          Cancel
        </Button>
        
        <Button
          variant="primary"
          icon={isExporting ? "Loader2" : "Download"}
          onClick={handleExport}
          disabled={isExporting || getFilteredInvoicesCount() === 0}
          className="flex-1 sm:flex-none"
        >
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </div>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      {modalContent}
    </Modal>
  )
}

export default GSTExportModal