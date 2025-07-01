import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Loading = ({ type = 'default', message = 'Loading...' }) => {
  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl shadow-card border border-secondary-200">
        <div className="p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 py-4 border-b border-secondary-200 last:border-b-0">
              <div className="w-20 h-4 bg-secondary-200 rounded shimmer"></div>
              <div className="flex-1 h-4 bg-secondary-200 rounded shimmer"></div>
              <div className="w-24 h-4 bg-secondary-200 rounded shimmer"></div>
              <div className="w-20 h-6 bg-secondary-200 rounded shimmer"></div>
              <div className="w-16 h-4 bg-secondary-200 rounded shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-card border border-secondary-200">
            <div className="space-y-3">
              <div className="w-16 h-4 bg-secondary-200 rounded shimmer"></div>
              <div className="w-24 h-8 bg-secondary-200 rounded shimmer"></div>
              <div className="w-20 h-3 bg-secondary-200 rounded shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (type === 'skeleton') {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-secondary-200 rounded shimmer"></div>
        <div className="space-y-4">
          <div className="h-4 bg-secondary-200 rounded shimmer"></div>
          <div className="h-4 bg-secondary-200 rounded w-3/4 shimmer"></div>
          <div className="h-4 bg-secondary-200 rounded w-1/2 shimmer"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-4 rounded-full mb-4">
        <ApperIcon name="Loader2" size={32} className="text-primary-600 animate-spin" />
      </div>
      <p className="text-secondary-600 font-medium">{message}</p>
    </div>
  )
}

export default Loading