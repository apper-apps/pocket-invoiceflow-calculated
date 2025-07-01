import React from 'react'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'

const FormField = ({ 
  type = 'input', 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false,
  options = [],
  placeholder,
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, name)
    }
  }
  
  if (type === 'select') {
    return (
      <Select
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        options={options}
        error={error}
        required={required}
        placeholder={placeholder}
        {...props}
      />
    )
  }
  
  if (type === 'textarea') {
    return (
      <div className="form-group">
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`form-textarea ${error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
          rows={4}
          {...props}
        />
        {error && (
          <p className="text-sm text-error-600 mt-1">{error}</p>
        )}
      </div>
    )
  }
  
  return (
    <Input
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={handleChange}
      error={error}
      required={required}
      placeholder={placeholder}
      {...props}
    />
  )
}

export default FormField