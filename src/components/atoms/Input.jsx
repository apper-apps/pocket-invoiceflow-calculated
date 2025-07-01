import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import ApperIcon from "@/components/ApperIcon";


const Input = forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  icon, 
  iconPosition = 'left', 
  required = false, 
  className = '', 
  ...props 
}, ref) => {
  // Safe prop handling with defaults
  const safeLabel = label || ''
  const safeType = type || 'text'
  const safeError = error || ''
  const safeIcon = icon || ''
  const safeIconPosition = iconPosition || 'left'
  const safeRequired = Boolean(required)
  const safeClassName = className || ''

  try {
    const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors'
    const errorClasses = safeError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
    const iconClasses = safeIcon ? (safeIconPosition === 'left' ? 'pl-10' : 'pr-10') : ''
    const inputClasses = `${baseClasses} ${errorClasses} ${iconClasses} ${safeClassName}`

    return (
      <div className="relative">
        {safeLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {safeLabel}
            {safeRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {safeIcon && (
            <div className={`absolute inset-y-0 ${safeIconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
              <ApperIcon name={safeIcon} className="h-5 w-5 text-gray-400" />
            </div>
          )}
          
          <input
            ref={ref}
            type={safeType}
            className={inputClasses}
            required={safeRequired}
            {...props}
          />
        </div>
        
        {safeError && (
          <p className="mt-1 text-sm text-red-600">{safeError}</p>
        )}
      </div>
    )
  } catch (err) {
    // Error boundary fallback
    console.error('Input component error:', err)
    return (
      <div className="relative">
        <input
          ref={ref}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          {...props}
        />
        {safeError && (
          <p className="mt-1 text-sm text-red-600">{safeError}</p>
        )}
      </div>
    )
  }
})

Input.displayName = 'Input'

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  required: PropTypes.bool,
  className: PropTypes.string
}

export default Input

Input.displayName = 'Input'

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  required: PropTypes.bool,
  className: PropTypes.string
}
