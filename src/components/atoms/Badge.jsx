import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-secondary-100 text-secondary-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    draft: 'bg-secondary-100 text-secondary-700',
    sent: 'bg-primary-100 text-primary-700',
    paid: 'bg-success-100 text-success-700',
    overdue: 'bg-error-100 text-error-700',
    cancelled: 'bg-secondary-100 text-secondary-600'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <span className={classes}>
      {icon && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="mr-1" 
        />
      )}
      {children}
    </span>
  )
}

export default Badge