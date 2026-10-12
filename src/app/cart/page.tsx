'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Truck, Tag, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const tax = Math.round(subtotal * 0.15); // VAT 15% (informative)
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === 'CATWALK10' || couponCode.toUpperCase() === 'GOLD') {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponError(null);
    } else {
      setCouponError('رمز القسيمة غير صحيح أو منتهي الصلاحية');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" dir="rtl">
      {/* Title */}
      <div className="mb-8 text-right">
        <h1 className="font-body text-3xl sm:text-4xl font-bold text-noir">
          حقيبة التسوق
        </h1>
        <p className="text-sm text-noir/60 mt-1">
          لديكِ {items.length} قطع في حقيبة التسوق الخاصة بكِ
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-sm border border-black/5 p-8 max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-surface-soft mx-auto flex items-center justify-center mb-4 text-noir/30">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-noir mb-2">حقيبة التسوق فارغة تماماً</h2>
          <p className="text-sm text-noir/60 mb-6">
            لم تقومي بإضافة أي قطع بعد إلى حقيبتك. تصفحي أحدث المجموعات لإضفاء لمسة ساحرة على إطلالتك!
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              استكشفي التشكيلات الآن
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white p-6 rounded-sm border border-black/5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-2">
              <span className="text-xs font-bold text-noir/60 uppercase tracking-wider">
                تفاصيل المنتجات
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:underline font-medium"
              >
                تفريغ الحقيبة
              </button>
            </div>

            <div className="divide-y divide-black/5">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="pt-6 border-t border-black/10 flex items-center justify-between">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-semibold text-noir hover:text-gold-primary transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>متابعة التسوق وإضافة المزيد</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 rounded-sm border border-black/5 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-noir pb-3 border-b border-black/10">
              ملخص الطلب
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-noir/40 pointer-events-none" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="رمز القسيمة (جربي CATWALK10)"
                    className="w-full pl-3 pr-9 py-2 text-xs bg-surface-soft border border-black/15 rounded-sm focus:outline-none focus:border-gold-primary text-right"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-noir hover:bg-gold-primary text-white hover:text-noir text-xs font-bold rounded-sm transition-colors"
                >
                  تطبيق
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  تم تفعيل خصم 10% بنجاح
                </p>
              )}
              {couponError && (
                <p className="text-xs text-rose-600 font-medium">{couponError}</p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs text-noir/80 border-t border-black/10 pt-4">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-semibold text-noir">
                  {subtotal.toLocaleString('ar-SA')} ر.س
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>الخصم المطبق:</span>
                  <span>-{discount.toLocaleString('ar-SA')} ر.س</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>رسوم التوصيل السريع:</span>
                <span className="font-semibold text-noir">
                  {shipping === 0 ? 'مجاناً' : `${shipping} ر.س`}
                </span>
              </div>

              <div className="flex justify-between text-noir/50">
                <span>ضريبة القيمة المضافة (15% مشمولة):</span>
                <span>{tax.toLocaleString('ar-SA')} ر.س</span>
              </div>

              <div className="flex justify-between text-base font-bold text-noir pt-3 border-t border-black/10">
                <span>الإجمالي النهائي:</span>
                <span className="text-gold-primary">
                  {total.toLocaleString('ar-SA')} ر.س
                </span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <div className="space-y-3 pt-2">
              <Link href="/checkout" className="block w-full">
                <Button variant="primary" size="lg" className="w-full text-sm">
                  <span>المتابعة إلى الدفع</span>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-black/10 space-y-2 text-[11px] text-noir/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-primary flex-shrink-0" />
                <span>دفع إلكتروني آمن ومشفر بأعلى المعايير</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold-primary flex-shrink-0" />
                <span>توصيل مجاني لجميع الطلبات أكثر من 1,000 ر.س</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
