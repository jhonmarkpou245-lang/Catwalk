'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Banknote,
  Lock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'apple-pay'>('card');

  // Customer Form state
  const [formData, setFormData] = useState({
    fullName: 'نورة بنت عبدالله آل سعود',
    phone: '0551234567',
    email: 'noura@example.com',
    city: 'الرياض',
    district: 'حي النخيل',
    address: 'شارع التخصصي، فيلا 12',
    postalCode: '12345',
    notes: '',
    cardNumber: '4111 2222 3333 4444',
    cardExpiry: '12/28',
    cardCvc: '888',
  });

  const subtotal = getSubtotal();
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('حقيبة التسوق فارغة');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.city || !formData.address) {
      toast.error('يرجى ملء جميع الحقول الإلزامية');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const orderId = `CW-${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      setIsLoading(false);
      toast.success('تم استلام طلبكِ بنجاح!');
      router.push(`/order-confirmation/${orderId}`);
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center" dir="rtl">
        <h2 className="text-xl font-bold text-noir mb-2">لا توجد منتجات في حقيبة التسوق</h2>
        <p className="text-sm text-noir/60 mb-6">
          يرجى إضافة قطع إلى الحقيبة قبل إتمام الدفع.
        </p>
        <Link href="/products">
          <Button variant="primary">العودة للتسوق</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" dir="rtl">
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-black/10">
        <div>
          <h1 className="font-body text-2xl sm:text-3xl font-bold text-noir">
            إتمام الطلب والدفع الآمن
          </h1>
          <p className="text-xs sm:text-sm text-noir/60 mt-1">
            جميع معلوماتك مشفرة ومحمية بأعلى معايير الأمان 256-bit SSL
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-sm border border-emerald-200 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>دفع آمن 100%</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Form (Customer info & shipping & payment) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Customer Contact Information */}
            <div className="bg-white p-6 rounded-sm border border-black/5 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-noir flex items-center gap-2 border-b border-black/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-noir text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                بيانات التواصل والشخصية
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label="الاسم الكامل"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
                <Input
                  label="رقم الجوال (مثال: 05xxxxxxxx)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>

              <Input
                label="البريد الإلكتروني (لتأكيد الطلب وتتبع الشحنة)"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white p-6 rounded-sm border border-black/5 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-noir flex items-center gap-2 border-b border-black/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-noir text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                عنوان الشحن والتوصيل
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-noir/60 mb-1">المدينة</label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-3 text-sm bg-transparent border-b-2 border-noir/20 focus:border-gold-primary focus:outline-none"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة المكرمة">مكة المكرمة</option>
                    <option value="المدينة المنورة">المدينة المنورة</option>
                    <option value="الخبر">الخبر</option>
                  </select>
                </div>

                <Input
                  label="الحي"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  required
                />
              </div>

              <Input
                label="العنوان بالتفصيل (اسم الشارع، رقم المبنى/الفيلا)"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />

              <Input
                label="ملاحظات التوصيل الإضافية (اختياري)"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 rounded-sm border border-black/5 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-noir flex items-center gap-2 border-b border-black/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-noir text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                طريقة الدفع
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-sm border text-right transition-all ${
                    paymentMethod === 'card'
                      ? 'border-gold-primary bg-gold-light/40 ring-1 ring-gold-primary'
                      : 'border-black/15 bg-white hover:border-black/30'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-gold-primary mb-2" />
                  <div className="font-bold text-xs text-noir">بطاقة ائتمان / مدى</div>
                  <div className="text-[11px] text-noir/60 mt-0.5">Visa, Mastercard, Mada</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple-pay')}
                  className={`p-4 rounded-sm border text-right transition-all ${
                    paymentMethod === 'apple-pay'
                      ? 'border-gold-primary bg-gold-light/40 ring-1 ring-gold-primary'
                      : 'border-black/15 bg-white hover:border-black/30'
                  }`}
                >
                  <Lock className="w-5 h-5 text-gold-primary mb-2" />
                  <div className="font-bold text-xs text-noir">Apple Pay</div>
                  <div className="text-[11px] text-noir/60 mt-0.5">دفع فوري سريع وآمن</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-sm border text-right transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-gold-primary bg-gold-light/40 ring-1 ring-gold-primary'
                      : 'border-black/15 bg-white hover:border-black/30'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-gold-primary mb-2" />
                  <div className="font-bold text-xs text-noir">الدفع عند الاستلام</div>
                  <div className="text-[11px] text-noir/60 mt-0.5">نقداً أو شبكة للمندوب</div>
                </button>
              </div>

              {/* Card Inputs if card is selected */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-surface-soft rounded-sm border border-black/10 space-y-4 mt-3">
                  <Input
                    label="رقم البطاقة"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    dir="ltr"
                    className="tracking-widest"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="تاريخ الانتهاء (MM/YY)"
                      value={formData.cardExpiry}
                      onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                      dir="ltr"
                    />
                    <Input
                      label="رمز الأمان (CVC)"
                      type="password"
                      maxLength={4}
                      value={formData.cardCvc}
                      onChange={(e) => handleInputChange('cardCvc', e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 rounded-sm border border-black/5 shadow-sm space-y-6 sticky top-28">
            <h2 className="text-base font-bold text-noir pb-3 border-b border-black/10">
              ملخص طلبيتكِ
            </h2>

            {/* Compact items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <div className="relative w-12 aspect-[3/4] rounded-sm overflow-hidden flex-shrink-0 bg-surface-soft border border-black/5">
                    <Image
                      src={item.image}
                      alt={item.name || 'منتج'}
                      fill
                      sizes="48px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-noir line-clamp-1">{item.name}</p>
                    <p className="text-[11px] text-noir/60">
                      مقاس: {item.size} • كمية: {item.quantity}
                    </p>
                    <p className="font-bold text-gold-dark mt-0.5">
                      {(item.price * item.quantity).toLocaleString('ar-SA')} ر.س
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-noir/80 border-t border-black/10 pt-4">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-semibold text-noir">
                  {subtotal.toLocaleString('ar-SA')} ر.س
                </span>
              </div>

              <div className="flex justify-between">
                <span>الشحن السريع (VIP Courier):</span>
                <span className="font-semibold text-noir">
                  {shipping === 0 ? 'مجاناً' : `${shipping} ر.س`}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-noir pt-3 border-t border-black/10">
                <span>الإجمالي للدفع:</span>
                <span className="text-gold-primary">
                  {total.toLocaleString('ar-SA')} ر.س
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full text-sm font-bold bg-noir text-white hover:bg-gold-primary hover:text-noir"
            >
              <CheckCircle className="w-4 h-4 ml-2" />
              <span>تأكيد الطلب الآن ({total.toLocaleString('ar-SA')} ر.س)</span>
            </Button>

            <div className="text-center">
              <Link
                href="/cart"
                className="text-xs text-noir/60 hover:text-gold-primary underline"
              >
                العودة إلى تعديل السلة
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
