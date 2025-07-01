import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-sm hover:shadow-md',
    secondary: 'bg-white border border-secondary-300 text-secondary-700 hover:bg-secondary-50 focus:ring-primary-500 shadow-sm hover:shadow-md',
    success: 'bg-gradient-to-r from-success-600 to-success-700 text-white hover:from-success-700 hover:to-success-800 focus:ring-success-500 shadow-sm hover:shadow-md',
    danger: 'bg-gradient-to-r from-error-600 to-error-700 text-white hover:from-error-700 hover:to-error-800 focus:ring-error-500 shadow-sm hover:shadow-md',
    ghost: 'text-secondary-700 hover:bg-secondary-100 focus:ring-primary-500',
    link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  const renderIcon = (position) => {
    if (!icon || iconPosition !== position) return null
    
    return (
      <ApperIcon 
        name={icon} 
        size={iconSizes[size]} 
        className={`${position === 'left' ? 'mr-2' : 'ml-2'} ${loading ? 'opacity-0' : ''}`}
      />
    )
  }
  
  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ApperIcon name="Loader2" size={iconSizes[size]} className="animate-spin" />
        </div>
      )}
      
      <div className={`flex items-center ${loading ? 'opacity-0' : ''}`}>
        {renderIcon('left')}
        {children}
        {renderIcon('right')}
      </div>
    </motion.button>
  )
}

export default Button