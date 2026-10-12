'use client';

import React, { useState } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, value, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || React.useId();
    const hasValue = value !== undefined && value !== '' && value !== null;

    return (
      <div className="relative w-full text-right">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            value={value}
            onChange={onChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`peer w-full px-3 pt-5 pb-2 text-sm text-noir bg-transparent border-b-2 
              ${error ? 'border-red-500' : isFocused ? 'border-gold-primary' : 'border-noir/20'} 
              focus:outline-none focus:border-gold-primary transition-all duration-300 text-right dir-rtl placeholder-transparent ${className}`}
            placeholder={label || ' '}
            {...props}
          />
          {label && (
            <label
              htmlFor={inputId}
              className={`absolute right-3 transition-all duration-200 pointer-events-none text-right font-body
                ${
                  isFocused || hasValue
                    ? 'top-1 text-[11px] text-gold-dark font-semibold'
                    : 'top-3.5 text-sm text-noir/50'
                }
                ${error ? 'text-red-500' : ''}`}
            >
              {label}
            </label>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-noir/60">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
