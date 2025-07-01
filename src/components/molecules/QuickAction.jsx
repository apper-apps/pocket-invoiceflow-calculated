import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const QuickAction = ({ 
  title, 
  description, 
  icon, 
  to, 
  onClick, 
  color = 'primary',
  className = '' 
}) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (to) {
      navigate(to)
    }
  }
  
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700',
    success: 'from-success-500 to-success-600 hover:from-success-600 hover:to-success-700',
    warning: 'from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700',
    error: 'from-error-500 to-error-600 hover:from-error-600 hover:to-error-700'
  }
  
  return (
    <motion.div
      className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-xl text-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-white/80 text-sm">{description}</p>
        </div>
        
        {icon && (
          <div className="bg-white/20 p-3 rounded-lg">
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default QuickAction