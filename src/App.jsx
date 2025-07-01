import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Invoices from '@/components/pages/Invoices'
import InvoiceCreate from '@/components/pages/InvoiceCreate'
import InvoiceView from '@/components/pages/InvoiceView'
import Clients from '@/components/pages/Clients'
import Products from '@/components/pages/Products'
import Settings from '@/components/pages/Settings'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/create" element={<InvoiceCreate />} />
            <Route path="invoices/:id" element={<InvoiceView />} />
            <Route path="clients" element={<Clients />} />
            <Route path="products" element={<Products />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            fontFamily: 'Inter, sans-serif',
          }}
        />
      </div>
    </Router>
  )
}

export default App