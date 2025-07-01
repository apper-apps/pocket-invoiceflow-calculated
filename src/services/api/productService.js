import mockProducts from '@/services/mockData/products.json'

class ProductService {
  constructor() {
    this.data = [...mockProducts]
  }
  
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.data]
  }
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const product = this.data.find(item => item.Id === id)
    if (!product) {
      throw new Error('Product not found')
    }
    return { ...product }
  }
  
  async create(product) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newProduct = {
      ...product,
      Id: Math.max(...this.data.map(item => item.Id), 0) + 1,
      createdAt: new Date().toISOString()
    }
    
    this.data.push(newProduct)
    return { ...newProduct }
  }
  
  async update(id, product) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    
    this.data[index] = { ...this.data[index], ...product }
    return { ...this.data[index] }
  }
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    
    this.data.splice(index, 1)
    return true
  }
}

export default new ProductService()