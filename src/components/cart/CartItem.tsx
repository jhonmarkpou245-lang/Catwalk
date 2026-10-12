'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-black/10 last:border-b-0 text-right">
      {/* Product Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative w-20 aspect-[3/4] flex-shrink-0 bg-surface-soft rounded-sm overflow-hidden border border-black/5"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover object-top"
        />
      </Link>

      {/* Info & Controls */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/products/${item.slug}`}
              className="text-sm font-semibold text-noir hover:text-gold-primary transition-colors line-clamp-1"
            >
              {item.name}
            </Link>
            <button
              onClick={() => removeItem(item.id)}
              className="text-noir/40 hover:text-rose-600 transition-colors p-1"
              aria-label="حذف العنصر"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Variants */}
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-noir/60">
            <span>المقاس: <strong className="text-noir font-medium">{item.size}</strong></span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              اللون:
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                style={{ backgroundColor: item.color.hex }}
              />
              <strong className="text-noir font-medium">{item.color.name}</strong>
            </span>
          </div>
        </div>

        {/* Price and Quantity Selector */}
        <div className="flex items-center justify-between mt-3 pt-2">
          <div className="flex items-center border border-black/15 bg-white rounded-sm h-8 px-2">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="text-noir/60 hover:text-gold-primary p-0.5"
              aria-label="إنقاص الكمية"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-noir">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="text-noir/60 hover:text-gold-primary p-0.5"
              aria-label="زيادة الكمية"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-left font-bold text-sm text-noir">
            {(item.price * item.quantity).toLocaleString('ar-SA')} ر.س
          </div>
        </div>
      </div>
    </div>
  );
};
