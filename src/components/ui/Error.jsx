import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ 
  message = 'Something went wrong. Please try again.', 
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-error-100 to-error-200 p-4 rounded-full mb-6">
        <ApperIcon name="AlertTriangle" size={32} className="text-error-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-secondary-600 mb-6 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          icon="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default Error