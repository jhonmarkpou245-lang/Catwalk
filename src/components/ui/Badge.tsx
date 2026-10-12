import React from 'react';

export type BadgeVariant = 'new' | 'sale' | 'sold-out';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, label, className = '' }) => {
  const variantConfig = {
    new: {
      text: label || 'جديد',
      classes: 'bg-gold-primary text-noir font-bold border border-gold-accent/40 shadow-sm',
    },
    sale: {
      text: label || 'تخفيض',
      classes: 'bg-rose-900 text-white font-bold tracking-wide shadow-sm',
    },
    'sold-out': {
      text: label || 'نفد',
      classes: 'bg-noir/70 text-surface-soft backdrop-blur-sm line-through',
    },
  };

  const current = variantConfig[variant];

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-medium tracking-wider uppercase rounded-sm transition-all duration-300 ${current.classes} ${className}`}
    >
      {current.text}
    </span>
  );
};
