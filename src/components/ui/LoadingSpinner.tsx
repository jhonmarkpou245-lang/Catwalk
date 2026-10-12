import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className={`inline-flex items-center justify-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-gold-primary/20 border-t-gold-primary rounded-full animate-spin`}
        role="status"
        aria-label="جاري التحميل"
      />
      {label && <span className="text-xs text-noir/70 font-medium">{label}</span>}
    </div>
  );
};
