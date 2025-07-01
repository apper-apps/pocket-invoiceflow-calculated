import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/' },
    { icon: 'FileText', label: 'Invoices', path: '/invoices' },
    { icon: 'Users', label: 'Clients', path: '/clients' },
    { icon: 'Package', label: 'Products', path: '/products' },
    { icon: 'Settings', label: 'Settings', path: '/settings' }
  ]
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-secondary-200 z-30 lg:static lg:z-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-lg">
                <ApperIcon name="Receipt" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-900">InvoiceFlow</h1>
                <p className="text-xs text-secondary-500">Pro</p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden text-secondary-400 hover:text-secondary-600"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <ApperIcon name={item.icon} size={20} className="mr-3" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          {/* Plan Status */}
          <div className="p-4 border-t border-secondary-200">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-700">Free Plan</span>
                <ApperIcon name="Crown" size={16} className="text-primary-600" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-primary-600">
                  <span>Invoices</span>
                  <span>3/5</span>
                </div>
                <div className="w-full bg-primary-200 rounded-full h-1.5">
                  <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <button className="w-full mt-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs py-2 px-3 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar