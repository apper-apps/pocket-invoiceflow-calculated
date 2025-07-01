import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  icon = 'FileX', 
  title = 'No data found', 
  description = 'Get started by creating your first item.',
  actionLabel = 'Create New',
  onAction,
  showAction = true 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-secondary-100 to-secondary-200 p-6 rounded-2xl mb-6">
        <ApperIcon name={icon} size={48} className="text-secondary-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">
        {title}
      </h3>
      
      <p className="text-secondary-600 mb-8 max-w-md">
        {description}
      </p>
      
      {showAction && onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          icon="Plus"
          size="lg"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty