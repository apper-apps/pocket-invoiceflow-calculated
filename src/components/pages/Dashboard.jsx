import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import MetricCard from '@/components/molecules/MetricCard'
import QuickAction from '@/components/molecules/QuickAction'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import StatusBadge from '@/components/molecules/StatusBadge'
import invoiceService from '@/services/api/invoiceService'
import clientService from '@/services/api/clientService'
import { format } from 'date-fns'

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    totalInvoices: 0,
    totalClients: 0
  })
  const [recentInvoices, setRecentInvoices] = useState([])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [invoices, clients] = await Promise.all([
        invoiceService.getAll(),
        clientService.getAll()
      ])
      
      // Calculate metrics
      const totalRevenue = invoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + invoice.total, 0)
      
      const pendingAmount = invoices
        .filter(invoice => ['sent', 'overdue'].includes(invoice.status))
        .reduce((sum, invoice) => sum + invoice.total, 0)
      
      setMetrics({
        totalRevenue,
        pendingAmount,
        totalInvoices: invoices.length,
        totalClients: clients.length
      })
      
      // Get recent invoices (last 5)
      const sortedInvoices = invoices
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
      
      setRecentInvoices(sortedInvoices)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="cards" />
        <Loading type="skeleton" />
      </div>
    )
  }
  
  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
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
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Dashboard</h1>
        <p className="text-secondary-600">
          Here's what's happening with your business today.
        </p>
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          icon="DollarSign"
          currency
          trend="up"
          trendValue={12}
        />
        <MetricCard
          title="Pending Amount"
          value={metrics.pendingAmount}
          icon="Clock"
          currency
          trend="down"
          trendValue={5}
        />
        <MetricCard
          title="Total Invoices"
          value={metrics.totalInvoices}
          icon="FileText"
          trend="up"
          trendValue={8}
        />
        <MetricCard
          title="Total Clients"
          value={metrics.totalClients}
          icon="Users"
          trend="up"
          trendValue={15}
        />
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickAction
          title="Create Invoice"
          description="Generate a new invoice for your client"
          icon="FileText"
          to="/invoices/create"
          color="primary"
        />
        <QuickAction
          title="Add Client"
          description="Add a new client to your database"
          icon="UserPlus"
          to="/clients"
          color="success"
        />
        <QuickAction
          title="Add Product"
          description="Add new products or services"
          icon="Package"
          to="/products"
          color="warning"
        />
        <QuickAction
          title="View Reports"
          description="Analyze your business performance"
          icon="BarChart3"
          to="/reports"
          color="error"
        />
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary-900">Recent Invoices</h2>
            <button
              onClick={() => navigate('/invoices')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => (
                <div
                  key={invoice.Id}
                  className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200 cursor-pointer"
                  onClick={() => navigate(`/invoices/${invoice.Id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-secondary-900">
                        {invoice.invoiceNumber}
                      </span>
                      <StatusBadge status={invoice.status} />
                    </div>
                    <p className="text-sm text-secondary-600 mt-1">
                      {invoice.clientName} • {formatCurrency(invoice.total)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="FileText" size={32} className="text-secondary-400 mx-auto mb-2" />
                <p className="text-secondary-500">No invoices yet</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Activity Feed */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary-900">Recent Activity</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-success-100 p-2 rounded-full">
                <ApperIcon name="CheckCircle" size={16} className="text-success-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-secondary-900">Invoice #INV-001 was paid</p>
                <p className="text-xs text-secondary-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <ApperIcon name="Send" size={16} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-secondary-900">Invoice #INV-002 was sent</p>
                <p className="text-xs text-secondary-500">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-warning-100 p-2 rounded-full">
                <ApperIcon name="UserPlus" size={16} className="text-warning-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-secondary-900">New client "ABC Corp" was added</p>
                <p className="text-xs text-secondary-500">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default Dashboard