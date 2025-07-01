import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }
  
  return (
    <div className="flex h-screen bg-secondary-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={handleMenuClick} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout