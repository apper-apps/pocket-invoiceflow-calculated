import React, { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label,
  options = [],
  error,
  placeholder = 'Select an option',
  className = '',
  required = false,
  ...props 
}, ref) => {
  const selectClasses = `form-select ${error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''} ${className}`
  
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" size={18} className="text-secondary-400" />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-error-600 mt-1 flex items-center">
          <ApperIcon name="AlertCircle" size={16} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select