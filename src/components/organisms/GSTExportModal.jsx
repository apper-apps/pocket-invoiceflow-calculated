import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Error from "@/components/ui/Error";
import invoiceService from "@/services/api/invoiceService";

const GSTExportModal = ({ isOpen, onClose, invoices = [] }) => {
  const [formData, setFormData] = useState({
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    format: 'excel',
    status: 'all',
    periodFilter: 'custom'
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
  ];

  const quarterOptions = [
    { value: 'q1', label: 'Q1 (Jan-Mar)', months: [0, 1, 2] },
    { value: 'q2', label: 'Q2 (Apr-Jun)', months: [3, 4, 5] },
    { value: 'q3', label: 'Q3 (Jul-Sep)', months: [6, 7, 8] },
    { value: 'q4', label: 'Q4 (Oct-Dec)', months: [9, 10, 11] }
  ]

  const monthOptions = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleQuarterSelect = (quarter) => {
    const currentYear = new Date().getFullYear()
    const quarterData = quarterOptions.find(q => q.value === quarter)
    
    if (quarterData) {
      const startMonth = quarterData.months[0]
      const endMonth = quarterData.months[2]
      
      const startDate = new Date(currentYear, startMonth, 1)
      const endDate = new Date(currentYear, endMonth + 1, 0) // Last day of end month
      
      setFormData(prev => ({
        ...prev,
        periodFilter: quarter,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd')
      }))
    }
  }

  const handleMonthSelect = (month) => {
    const currentYear = new Date().getFullYear()
    const monthIndex = parseInt(month)
    
    const startDate = new Date(currentYear, monthIndex, 1)
    const endDate = new Date(currentYear, monthIndex + 1, 0) // Last day of month
    
    setFormData(prev => ({
      ...prev,
      periodFilter: `month-${month}`,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    }))
  }

  const handleDateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      periodFilter: 'custom' // Reset to custom when manually changing dates
    }))
  }

  const getPeriodLabel = () => {
    if (formData.periodFilter.startsWith('q')) {
      const quarter = quarterOptions.find(q => q.value === formData.periodFilter)
      return quarter ? quarter.label : 'Custom Period'
    } else if (formData.periodFilter.startsWith('month-')) {
      const monthIndex = formData.periodFilter.split('-')[1]
      const month = monthOptions.find(m => m.value === monthIndex)
      return month ? month.label : 'Custom Period'
    }
    return 'Custom Period'
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
        {/* Period Selection */}
        <div className="space-y-3">
          <FormField label="Quick Period Selection">
            <div className="space-y-3">
              {/* Quarter Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quarterOptions.map((quarter) => (
                  <button
                    key={quarter.value}
                    type="button"
                    onClick={() => handleQuarterSelect(quarter.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      formData.periodFilter === quarter.value
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-secondary-700 border-secondary-300 hover:bg-secondary-50'
                    }`}
                  >
                    {quarter.label.split(' ')[0]}
                  </button>
                ))}
              </div>
              
              {/* Month Selection */}
              <div className="w-full">
                <Select
                  value={formData.periodFilter.startsWith('month-') ? formData.periodFilter.split('-')[1] : ''}
                  onChange={(e) => e.target.value ? handleMonthSelect(e.target.value) : null}
                  options={[
                    { value: '', label: 'Select a month...' },
                    ...monthOptions
                  ]}
                  placeholder="Or select a specific month"
                />
              </div>
            </div>
          </FormField>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Start Date" required>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              max={formData.endDate}
            />
          </FormField>
          
          <FormField label="End Date" required>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
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
                {getFilteredInvoicesCount()} invoices will be exported for <strong>{getPeriodLabel()}</strong>
                {formData.format === 'excel' && ' with separate tabs for B2B, B2C, and CDNR transactions'}
              </p>
              {formData.periodFilter !== 'custom' && (
                <p className="text-primary-600 mt-1 text-xs">
                  📊 Perfect for quarterly GST filing - {formData.periodFilter.startsWith('q') ? 'Quarter' : 'Month'} selected
                </p>
              )}
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