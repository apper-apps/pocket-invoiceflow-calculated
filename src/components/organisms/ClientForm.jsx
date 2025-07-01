import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'

const ClientForm = ({ client, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    gstin: ''
  })
  
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        address: {
          street: client.address?.street || '',
          city: client.address?.city || '',
          state: client.address?.state || '',
          zipCode: client.address?.zipCode || '',
          country: client.address?.country || 'India'
        },
        gstin: client.gstin || ''
      })
    }
  }, [client])
  
  const handleChange = (value, field) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    onSubmit(formData)
  }
  
  const stateOptions = [
    { value: 'AN', label: 'Andaman and Nicobar Islands' },
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CH', label: 'Chandigarh' },
    { value: 'CT', label: 'Chhattisgarh' },
    { value: 'DN', label: 'Dadra and Nagar Haveli' },
    { value: 'DD', label: 'Daman and Diu' },
    { value: 'DL', label: 'Delhi' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JK', label: 'Jammu and Kashmir' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'LD', label: 'Lakshadweep' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PY', label: 'Puducherry' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TG', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UT', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' }
  ]
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Client Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Enter client name"
        />
        
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="Enter email address"
        />
        
        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
          placeholder="Enter phone number"
        />
        
        <FormField
          label="Company Name"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Enter company name (optional)"
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-secondary-900">Address Information</h3>
        
        <FormField
          label="Street Address"
          name="address.street"
          value={formData.address.street}
          onChange={handleChange}
          placeholder="Enter street address"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="City"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
          
          <FormField
            type="select"
            label="State"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            options={stateOptions}
            placeholder="Select state"
          />
          
          <FormField
            label="ZIP Code"
            name="address.zipCode"
            value={formData.address.zipCode}
            onChange={handleChange}
            placeholder="Enter ZIP code"
          />
        </div>
      </div>
      
      <FormField
        label="GSTIN"
        name="gstin"
        value={formData.gstin}
        onChange={handleChange}
        placeholder="Enter GSTIN (optional)"
      />
      
      <div className="flex items-center justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon="Save"
        >
          {client ? 'Update Client' : 'Add Client'}
        </Button>
      </div>
    </form>
  )
}

export default ClientForm