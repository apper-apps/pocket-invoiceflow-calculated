import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import StatusBadge from '@/components/molecules/StatusBadge'
import Button from '@/components/atoms/Button'
import { format } from 'date-fns'

const InvoiceTable = ({ invoices, loading, onEdit, onDelete, onDuplicate }) => {
  const navigate = useNavigate()
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card border border-secondary-200">
        <div className="p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 py-4 border-b border-secondary-200 last:border-b-0">
              <div className="w-20 h-4 bg-secondary-200 rounded shimmer"></div>
              <div className="flex-1 h-4 bg-secondary-200 rounded shimmer"></div>
              <div className="w-24 h-4 bg-secondary-200 rounded shimmer"></div>
              <div className="w-20 h-6 bg-secondary-200 rounded shimmer"></div>
              <div className="w-16 h-4 bg-secondary-200 rounded shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
  return (
    <div className="bg-white rounded-xl shadow-card border border-secondary-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-secondary-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-secondary-700">Invoice #</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-secondary-700">Client</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-secondary-700">Amount</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-secondary-700">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-secondary-700">Due Date</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-secondary-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <motion.tr
                key={invoice.Id}
                className="table-row cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/invoices/${invoice.Id}`)}
              >
                <td className="py-4 px-6">
                  <div className="font-medium text-secondary-900">
                    {invoice.invoiceNumber}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-secondary-900">{invoice.clientName}</div>
                    <div className="text-sm text-secondary-500">{invoice.clientEmail}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-secondary-900">
                    {formatCurrency(invoice.total)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-secondary-700">
                    {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onEdit(invoice)}
                      className="p-1 text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => onDuplicate(invoice)}
                      className="p-1 text-secondary-400 hover:text-success-600 transition-colors duration-200"
                    >
                      <ApperIcon name="Copy" size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(invoice.Id)}
                      className="p-1 text-secondary-400 hover:text-error-600 transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvoiceTable