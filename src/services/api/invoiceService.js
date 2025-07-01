import mockInvoices from '@/services/mockData/invoices.json'
import gstExportService from '@/services/api/gstExportService'

class InvoiceService {
  constructor() {
    this.data = [...mockInvoices]
  }
  
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.data]
  }
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const invoice = this.data.find(item => item.Id === id)
    if (!invoice) {
      throw new Error('Invoice not found')
    }
    return { ...invoice }
  }
  
  async create(invoice) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Generate invoice number
    const invoiceNumber = `INV-${String(this.data.length + 1).padStart(3, '0')}`
    
    const newInvoice = {
      ...invoice,
      Id: Math.max(...this.data.map(item => item.Id), 0) + 1,
      invoiceNumber,
      createdAt: new Date().toISOString()
    }
    
    this.data.push(newInvoice)
    return { ...newInvoice }
  }
  
  async update(id, invoice) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Invoice not found')
    }
    
    this.data[index] = { ...this.data[index], ...invoice }
    return { ...this.data[index] }
  }
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Invoice not found')
    }
    
this.data.splice(index, 1)
    return true
  }

  async generateGSTReport(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredData = [...this.data]
    
    // Apply date range filter
    if (filters.startDate) {
      filteredData = filteredData.filter(invoice => 
        new Date(invoice.createdAt) >= new Date(filters.startDate)
      )
    }
    
    if (filters.endDate) {
      filteredData = filteredData.filter(invoice => 
        new Date(invoice.createdAt) <= new Date(filters.endDate)
      )
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filteredData = filteredData.filter(invoice => invoice.status === filters.status)
    }

    return gstExportService.prepareGSTData(filteredData)
  }

async exportToExcel(filters = {}) {
    try {
      const gstData = await this.generateGSTReport(filters)
      if (!gstData || gstData.length === 0) {
        throw new Error('No invoice data found for the selected criteria')
      }
      return gstExportService.generateExcelExport(gstData, filters)
    } catch (error) {
      throw new Error(`Excel export failed: ${error.message}`)
    }
  }

  async exportToCSV(filters = {}) {
    try {
      const gstData = await this.generateGSTReport(filters)
      if (!gstData || gstData.length === 0) {
        throw new Error('No invoice data found for the selected criteria')
      }
      return gstExportService.generateCSVExport(gstData, filters)
    } catch (error) {
      throw new Error(`CSV export failed: ${error.message}`)
    }
  }

  async exportToJSON(filters = {}) {
    try {
      const gstData = await this.generateGSTReport(filters)
      if (!gstData || gstData.length === 0) {
        throw new Error('No invoice data found for the selected criteria')
      }
      return gstExportService.generateJSONExport(gstData, filters)
    } catch (error) {
      throw new Error(`JSON export failed: ${error.message}`)
    }
  }
}
export default new InvoiceService()