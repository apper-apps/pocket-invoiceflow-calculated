import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Header = ({ onMenuClick }) => {
  return (
    <motion.header
      className="bg-white border-b border-secondary-200 h-16 flex items-center justify-between px-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-secondary-600 hover:text-secondary-900 transition-colors duration-200"
        >
          <ApperIcon name="Menu" size={24} />
        </button>
        
        <div className="hidden sm:block">
          <h2 className="text-lg font-semibold text-secondary-900">
            Good morning, John!
          </h2>
          <p className="text-sm text-secondary-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Quick Create */}
        <Button
          variant="primary"
          size="sm"
          icon="Plus"
          className="hidden sm:inline-flex"
        >
          New Invoice
        </Button>
        
        {/* Notifications */}
        <button className="relative p-2 text-secondary-600 hover:text-secondary-900 transition-colors duration-200">
          <ApperIcon name="Bell" size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
        </button>
        
        {/* Profile */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-secondary-900">John Doe</p>
            <p className="text-xs text-secondary-500">john@company.com</p>
          </div>
          
          <button className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header