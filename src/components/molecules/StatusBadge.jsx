import React from 'react'
import Badge from '@/components/atoms/Badge'

const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    draft: { variant: 'draft', icon: 'FileText', label: 'Draft' },
    sent: { variant: 'sent', icon: 'Send', label: 'Sent' },
    paid: { variant: 'paid', icon: 'CheckCircle', label: 'Paid' },
    overdue: { variant: 'overdue', icon: 'AlertCircle', label: 'Overdue' },
    cancelled: { variant: 'cancelled', icon: 'XCircle', label: 'Cancelled' },
    pending: { variant: 'warning', icon: 'Clock', label: 'Pending' },
    partial: { variant: 'warning', icon: 'DollarSign', label: 'Partial' }
  }
  
  const config = statusConfig[status] || statusConfig.draft
  
  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      className={className}
    >
      {config.label}
    </Badge>
  )
}

export default StatusBadge