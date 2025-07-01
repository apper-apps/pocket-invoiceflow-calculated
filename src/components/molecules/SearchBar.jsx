import React from 'react'
import Input from '@/components/atoms/Input'

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        icon="Search"
        iconPosition="left"
        className="pl-12"
      />
    </div>
  )
}

export default SearchBar