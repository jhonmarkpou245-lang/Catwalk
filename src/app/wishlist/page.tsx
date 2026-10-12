'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      addItem(item);
    });
    clearWishlist();
    toast.success('تم نقل جميع القطع من قائمة الأمنيات إلى حقيبة التسوق!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-black/10 gap-4">
        <div className="text-right">
          <div className="flex items-center gap-2 text-xs font-semibold text-gold-dark mb-1">
            <Heart className="w-4 h-4 text-gold-primary fill-gold-primary" />
            <span>مجموعتكِ المفضلة</span>
          </div>
          <h1 className="font-body text-3xl sm:text-4xl font-bold text-noir">
            قائمة الأمنيات
          </h1>
          <p className="text-xs sm:text-sm text-noir/60 mt-1">
            لديكِ {items.length} قطعة محفوظة في قائمتكِ الخاصة
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <Button
              onClick={handleMoveAllToCart}
              variant="primary"
              size="sm"
              className="text-xs font-bold"
            >
              <ShoppingBag className="w-3.5 h-3.5 ml-1.5" />
              <span>نقل الكل إلى الحقيبة</span>
            </Button>
            <button
              onClick={clearWishlist}
              className="text-xs text-rose-600 hover:underline font-medium px-2 py-1"
            >
              مسح الكل
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-sm border border-black/5 p-8 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-surface-soft mx-auto flex items-center justify-center mb-4 text-noir/30">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-noir mb-2">قائمة أمنياتكِ فارغة</h2>
          <p className="text-sm text-noir/60 mb-6 leading-relaxed">
            احفظي القطع التي تعجبكِ أثناء التسوق بالضغط على أيقونة القلب لتجديها هنا لاحقاً وتطلبيها في أي وقت.
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              <span>تصفحي أحدث القطع</span>
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
