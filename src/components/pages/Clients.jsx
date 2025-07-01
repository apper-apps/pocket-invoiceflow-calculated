import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import Modal from '@/components/atoms/Modal'
import ClientForm from '@/components/organisms/ClientForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import clientService from '@/services/api/clientService'

const Clients = () => {
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  
  useEffect(() => {
    loadClients()
  }, [])
  
  useEffect(() => {
    // Filter clients based on search term
    if (searchTerm) {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      )
      setFilteredClients(filtered)
    } else {
      setFilteredClients(clients)
    }
  }, [clients, searchTerm])
  
  const loadClients = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await clientService.getAll()
      setClients(data)
      setFilteredClients(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  
  const handleAddClient = () => {
    setEditingClient(null)
    setShowModal(true)
  }
  
  const handleEditClient = (client) => {
    setEditingClient(client)
    setShowModal(true)
  }
  
  const handleDeleteClient = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.delete(id)
        await loadClients()
        toast.success('Client deleted successfully')
      } catch (err) {
        toast.error('Failed to delete client')
      }
    }
  }
  
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true)
      
      if (editingClient) {
        await clientService.update(editingClient.Id, formData)
        toast.success('Client updated successfully')
      } else {
        await clientService.create(formData)
        toast.success('Client added successfully')
      }
      
      setShowModal(false)
      setEditingClient(null)
      await loadClients()
    } catch (err) {
      toast.error('Failed to save client')
    } finally {
      setFormLoading(false)
    }
  }
  
  const handleModalClose = () => {
    setShowModal(false)
    setEditingClient(null)
  }
  
  if (error) {
    return <Error message={error} onRetry={loadClients} />
  }
  
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Clients</h1>
          <p className="text-secondary-600">
            Manage your client database and contact information.
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="UserPlus"
          onClick={handleAddClient}
        >
          Add Client
        </Button>
      </div>
      
      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search clients by name, email, or company..."
        />
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-card border border-secondary-200">
              <div className="space-y-3">
                <div className="w-24 h-4 bg-secondary-200 rounded shimmer"></div>
                <div className="w-32 h-3 bg-secondary-200 rounded shimmer"></div>
                <div className="w-28 h-3 bg-secondary-200 rounded shimmer"></div>
                <div className="w-20 h-8 bg-secondary-200 rounded shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <Empty
          icon="Users"
          title="No clients found"
          description={clients.length === 0 
            ? "Add your first client to start creating invoices and managing your business relationships."
            : "No clients match your search criteria. Try adjusting your search terms."
          }
          actionLabel="Add First Client"
          onAction={handleAddClient}
          showAction={clients.length === 0}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.Id}
              className="bg-white rounded-xl shadow-card border border-secondary-200 hover:shadow-lift transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-full">
                      <ApperIcon name="User" size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">{client.name}</h3>
                      {client.company && (
                        <p className="text-sm text-secondary-600">{client.company}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditClient(client)}
                      className="p-1 text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.Id)}
                      className="p-1 text-secondary-400 hover:text-error-600 transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="Mail" size={14} className="mr-2" />
                    {client.email}
                  </div>
                  
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="Phone" size={14} className="mr-2" />
                    {client.phone}
                  </div>
                  
                  {client.address?.city && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <ApperIcon name="MapPin" size={14} className="mr-2" />
                      {client.address.city}, {client.address.state}
                    </div>
                  )}
                  
                  {client.gstin && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <ApperIcon name="FileText" size={14} className="mr-2" />
                      GSTIN: {client.gstin}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-secondary-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    icon="FileText"
                  >
                    Create Invoice
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        size="lg"
      >
        <ClientForm
          client={editingClient}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          loading={formLoading}
        />
      </Modal>
    </motion.div>
  )
}

export default Clients