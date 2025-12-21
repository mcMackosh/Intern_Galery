import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  disabled?: boolean
  variant?: 'default' | 'danger' | 'success' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
}

export const Button = ({
  children,
  disabled = false,
  variant = 'default',
  type = 'button',
  onClick,
  className
}: ButtonProps) => {
  const baseClasses = 'py-2 px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 transition'

  const variantClasses: Record<string, string> = {
    default: 'bg-blue-600 hover:bg-blue-700 ',
    danger: 'bg-red-500 hover:bg-red-600',
    success: 'bg-green-600 hover:bg-green-700',
    secondary: 'bg-gray-500 hover:bg-gray-600',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${disabled ? 'bg-gray-400 cursor-not-allowed' : variantClasses[variant]} ${className || ''}`}
    >
      {children}
    </button>
  )
}

export default Button
