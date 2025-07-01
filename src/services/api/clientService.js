class ClientService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'client';
  }
  
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "address_street" } },
          { field: { Name: "address_city" } },
          { field: { Name: "address_state" } },
          { field: { Name: "address_zip_code" } },
          { field: { Name: "address_country" } },
          { field: { Name: "gstin" } },
          { field: { Name: "created_at" } }
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
      const transformedData = response.data.map(client => ({
        Id: client.Id,
        name: client.Name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        address: {
          street: client.address_street,
          city: client.address_city,
          state: client.address_state,
          zipCode: client.address_zip_code,
          country: client.address_country
        },
        gstin: client.gstin,
        createdAt: client.created_at
      }));
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }
  
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "address_street" } },
          { field: { Name: "address_city" } },
          { field: { Name: "address_state" } },
          { field: { Name: "address_zip_code" } },
          { field: { Name: "address_country" } },
          { field: { Name: "gstin" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Client not found');
      }
      
      // Transform data to match UI expectations
      const client = response.data;
      return {
        Id: client.Id,
        name: client.Name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        address: {
          street: client.address_street,
          city: client.address_city,
          state: client.address_state,
          zipCode: client.address_zip_code,
          country: client.address_country
        },
        gstin: client.gstin,
        createdAt: client.created_at
      };
    } catch (error) {
      console.error(`Error fetching client with ID ${id}:`, error);
      throw error;
    }
  }
  
  async create(clientData) {
    try {
      const params = {
        records: [{
          Name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          company: clientData.company,
          address_street: clientData.address?.street || '',
          address_city: clientData.address?.city || '',
          address_state: clientData.address?.state || '',
          address_zip_code: clientData.address?.zipCode || '',
          address_country: clientData.address?.country || '',
          gstin: clientData.gstin || '',
          created_at: new Date().toISOString()
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
          throw new Error('Failed to create client');
        }
        
        if (successfulRecords.length > 0) {
          const newClient = successfulRecords[0].data;
          return {
            Id: newClient.Id,
            name: newClient.Name,
            email: newClient.email,
            phone: newClient.phone,
            company: newClient.company,
            address: {
              street: newClient.address_street,
              city: newClient.address_city,
              state: newClient.address_state,
              zipCode: newClient.address_zip_code,
              country: newClient.address_country
            },
            gstin: newClient.gstin,
            createdAt: newClient.created_at
          };
        }
      }
      
      throw new Error('Failed to create client');
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }
  
  async update(id, clientData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          company: clientData.company,
          address_street: clientData.address?.street || '',
          address_city: clientData.address?.city || '',
          address_state: clientData.address?.state || '',
          address_zip_code: clientData.address?.zipCode || '',
          address_country: clientData.address?.country || '',
          gstin: clientData.gstin || ''
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
          throw new Error('Failed to update client');
        }
        
        if (successfulUpdates.length > 0) {
          const updatedClient = successfulUpdates[0].data;
          return {
            Id: updatedClient.Id,
            name: updatedClient.Name,
            email: updatedClient.email,
            phone: updatedClient.phone,
            company: updatedClient.company,
            address: {
              street: updatedClient.address_street,
              city: updatedClient.address_city,
              state: updatedClient.address_state,
              zipCode: updatedClient.address_zip_code,
              country: updatedClient.address_country
            },
            gstin: updatedClient.gstin,
            createdAt: updatedClient.created_at
          };
        }
      }
      
      throw new Error('Failed to update client');
    } catch (error) {
      console.error('Error updating client:', error);
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
          throw new Error('Failed to delete client');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
}

export default new ClientService()