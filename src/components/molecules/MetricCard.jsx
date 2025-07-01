import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  currency = false,
  className = '' 
}) => {
  const formatValue = (val) => {
    if (currency) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val)
    }
    return val?.toLocaleString() || '0'
  }
  
  const getTrendColor = () => {
    if (trend === 'up') return 'text-success-600'
    if (trend === 'down') return 'text-error-600'
    return 'text-secondary-500'
  }
  
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp'
    if (trend === 'down') return 'TrendingDown'
    return 'Minus'
  }
  
  return (
    <motion.div
      className={`metric-card ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="metric-label mb-2">{title}</p>
          <p className="metric-value mb-2">{formatValue(value)}</p>
          
          {trend && trendValue && (
            <div className={`flex items-center text-sm ${getTrendColor()}`}>
              <ApperIcon name={getTrendIcon()} size={16} className="mr-1" />
              <span className="font-medium">{trendValue}%</span>
              <span className="text-secondary-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-xl">
            <ApperIcon name={icon} size={24} className="text-primary-600" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MetricCard