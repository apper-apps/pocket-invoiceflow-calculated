import React, { forwardRef } from "react";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({ 
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'text',
  required = false,
  ...props 
}, ref) => {
  const inputClasses = `form-input ${icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : ''} ${error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''} ${className}`
  
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={18} className="text-secondary-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={18} className="text-secondary-400" />
          </div>
        )}
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

Input.displayName = 'Input'

export default Input

Input.displayName = 'Input'
