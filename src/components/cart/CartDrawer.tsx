'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowLeft, Tag, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from './CartItem';
import { Button } from '@/components/ui/Button';

export const CartDrawer: React.FC = () => {
  const { items, isDrawerOpen, closeDrawer, getSubtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const shippingEstimate = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const total = Math.max(0, subtotal - discount + shippingEstimate);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === 'CATWALK10' || couponCode.toUpperCase() === 'GOLD') {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponError(null);
    } else {
      setCouponError('رمز القسيمة غير صالح أو منتهي الصلاحية');
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer content (slides in from left as requested) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative mr-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-black/10 flex items-center justify-between bg-surface-soft">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold-primary" />
                <h2 className="font-bold text-base text-noir">حقيبة التسوق</h2>
                <span className="text-xs text-noir/60 bg-white px-2 py-0.5 rounded-full border border-black/5">
                  ({items.length})
                </span>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="إغلاق حقيبة التسوق"
                className="p-1.5 text-noir/60 hover:text-noir hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-5 divide-y divide-black/5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-surface-soft flex items-center justify-center mb-4 text-noir/30">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-noir mb-1">حقيبة التسوق فارغة</h3>
                  <p className="text-xs text-noir/60 max-w-xs mb-6">
                    لم تقومي بإضافة أي قطع بعد. استكشفي أحدث تصاميمنا الفاخرة!
                  </p>
                  <Button onClick={closeDrawer} variant="outline" size="sm">
                    تصفحي التشكيلة الآن
                  </Button>
                </div>
              ) : (
                items.map((item) => <CartItem key={item.id} item={item} />)
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-black/10 bg-surface-soft space-y-4">
                {/* Coupon Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-noir/40 pointer-events-none" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="كوبون الخصم (جربي CATWALK10)"
                        className="w-full pl-3 pr-9 py-2 text-xs bg-white border border-black/15 rounded-sm focus:outline-none focus:border-gold-primary text-right"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-noir hover:bg-gold-primary text-white hover:text-noir text-xs font-semibold rounded-sm transition-colors"
                    >
                      تطبيق
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تم تطبيق خصم 10% بنجاح ({appliedCoupon})
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                  )}
                </form>

                {/* Totals */}
                <div className="space-y-2 text-xs text-noir/80 border-t border-black/10 pt-3">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span className="font-semibold text-noir">
                      {subtotal.toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>خصم القسيمة:</span>
                      <span>-{discount.toLocaleString('ar-SA')} ر.س</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>تقدير الشحن:</span>
                    <span className="font-semibold text-noir">
                      {shippingEstimate === 0 ? 'مجاناً (للطلبات فوق 1,000 ر.س)' : `${shippingEstimate} ر.س`}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-noir pt-2 border-t border-black/10">
                    <span>المجموع الإجمالي:</span>
                    <span className="text-gold-primary">
                      {total.toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>
                </div>

                {/* Checkout & Links */}
                <div className="space-y-2 pt-2">
                  <Link href="/checkout" onClick={closeDrawer} className="block w-full">
                    <Button variant="primary" size="lg" className="w-full text-sm">
                      <span>إتمام الطلب بأمان</span>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </Link>

                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <Link
                      href="/cart"
                      onClick={closeDrawer}
                      className="text-noir/70 hover:text-gold-primary transition-colors underline"
                    >
                      عرض صفحة الحقيبة الكاملة
                    </Link>
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="text-noir/60 hover:text-noir transition-colors"
                    >
                      متابعة التسوق
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
