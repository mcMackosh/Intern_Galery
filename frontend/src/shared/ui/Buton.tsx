import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  disabled?: boolean
  variant?: 'default' | 'danger' | 'success' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export const Button = ({
  children,
  disabled = false,
  variant = 'default',
  type = 'button',
  onClick,
}: ButtonProps) => {
  const baseClasses = 'w-full py-2 text-white rounded-md focus:outline-none focus:ring-2 transition'

  const variantClasses: Record<string, string> = {
    default: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-400',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-400',
    secondary: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-400',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${disabled ? 'bg-gray-400 cursor-not-allowed' : variantClasses[variant]}`}
    >
      {children}
    </button>
  )
}

export default Button
