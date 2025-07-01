import * as XLSX from 'xlsx'
import { format } from 'date-fns'

class GSTExportService {
  constructor() {
    this.gstRates = {
      0: { cgst: 0, sgst: 0, igst: 0 },
      5: { cgst: 2.5, sgst: 2.5, igst: 5 },
      12: { cgst: 6, sgst: 6, igst: 12 },
      18: { cgst: 9, sgst: 9, igst: 18 },
      28: { cgst: 14, sgst: 14, igst: 28 }
    }
    
    this.mockGSTData = {
      1: { gstin: '27ABCDE1234F1Z5', hsnCode: '998314', placeOfSupply: 'Maharashtra' },
      2: { gstin: '19FGHIJ5678K2Y4', hsnCode: '998313', placeOfSupply: 'West Bengal' },
      3: { gstin: '32KLMNO9012L3X6', hsnCode: '998312', placeOfSupply: 'Kerala' },
      4: { gstin: '06PQRST3456M4W7', hsnCode: '998315', placeOfSupply: 'Haryana' },
      5: { gstin: '23UVWXY7890N5V8', hsnCode: '998316', placeOfSupply: 'Madhya Pradesh' }
    }
  }

validateGSTIN(gstin) {
    if (!gstin || typeof gstin !== 'string') return false
    
    // Remove spaces and convert to uppercase
    const cleanGSTIN = gstin.replace(/\s/g, '').toUpperCase()
    
    // GSTIN format: 2 digits (state) + 10 alphanumeric + 1 digit + 1 letter + 1 alphanumeric
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/
    
    if (!gstinRegex.test(cleanGSTIN)) return false
    
    // Additional validation: Check state code (01-37)
    const stateCode = parseInt(cleanGSTIN.substring(0, 2))
    return stateCode >= 1 && stateCode <= 37
  }

  calculateGSTBreakdown(taxAmount, taxRate, isInterState = false) {
    const rates = this.gstRates[taxRate] || this.gstRates[18]
    
    if (isInterState) {
      return {
        cgst: 0,
        sgst: 0,
        igst: taxAmount,
        rate: rates.igst
      }
    } else {
      return {
        cgst: taxAmount / 2,
        sgst: taxAmount / 2,
        igst: 0,
        rate: rates.cgst + rates.sgst
      }
    }
  }

prepareGSTData(invoices) {
    return invoices.map(invoice => {
      const gstInfo = this.mockGSTData[invoice.clientId] || this.mockGSTData[1]
      const isInterState = this.isInterStateTransaction(gstInfo.placeOfSupply)
      const gstBreakdown = this.calculateGSTBreakdown(invoice.taxAmount, invoice.tax, isInterState)
      
      // Validate GSTIN and handle invalid cases
      const isValidGSTIN = this.validateGSTIN(gstInfo.gstin)
      
      return {
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: format(new Date(invoice.createdAt), 'dd/MM/yyyy'),
        clientName: invoice.clientName,
        clientGSTIN: isValidGSTIN ? gstInfo.gstin : 'INVALID_GSTIN',
        hsnCode: gstInfo.hsnCode,
        taxableValue: parseFloat(invoice.subtotal.toFixed(2)),
        cgst: parseFloat(gstBreakdown.cgst.toFixed(2)),
        sgst: parseFloat(gstBreakdown.sgst.toFixed(2)),
        igst: parseFloat(gstBreakdown.igst.toFixed(2)),
        totalTax: parseFloat(invoice.taxAmount.toFixed(2)),
        invoiceValue: parseFloat(invoice.total.toFixed(2)),
        placeOfSupply: gstInfo.placeOfSupply,
        transactionType: this.categorizeTransaction(invoice, gstInfo),
        status: invoice.status,
        dueDate: format(new Date(invoice.dueDate), 'dd/MM/yyyy'),
        gstinValid: isValidGSTIN,
        taxRate: invoice.tax || 18,
        originalInvoice: invoice
      }
    })
  }

  isInterStateTransaction(placeOfSupply) {
    // For demo purposes, consider Maharashtra as home state
    // In real implementation, this should be configurable
    return placeOfSupply !== 'Maharashtra'
  }

