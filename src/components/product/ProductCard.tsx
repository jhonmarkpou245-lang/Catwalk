'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`تمت إضافة "${product.name}" إلى حقيبة التسوق`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    if (!isWishlisted) {
      toast.success('تمت الإضافة إلى قائمة الأمنيات');
    } else {
      toast('تمت الإزالة من قائمة الأمنيات');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-white rounded-sm overflow-hidden border border-black/[0.04] hover:shadow-gold transition-all duration-500"
    >
      {/* Image Container with 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-soft">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            priority={false}
          />
        </Link>

        {/* Badges (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isSale && product.discountPercent && (
            <Badge variant="sale" label={`خصم ${product.discountPercent}%`} />
          )}
          {product.isNew && !product.isSale && <Badge variant="new" label="جديد" />}
          {!product.inStock && <Badge variant="sold-out" label="نفد من المخزون" />}
        </div>

        {/* Wishlist Heart Icon (Top Left in RTL) */}
        <button
          onClick={handleWishlistToggle}
          type="button"
          aria-label={isWishlisted ? 'إزالة من قائمة الأمنيات' : 'إضافة إلى قائمة الأمنيات'}
          className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-noir shadow-sm hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-600 text-rose-600' : 'text-noir hover:text-gold-primary'
            }`}
          />
        </button>

        {/* Quick Add to Cart button (appears on hover) */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            type="button"
            className="w-full py-2.5 px-4 bg-noir/90 hover:bg-gold-primary text-surface-soft hover:text-noir text-xs font-semibold backdrop-blur-md rounded-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>إضافة سريعة للحقيبة</span>
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1 justify-between text-right">
        <div>
          <span className="text-[11px] font-medium text-gold-dark tracking-wider block mb-1">
            {typeof product.category === 'object' ? product.category?.name : product.category}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="font-body text-sm font-semibold text-noir hover:text-gold-primary transition-colors line-clamp-1 block mb-2"
          >
            {product.name}
          </Link>
        </div>

        {/* Price display */}
        <div className="flex items-baseline justify-start gap-2.5 mt-auto">
          <span className="text-base font-bold text-noir">
            {product.price.toLocaleString('ar-SA')} <span className="text-xs font-normal">ر.س</span>
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-noir/40 line-through">
              {product.originalPrice.toLocaleString('ar-SA')} ر.س
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
