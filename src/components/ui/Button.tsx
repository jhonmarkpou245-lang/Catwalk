'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium font-body transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 rounded-sm gap-1.5',
      md: 'text-sm px-6 py-2.5 rounded-sm gap-2',
      lg: 'text-base px-8 py-3.5 rounded-sm gap-2.5',
    };

    const variantStyles = {
      primary:
        'bg-noir text-surface-soft hover:bg-gold-primary hover:text-noir border border-noir hover:border-gold-primary shadow-sm hover:shadow-gold',
      outline:
        'bg-transparent text-noir border border-gold-primary hover:bg-gold-primary hover:text-noir',
      ghost:
        'bg-transparent text-noir hover:text-gold-primary hover:bg-gold-light/40 border border-transparent',
      gold:
        'bg-gold-primary text-noir font-semibold hover:bg-gold-dark hover:text-white shadow-gold hover:shadow-gold-lg border border-gold-accent',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>جاري المعالجة...</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
