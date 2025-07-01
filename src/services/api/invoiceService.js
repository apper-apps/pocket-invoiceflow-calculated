import mockInvoices from '@/services/mockData/invoices.json'

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
}

export default new InvoiceService()