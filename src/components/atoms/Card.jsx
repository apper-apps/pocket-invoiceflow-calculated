import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '',
  hover = true,
  padding = true,
  ...props 
}) => {
  const baseClasses = `card ${padding ? 'p-6' : ''} ${className}`
  
  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
)

const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-secondary-200 bg-secondary-50 rounded-b-xl ${className}`}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card