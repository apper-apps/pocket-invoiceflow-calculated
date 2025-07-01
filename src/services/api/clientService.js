import mockClients from '@/services/mockData/clients.json'

class ClientService {
  constructor() {
    this.data = [...mockClients]
  }
  
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250))
    return [...this.data]
  }
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const client = this.data.find(item => item.Id === id)
    if (!client) {
      throw new Error('Client not found')
    }
    return { ...client }
  }
  
  async create(client) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newClient = {
      ...client,
      Id: Math.max(...this.data.map(item => item.Id), 0) + 1,
      createdAt: new Date().toISOString()
    }
    
    this.data.push(newClient)
    return { ...newClient }
  }
  
  async update(id, client) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Client not found')
    }
    
    this.data[index] = { ...this.data[index], ...client }
    return { ...this.data[index] }
  }
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Client not found')
    }
    
    this.data.splice(index, 1)
    return true
  }
}

export default new ClientService()