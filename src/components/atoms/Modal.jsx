import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              className={`relative bg-white rounded-xl shadow-2xl w-full ${sizes[size]} ${className}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-secondary-200">
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              )}
              
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal