'use client'

import { forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'pink' | 'red' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  as?: 'button' | 'div'
}

const variantClasses: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  pink: 'btn-pink',
  red: 'btn-red',
  ghost: 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-body font-medium text-sm text-[var(--charcoal)] hover:bg-[var(--cream)] transition-all duration-200 cursor-pointer',
}

const sizeClasses: Record<Size, string> = {
  sm: '!px-4 !py-2 !text-xs',
  md: '',
  lg: '!px-8 !py-4 !text-base',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${variantClasses[variant]} ${sizeClasses[size]} ${className ?? ''} ${disabled || loading ? 'opacity-60 pointer-events-none' : ''}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
