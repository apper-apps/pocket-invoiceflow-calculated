class ProductService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'product';
  }
  
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku" } },
          { field: { Name: "price" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
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
      const transformedData = response.data.map(product => ({
        Id: product.Id,
        name: product.Name,
        sku: product.sku,
        price: parseFloat(product.price),
        description: product.description,
        category: product.category,
        createdAt: product.created_at
      }));
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
  
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku" } },
          { field: { Name: "price" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Product not found');
      }
      
      // Transform data to match UI expectations
      const product = response.data;
      return {
        Id: product.Id,
        name: product.Name,
        sku: product.sku,
        price: parseFloat(product.price),
        description: product.description,
        category: product.category,
        createdAt: product.created_at
      };
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }
  
  async create(productData) {
    try {
      const params = {
        records: [{
          Name: productData.name,
          sku: productData.sku,
          price: parseFloat(productData.price),
          description: productData.description,
          category: productData.category,
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
          throw new Error('Failed to create product');
        }
        
        if (successfulRecords.length > 0) {
          const newProduct = successfulRecords[0].data;
          return {
            Id: newProduct.Id,
            name: newProduct.Name,
            sku: newProduct.sku,
            price: parseFloat(newProduct.price),
            description: newProduct.description,
            category: newProduct.category,
            createdAt: newProduct.created_at
          };
        }
      }
      
      throw new Error('Failed to create product');
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
  
  async update(id, productData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: productData.name,
          sku: productData.sku,
          price: parseFloat(productData.price),
          description: productData.description,
          category: productData.category
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
          throw new Error('Failed to update product');
        }
        
        if (successfulUpdates.length > 0) {
          const updatedProduct = successfulUpdates[0].data;
          return {
            Id: updatedProduct.Id,
            name: updatedProduct.Name,
            sku: updatedProduct.sku,
            price: parseFloat(updatedProduct.price),
            description: updatedProduct.description,
            category: updatedProduct.category,
            createdAt: updatedProduct.created_at
          };
        }
      }
      
      throw new Error('Failed to update product');
    } catch (error) {
      console.error('Error updating product:', error);
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
          throw new Error('Failed to delete product');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export default new ProductService()