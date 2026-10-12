'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/Button';
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'افتراضي', hex: '#111111' });
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addItem(product, selectedSize, selectedColor, quantity);
      setIsAdding(false);
      toast.success(`تمت إضافة ${quantity} من "${product.name}" إلى حقيبة التسوق`);
    }, 400);
  };

  const handleWishlistToggle = () => {
    toggleItem(product);
    if (!isWishlisted) {
      toast.success('تمت الإضافة إلى قائمة الأمنيات');
    } else {
      toast('تمت الإزالة من قائمة الأمنيات');
    }
  };

  return (
    <div className="flex flex-col text-right">
      {/* Category & Subtitle */}
      <div className="mb-2">
        <span className="text-xs uppercase font-medium tracking-widest text-gold-dark">
          {typeof product.category === 'object' ? product.category?.name : product.category}
        </span>
        {product.subtitle && (
          <span className="text-xs text-noir/40 mx-2">• {product.subtitle}</span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-body text-2xl sm:text-3xl font-bold text-noir mb-4 leading-tight">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-black/10">
        <span className="text-2xl sm:text-3xl font-bold text-noir">
          {product.price.toLocaleString('ar-SA')} <span className="text-sm font-normal">ر.س</span>
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-lg text-noir/40 line-through">
              {product.originalPrice.toLocaleString('ar-SA')} ر.س
            </span>
            {product.discountPercent && (
              <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 rounded">
                وفر {product.discountPercent}%
              </span>
            )}
          </>
        )}
      </div>

      {/* Short Description */}
      <p className="text-noir/80 text-sm leading-relaxed mb-6">
        {product.description}
      </p>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-noir">اللون:</span>
            <span className="text-xs text-gold-dark font-medium">{selectedColor.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {product.colors.map((color) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? 'ring-2 ring-gold-primary ring-offset-2 scale-110' : 'hover:scale-105'
                  }`}
                  aria-label={color.name}
                >
                  <span
                    className="w-full h-full rounded-full border border-black/15 shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-noir">المقاس:</span>
            <span className="text-xs text-noir/50 underline cursor-pointer hover:text-gold-primary">
              دليل المقاسات
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-12 h-10 px-3 flex items-center justify-center text-xs font-semibold rounded-sm border transition-all ${
                    isSelected
                      ? 'border-noir bg-noir text-white shadow-sm'
                      : 'border-black/15 bg-white text-noir hover:border-gold-primary'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
        {/* Quantity Controls */}
        <div className="flex items-center justify-between border border-black/15 bg-white rounded-sm h-12 px-3 sm:w-36">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-noir/60 hover:text-gold-primary transition-colors p-1"
            aria-label="إنقاص الكمية"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-noir">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="text-noir/60 hover:text-gold-primary transition-colors p-1"
            aria-label="زيادة الكمية"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          isLoading={isAdding}
          size="lg"
          className="flex-1 h-12 text-sm bg-noir text-white hover:bg-gold-primary hover:text-noir transition-colors shadow-md"
        >
          <ShoppingBag className="w-4 h-4 ml-2" />
          <span>إضافة إلى حقيبة التسوق</span>
        </Button>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'إزالة من قائمة الأمنيات' : 'إضافة إلى قائمة الأمنيات'}
          className={`h-12 w-12 flex-shrink-0 rounded-sm border flex items-center justify-center transition-all ${
            isWishlisted
              ? 'border-rose-300 bg-rose-50 text-rose-600'
              : 'border-black/15 bg-white text-noir hover:border-gold-primary hover:text-gold-primary'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Details List */}
      {product.details && product.details.length > 0 && (
        <div className="mb-6 p-4 bg-surface-soft rounded-sm border border-black/5">
          <h3 className="text-xs font-bold text-noir uppercase tracking-wider mb-2.5">
            تفاصيل القطعة والعناية:
          </h3>
          <ul className="space-y-1.5 text-xs text-noir/70 list-disc list-inside">
            {product.details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Delivery and Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-black/10">
        <div className="flex items-center gap-3 p-3 bg-white rounded-sm border border-black/5">
          <Truck className="w-5 h-5 text-gold-primary flex-shrink-0" />
          <div className="text-right">
            <h4 className="text-xs font-bold text-noir">شحن سريع وآمن</h4>
            <p className="text-[11px] text-noir/60">توصيل خلال 2-4 أيام عمل</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-sm border border-black/5">
          <RefreshCw className="w-5 h-5 text-gold-primary flex-shrink-0" />
          <div className="text-right">
            <h4 className="text-xs font-bold text-noir">استبدال وإرجاع ميسر</h4>
            <p className="text-[11px] text-noir/60">خلال 7 أيام من الاستلام</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-sm border border-black/5">
          <ShieldCheck className="w-5 h-5 text-gold-primary flex-shrink-0" />
          <div className="text-right">
            <h4 className="text-xs font-bold text-noir">أصالة التصميم 100%</h4>
            <p className="text-[11px] text-noir/60">أقمشة فاخرة وخياطة يدوية</p>
          </div>
        </div>
      </div>
    </div>
  );
};
