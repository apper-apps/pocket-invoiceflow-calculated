import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@company.com',
    company: 'My Company Ltd.',
    phone: '+91 98765 43210',
    address: {
      street: '123 Business Street',
      city: 'Mumbai',
      state: 'MH',
      zipCode: '400001',
      country: 'India'
    },
    gstin: '27AAAAA0000A1Z5'
  })
  
  const [planData] = useState({
    current: 'Free',
    invoicesUsed: 3,
    invoicesLimit: 5,
    clientsUsed: 8,
    clientsLimit: 10,
    features: {
      gst: false,
      inventory: false,
      recurring: false,
      watermark: true,
      branding: false
    }
  })
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'plan', label: 'Plan & Billing', icon: 'Crown' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'integrations', label: 'Integrations', icon: 'Zap' }
  ]
  
  const handleProfileChange = (value, field) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }))
    }
  }
  
  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }
  
  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-secondary-900">Personal Information</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              required
            />
            
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              required
            />
            
            <FormField
              label="Company Name"
              name="company"
              value={profileData.company}
              onChange={handleProfileChange}
            />
            
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={handleProfileChange}
            />
          </div>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-secondary-900">Business Address</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <FormField
              label="Street Address"
              name="address.street"
              value={profileData.address.street}
              onChange={handleProfileChange}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="City"
                name="address.city"
                value={profileData.address.city}
                onChange={handleProfileChange}
              />
              
              <FormField
                label="State"
                name="address.state"
                value={profileData.address.state}
                onChange={handleProfileChange}
              />
              
              <FormField
                label="ZIP Code"
                name="address.zipCode"
                value={profileData.address.zipCode}
                onChange={handleProfileChange}
              />
            </div>
            
            <FormField
              label="GSTIN"
              name="gstin"
              value={profileData.gstin}
              onChange={handleProfileChange}
              placeholder="Enter your GSTIN"
            />
          </div>
        </Card.Body>
      </Card>
      
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSaveProfile}
          loading={loading}
          icon="Save"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
  
  const renderPlanTab = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-secondary-900">Current Plan</h3>
        </Card.Header>
        <Card.Body>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xl font-bold text-secondary-900">{planData.current} Plan</h4>
              <p className="text-secondary-600">Perfect for getting started</p>
            </div>
            <Button variant="primary" icon="Crown">
              Upgrade to Pro
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-secondary-700">Invoices Used</label>
              <div className="mt-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>{planData.invoicesUsed} of {planData.invoicesLimit}</span>
                  <span>{Math.round((planData.invoicesUsed / planData.invoicesLimit) * 100)}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${(planData.invoicesUsed / planData.invoicesLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-secondary-700">Clients</label>
              <div className="mt-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>{planData.clientsUsed} of {planData.clientsLimit}</span>
                  <span>{Math.round((planData.clientsUsed / planData.clientsLimit) * 100)}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-success-600 h-2 rounded-full" 
                    style={{ width: `${(planData.clientsUsed / planData.clientsLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-secondary-900">Free Plan</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <div className="flex items-center">
                <ApperIcon name="Check" size={16} className="text-success-600 mr-2" />
                <span className="text-sm">Up to 5 invoices/month</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Check" size={16} className="text-success-600 mr-2" />
                <span className="text-sm">Up to 10 clients</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="X" size={16} className="text-error-600 mr-2" />
                <span className="text-sm text-secondary-500">GST compliance</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="X" size={16} className="text-error-600 mr-2" />
                <span className="text-sm text-secondary-500">Inventory tracking</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="AlertTriangle" size={16} className="text-warning-600 mr-2" />
                <span className="text-sm">InvoiceFlow watermark</span>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-3xl font-bold text-secondary-900">Free</div>
              <p className="text-secondary-600">Forever</p>
            </div>
          </Card.Body>
        </Card>
        
        <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100">
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">Pro Plan</h3>
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">Recommended</span>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <div className="flex items-center">
                <ApperIcon name="Check" size={16} className="text-success-600 mr-2" />
                <span className="text-sm">Unlimited invoices</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Check" size={16} className="text-success-600 mr-2" />
                <span className="text-sm">Unlimited clients</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Check" size={16} className="text-success-600 mr-2" />
                <span className="text-sm">GST compliance & reports</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Check" size={16} className="text-success-600 mr-2" />
                <span className="text-sm">Inventory tracking</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Check" size={16} className="text-success-600 mr-2" />
                <span className="text-sm">Custom branding</span>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-3xl font-bold text-secondary-900">₹999</div>
              <p className="text-secondary-600">per month</p>
            </div>
            <Button variant="primary" className="w-full mt-4" icon="Crown">
              Upgrade Now
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
  
  const renderNotificationsTab = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold text-secondary-900">Notification Preferences</h3>
      </Card.Header>
      <Card.Body>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-secondary-900">Email Notifications</h4>
              <p className="text-sm text-secondary-600">Receive email alerts for important events</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-secondary-900">Payment Reminders</h4>
              <p className="text-sm text-secondary-600">Automatic reminders for overdue invoices</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-secondary-900">Low Stock Alerts</h4>
              <p className="text-sm text-secondary-600">Get notified when inventory is running low</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-secondary-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
            </button>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
  
  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-secondary-900">Payment Gateways</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ApperIcon name="CreditCard" size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Stripe</h4>
                  <p className="text-sm text-secondary-600">Accept international payments</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Connect</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ApperIcon name="Smartphone" size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Razorpay</h4>
                  <p className="text-sm text-secondary-600">Accept Indian payments (UPI, Cards, etc.)</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Connect</Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-secondary-900">Communication</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <ApperIcon name="Mail" size={20} className="text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Email Service</h4>
                  <p className="text-sm text-secondary-600">Send invoices via email</p>
                </div>
              </div>
              <Button variant="success" size="sm" icon="Check">Connected</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ApperIcon name="MessageSquare" size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">WhatsApp Business</h4>
                  <p className="text-sm text-secondary-600">Send invoices via WhatsApp</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Connect</Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab()
      case 'plan':
        return renderPlanTab()
      case 'notifications':
        return renderNotificationsTab()
      case 'integrations':
        return renderIntegrationsTab()
      default:
        return renderProfileTab()
    }
  }
  
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Settings</h1>
        <p className="text-secondary-600">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-secondary-700 hover:bg-secondary-100'
                }`}
              >
                <ApperIcon name={tab.icon} size={20} className="mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </motion.div>
  )
}

export default Settings