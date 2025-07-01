import gstExportService from '@/services/api/gstExportService'

class InvoiceService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'app_invoice';
  }
  
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "invoice_number" } },
          { field: { Name: "client_id" } },
          { field: { Name: "client_name" } },
          { field: { Name: "client_email" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "tax_amount" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "notes" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform data to match UI expectations
      const transformedData = response.data.map(invoice => ({
        Id: invoice.Id,
        invoiceNumber: invoice.invoice_number,
        clientId: invoice.client_id,
        clientName: invoice.client_name,
        clientEmail: invoice.client_email,
        items: typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items,
        subtotal: parseFloat(invoice.subtotal),
        tax: parseFloat(invoice.tax),
        taxAmount: parseFloat(invoice.tax_amount),
        total: parseFloat(invoice.total),
        status: invoice.status,
        dueDate: invoice.due_date,
        createdAt: invoice.created_at,
        notes: invoice.notes
      }));
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }
  
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "invoice_number" } },
          { field: { Name: "client_id" } },
          { field: { Name: "client_name" } },
          { field: { Name: "client_email" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "tax_amount" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "notes" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Invoice not found');
      }
      
      // Transform data to match UI expectations
      const invoice = response.data;
      return {
        Id: invoice.Id,
        invoiceNumber: invoice.invoice_number,
        clientId: invoice.client_id,
        clientName: invoice.client_name,
        clientEmail: invoice.client_email,
        items: typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items,
        subtotal: parseFloat(invoice.subtotal),
        tax: parseFloat(invoice.tax),
        taxAmount: parseFloat(invoice.tax_amount),
        total: parseFloat(invoice.total),
        status: invoice.status,
        dueDate: invoice.due_date,
        createdAt: invoice.created_at,
        notes: invoice.notes
      };
    } catch (error) {
      console.error(`Error fetching invoice with ID ${id}:`, error);
      throw error;
    }
  }
  
  async create(invoiceData) {
    try {
      // Generate invoice number
      const allInvoices = await this.getAll();
      const invoiceNumber = `INV-${String(allInvoices.length + 1).padStart(3, '0')}`;
      
      const params = {
        records: [{
          Name: invoiceData.Name || invoiceNumber,
          invoice_number: invoiceNumber,
          client_id: parseInt(invoiceData.clientId),
          client_name: invoiceData.clientName,
          client_email: invoiceData.clientEmail,
          items: JSON.stringify(invoiceData.items),
          subtotal: parseFloat(invoiceData.subtotal),
          tax: parseFloat(invoiceData.tax),
          tax_amount: parseFloat(invoiceData.taxAmount),
          total: parseFloat(invoiceData.total),
          status: invoiceData.status,
          due_date: new Date(invoiceData.dueDate).toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          notes: invoiceData.notes || ''
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create invoice');
        }
        
        if (successfulRecords.length > 0) {
          const newInvoice = successfulRecords[0].data;
          return {
            Id: newInvoice.Id,
            invoiceNumber: newInvoice.invoice_number,
            clientId: newInvoice.client_id,
            clientName: newInvoice.client_name,
            clientEmail: newInvoice.client_email,
            items: typeof newInvoice.items === 'string' ? JSON.parse(newInvoice.items) : newInvoice.items,
            subtotal: parseFloat(newInvoice.subtotal),
            tax: parseFloat(newInvoice.tax),
            taxAmount: parseFloat(newInvoice.tax_amount),
            total: parseFloat(newInvoice.total),
            status: newInvoice.status,
            dueDate: newInvoice.due_date,
            createdAt: newInvoice.created_at,
            notes: newInvoice.notes
          };
        }
      }
      
      throw new Error('Failed to create invoice');
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }
  
  async update(id, invoiceData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: invoiceData.Name || invoiceData.invoiceNumber,
          client_id: parseInt(invoiceData.clientId),
          client_name: invoiceData.clientName,
          client_email: invoiceData.clientEmail,
          items: JSON.stringify(invoiceData.items),
          subtotal: parseFloat(invoiceData.subtotal),
          tax: parseFloat(invoiceData.tax),
          tax_amount: parseFloat(invoiceData.taxAmount),
          total: parseFloat(invoiceData.total),
          status: invoiceData.status,
          due_date: new Date(invoiceData.dueDate).toISOString().split('T')[0],
          notes: invoiceData.notes || ''
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update invoice');
        }
        
        if (successfulUpdates.length > 0) {
          const updatedInvoice = successfulUpdates[0].data;
          return {
            Id: updatedInvoice.Id,
            invoiceNumber: updatedInvoice.invoice_number,
            clientId: updatedInvoice.client_id,
            clientName: updatedInvoice.client_name,
            clientEmail: updatedInvoice.client_email,
            items: typeof updatedInvoice.items === 'string' ? JSON.parse(updatedInvoice.items) : updatedInvoice.items,
            subtotal: parseFloat(updatedInvoice.subtotal),
            tax: parseFloat(updatedInvoice.tax),
            taxAmount: parseFloat(updatedInvoice.tax_amount),
            total: parseFloat(updatedInvoice.total),
            status: updatedInvoice.status,
            dueDate: updatedInvoice.due_date,
            createdAt: updatedInvoice.created_at,
            notes: updatedInvoice.notes
          };
        }
      }
      
      throw new Error('Failed to update invoice');
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }
  
  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete invoice');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  async generateGSTReport(filters = {}) {
    try {
      let filteredData = await this.getAll();
      
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
    } catch (error) {
      console.error('Error generating GST report:', error);
      throw error;
    }
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