'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Banknote,
  Package,
  CheckCircle2,
  Clock,
  RotateCcw,
  Truck,
  AlertCircle,
  FileText,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Order } from '@/types';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('pending');
  const [notes, setNotes] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/orders/${id}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
          setStatus(data.order.status);
          setNotes(data.order.notes || '');
        } else {
          toast.error('الطلب غير موجود');
          router.push('/admin/orders');
        }
      } catch {
        toast.error('تعذر جلب تفاصيل الطلب');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadOrder();
    }
  }, [id, router]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('تم تحديث حالة الطلب بنجاح');
        setOrder(data.order);
      } else {
        toast.error(data.error || 'تعذر تحديث الطلب');
      }
    } catch {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-neutral-400">
        جاري تحميل تفاصيل الطلب...
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لقائمة الطلبات</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500">حالة الطلب:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold bg-white focus:border-[#D4942B] outline-none"
          >
            <option value="pending">قيد الانتظار</option>
            <option value="confirmed">مؤكد</option>
            <option value="processing">قيد التجهيز</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التوصيل</option>
            <option value="cancelled">ملغي</option>
          </select>

          <button
            onClick={handleUpdateStatus}
            disabled={updating}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#D4942B] hover:bg-[#B87F22] text-black font-semibold text-xs shadow-gold transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{updating ? 'جاري الحفظ...' : 'تحديث'}</span>
          </button>
        </div>
      </div>

      {/* Order Summary Title Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-neutral-900 font-mono" dir="ltr">
              {order.order_number}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-[#D4942B] font-semibold border border-[#D4942B]/30">
              {order.status === 'delivered' ? 'مكتمل' : 'قيد المتابعة'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-500 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(order.created_at).toLocaleString('ar-SA')}</span>
            </span>
            <span className="flex items-center gap-1">
              {order.payment_method === 'card' ? (
                <>
                  <CreditCard className="w-3.5 h-3.5 text-[#D4942B]" />
                  <span>بطاقة مدى / ائتمانية</span>
                </>
              ) : (
                <>
                  <Banknote className="w-3.5 h-3.5 text-neutral-500" />
                  <span>دفع عند الاستلام (COD)</span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="text-left md:text-left border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100">
          <div className="text-xs text-neutral-500">المبلغ الإجمالي</div>
          <div className="text-2xl font-bold text-neutral-900 font-serif text-[#D4942B]">
            {formatCurrency(order.total)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Info Card */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 border-r-2 border-[#D4942B] pr-2">
            بيانات العميلة والشحن
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-neutral-400 block text-[11px]">اسم العميلة:</span>
                <span className="font-semibold text-neutral-800">{order.customer_name}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-neutral-400 block text-[11px]">رقم الجوال:</span>
                <a
                  href={`tel:${order.customer_phone}`}
                  className="font-mono text-neutral-800 hover:text-[#D4942B]"
                  dir="ltr"
                >
                  {order.customer_phone}
                </a>
              </div>
            </div>

            {order.customer_email && (
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-neutral-400 block text-[11px]">البريد الإلكتروني:</span>
                  <a
                    href={`mailto:${order.customer_email}`}
                    className="font-mono text-neutral-800 hover:text-[#D4942B]"
                  >
                    {order.customer_email}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2.5 pt-2 border-t border-neutral-100">
              <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-neutral-400 block text-[11px]">مدينة التسليم:</span>
                <span className="font-semibold text-neutral-800">{order.city}</span>
                <span className="text-neutral-400 block text-[11px] mt-1">العنوان بالتفصيل:</span>
                <p className="text-neutral-700 leading-relaxed mt-0.5">
                  {order.shipping_address}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Input */}
          <div className="pt-3 border-t border-neutral-100">
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1.5">
              ملاحظات وتوجيهات الشحن:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: يرجى التواصل قبل الوصول بنصف ساعة..."
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#D4942B] outline-none"
            />
          </div>
        </div>

        {/* Order Items & Breakdown */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-neutral-900 border-r-2 border-[#D4942B] pr-2">
            محتويات الطلب ({order.items?.length || 0} قطع)
          </h2>

          <div className="divide-y divide-neutral-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 rounded-lg bg-neutral-100 overflow-hidden relative border border-neutral-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 text-xs leading-tight">
                      {item.product_name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                      <span>المقاس: <strong className="text-neutral-700">{item.size}</strong></span>
                      <span>•</span>
                      <span>اللون: <strong className="text-neutral-700">{item.color}</strong></span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      الكمية: {item.quantity} × {formatCurrency(item.price)}
                    </div>
                  </div>
                </div>

                <div className="font-bold text-neutral-900 text-sm">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculation Summary */}
          <div className="bg-[#FAF8F5] rounded-xl p-4 border border-neutral-200/60 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>المجموع الفرعي:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>تكلفة التوصيل:</span>
              <span>{order.shipping_cost === 0 ? 'شحن مجاني' : formatCurrency(order.shipping_cost)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>الخصم المطبق {order.coupon_code ? `(${order.coupon_code})` : ''}:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
              <span>المبلغ الإجمالي النهائي:</span>
              <span className="text-[#D4942B] font-serif text-base">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