  categorizeTransaction(invoice, gstInfo) {
    // B2B: Business to Business (with valid GSTIN)
    if (this.validateGSTIN(gstInfo.gstin)) {
      return 'B2B'
    }
    
    // B2C: Business to Consumer (no GSTIN or invalid GSTIN)
    if (invoice.total < 250000) { // Threshold for B2C reporting
      return 'B2C'
    }
    
    // CDNR: Credit/Debit Note (for demo, treating high-value B2C as CDNR)
    return 'CDNR'
  }

generateExcelExport(gstData, filters) {
    const workbook = XLSX.utils.book_new()
    
    // Separate data by transaction type for GSTN compliance
    const b2bData = gstData.filter(item => item.transactionType === 'B2B')
    const b2cData = gstData.filter(item => item.transactionType === 'B2C')
    const cdnrData = gstData.filter(item => item.transactionType === 'CDNR')
    
    // Create Summary Sheet first (as per GSTN best practices)
    const summarySheet = this.createSummarySheet(gstData, filters)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
    
    // B2B Sheet (Primary for GSTR-1)
    if (b2bData.length > 0) {
      const b2bSheet = this.createB2BSheet(b2bData)
      XLSX.utils.book_append_sheet(workbook, b2bSheet, 'B2B_Transactions')
    }
    
    // B2C Sheet
    if (b2cData.length > 0) {
      const b2cSheet = this.createB2CSheet(b2cData)
      XLSX.utils.book_append_sheet(workbook, b2cSheet, 'B2C_Transactions')
    }
    
    // CDNR Sheet (Credit/Debit Notes)
    if (cdnrData.length > 0) {
      const cdnrSheet = this.createCDNRSheet(cdnrData)
      XLSX.utils.book_append_sheet(workbook, cdnrSheet, 'CDNR_Transactions')
    }
    
    // Add validation sheet for GSTIN errors
    const invalidGSTINData = gstData.filter(item => !item.gstinValid)
    if (invalidGSTINData.length > 0) {
      const validationSheet = this.createValidationSheet(invalidGSTINData)
      XLSX.utils.book_append_sheet(workbook, validationSheet, 'Validation_Errors')
    }
    
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array',
      compression: true
    })
    
    const periodLabel = filters.periodFilter !== 'custom' ? `_${filters.periodFilter}` : ''
    const filename = `GSTN_Report${periodLabel}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
    
    return {
      data: excelBuffer,
      filename,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  }

  createValidationSheet(invalidData) {
    const headers = [
      'Invoice Number',
      'Client Name',
      'Invalid GSTIN',
      'Issue',
      'Invoice Value',
      'Recommendation'
    ]
    
    const rows = invalidData.map(item => [
      item.invoiceNumber,
      item.clientName,
      item.clientGSTIN,
      'Invalid GSTIN Format',
      item.invoiceValue,
      'Update client GSTIN or treat as B2C transaction'
    ])
    
    return XLSX.utils.aoa_to_sheet([headers, ...rows])
  }

  createB2BSheet(b2bData) {
    const headers = [
      'Invoice Number',
      'Invoice Date',
      'Customer Name',
      'Customer GSTIN',
      'HSN Code',
      'Taxable Value',
      'CGST Amount',
      'SGST Amount',
      'IGST Amount',
      'Total Tax',
      'Invoice Value',
      'Place of Supply'
    ]
    
    const rows = b2bData.map(item => [
      item.invoiceNumber,
      item.invoiceDate,
      item.clientName,
      item.clientGSTIN,
      item.hsnCode,
      item.taxableValue,
      item.cgst,
      item.sgst,
      item.igst,
      item.totalTax,
      item.invoiceValue,
      item.placeOfSupply
    ])
    
    return XLSX.utils.aoa_to_sheet([headers, ...rows])
  }

  createB2CSheet(b2cData) {
    const headers = [
      'Invoice Number',
      'Invoice Date',
      'Customer Name',
      'HSN Code',
      'Taxable Value',
      'Tax Rate',
      'Tax Amount',
      'Invoice Value',
      'Place of Supply'
    ]
    
    const rows = b2cData.map(item => [
      item.invoiceNumber,
      item.invoiceDate,
      item.clientName,
      item.hsnCode,
      item.taxableValue,
      `${item.cgst > 0 ? (item.cgst + item.sgst) : item.igst}%`,
      item.totalTax,
      item.invoiceValue,
      item.placeOfSupply
    ])
    
    return XLSX.utils.aoa_to_sheet([headers, ...rows])
  }

  createCDNRSheet(cdnrData) {
    const headers = [
      'Invoice Number',
      'Invoice Date',
      'Customer Name',
      'Customer GSTIN',
      'HSN Code',
      'Taxable Value',
      'Tax Amount',
      'Invoice Value',
      'Place of Supply',
      'Reason'
    ]
    
    const rows = cdnrData.map(item => [
      item.invoiceNumber,
      item.invoiceDate,
      item.clientName,
      item.clientGSTIN || 'N/A',
      item.hsnCode,
      item.taxableValue,
      item.totalTax,
      item.invoiceValue,
      item.placeOfSupply,
      'High Value B2C Transaction'
    ])
    
    return XLSX.utils.aoa_to_sheet([headers, ...rows])
  }

  createSummarySheet(gstData, filters) {
    const summary = {
      totalInvoices: gstData.length,
      totalTaxableValue: gstData.reduce((sum, item) => sum + item.taxableValue, 0),
      totalTaxAmount: gstData.reduce((sum, item) => sum + item.totalTax, 0),
      totalInvoiceValue: gstData.reduce((sum, item) => sum + item.invoiceValue, 0),
      b2bCount: gstData.filter(item => item.transactionType === 'B2B').length,
      b2cCount: gstData.filter(item => item.transactionType === 'B2C').length,
      cdnrCount: gstData.filter(item => item.transactionType === 'CDNR').length
    }
    
    const summaryData = [
      ['GST Report Summary'],
      ['Generated on:', format(new Date(), 'dd/MM/yyyy HH:mm:ss')],
      ['Period:', `${filters.startDate} to ${filters.endDate}`],
      [''],
      ['Metric', 'Value'],
      ['Total Invoices', summary.totalInvoices],
      ['Total Taxable Value', summary.totalTaxableValue],
      ['Total Tax Amount', summary.totalTaxAmount],
      ['Total Invoice Value', summary.totalInvoiceValue],
      [''],
      ['Transaction Breakdown'],
      ['B2B Transactions', summary.b2bCount],
      ['B2C Transactions', summary.b2cCount],
      ['CDNR Transactions', summary.cdnrCount]
    ]
    
    return XLSX.utils.aoa_to_sheet(summaryData)
  }

  generateCSVExport(gstData, filters) {
    const headers = [
      'Invoice Number',
      'Invoice Date',
      'Customer Name',
      'Customer GSTIN',
      'HSN Code',
      'Taxable Value',
      'CGST Amount',
      'SGST Amount',
      'IGST Amount',
      'Total Tax',
      'Invoice Value',
      'Place of Supply',
      'Transaction Type'
    ]
    
    const rows = gstData.map(item => [
      item.invoiceNumber,
      item.invoiceDate,
      item.clientName,
      item.clientGSTIN,
      item.hsnCode,
      item.taxableValue,
      item.cgst,
      item.sgst,
      item.igst,
      item.totalTax,
      item.invoiceValue,
      item.placeOfSupply,
      item.transactionType
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    const filename = `GST_Report_${format(new Date(), 'yyyy-MM-dd')}.csv`
    
    return {
      data: csvContent,
      filename,
      mimeType: 'text/csv'
    }
  }

  generateJSONExport(gstData, filters) {
    const exportData = {
      metadata: {
        generatedOn: new Date().toISOString(),
        period: {
          startDate: filters.startDate,
          endDate: filters.endDate
        },
        totalRecords: gstData.length,
        format: 'GST_EXPORT_JSON_V1.0'
      },
      summary: {
        totalTaxableValue: gstData.reduce((sum, item) => sum + item.taxableValue, 0),
        totalTaxAmount: gstData.reduce((sum, item) => sum + item.totalTax, 0),
        totalInvoiceValue: gstData.reduce((sum, item) => sum + item.invoiceValue, 0),
        transactionBreakdown: {
          B2B: gstData.filter(item => item.transactionType === 'B2B').length,
          B2C: gstData.filter(item => item.transactionType === 'B2C').length,
          CDNR: gstData.filter(item => item.transactionType === 'CDNR').length
        }
      },
      transactions: gstData
    }
    
    const filename = `GST_Report_${format(new Date(), 'yyyy-MM-dd')}.json`
    
    return {
      data: JSON.stringify(exportData, null, 2),
      filename,
      mimeType: 'application/json'
    }
  }
}

export default new GSTExportService()