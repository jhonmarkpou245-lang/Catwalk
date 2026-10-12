'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Tag, Edit2, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Coupon } from '@/types';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState<'percentage' | 'fixed'>('percentage');
  const [formValue, setFormValue] = useState('');
  const [formMinOrder, setFormMinOrder] = useState('0');
  const [formMaxUses, setFormMaxUses] = useState('0');
  const [formExpiresAt, setFormExpiresAt] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.coupons) {
        setCoupons(data.coupons);
      }
    } catch {
      toast.error('تعذر جلب الكوبونات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormCode('');
    setFormType('percentage');
    setFormValue('10');
    setFormMinOrder('300');
    setFormMaxUses('100');
    setFormExpiresAt(new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10));
    setFormIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormCode(coupon.code);
    setFormType(coupon.discount_type);
    setFormValue(String(coupon.discount_value));
    setFormMinOrder(String(coupon.min_order));
    setFormMaxUses(String(coupon.max_uses));
    setFormExpiresAt(coupon.expires_at ? coupon.expires_at.slice(0, 10) : '');
    setFormIsActive(coupon.is_active);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim()) {
      toast.error('كود الكوبون مطلوب');
      return;
    }
    if (!formValue || Number(formValue) <= 0) {
      toast.error('قيمة الخصم يجب أن تكون أكبر من صفر');
      return;
    }

    setSubmitting(true);
    const payload = {
      code: formCode.trim().toUpperCase(),
      discount_type: formType,
      discount_value: Number(formValue),
      min_order: Number(formMinOrder || 0),
      max_uses: Number(formMaxUses || 0),
      expires_at: formExpiresAt ? new Date(formExpiresAt).toISOString() : null,
      is_active: formIsActive,
    };

    try {
      if (editingCoupon) {
        const res = await fetch(`/api/admin/coupons/${editingCoupon.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success('تم تعديل الكوبون بنجاح');
          setModalOpen(false);
          fetchCoupons();
        } else {
          toast.error(data.error || 'تعذر تعديل الكوبون');
        }
      } else {
        const res = await fetch('/api/admin/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success('تم إنشاء الكوبون بنجاح');
          setModalOpen(false);
          fetchCoupons();
        } else {
          toast.error(data.error || 'تعذر إنشاء الكوبون');
        }
      }
    } catch {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`هل أنت متأكد من حذف الكوبون "${code}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`تم حذف الكوبون "${code}" بنجاح`);
        fetchCoupons();
      } else {
        toast.error(data.error || 'تعذر حذف الكوبون');
      }
    } catch {
      toast.error('حدث خطأ أثناء محاولة الحذف');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">إدارة الكوبونات والخصومات</h1>
          <p className="text-xs text-neutral-500 mt-1">
            إنشاء وتعديل أكواد التخفيض، والحد الأدنى للطلبات، وتواريخ الانتهاء
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4942B] hover:bg-[#B87F22] text-black font-semibold text-sm transition-all shadow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء كوبون جديد</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#FAF8F5] text-neutral-600 text-xs font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">كود الكوبون</th>
                <th className="px-6 py-4">نوع الخصم</th>
                <th className="px-6 py-4">قيمة الخصم</th>
                <th className="px-6 py-4">الحد الأدنى للطلب</th>
                <th className="px-6 py-4">مرات الاستخدام</th>
                <th className="px-6 py-4">تاريخ الانتهاء</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-neutral-400 text-xs">
                    جاري تحميل الكوبونات...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-neutral-400 text-xs">
                    لا توجد كوبونات حالياً
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => {
                  const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
                  return (
                    <tr key={coupon.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-sm text-neutral-900 bg-amber-50 px-3 py-1 rounded-lg border border-[#D4942B]/30 tracking-wider">
                          {coupon.code}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-neutral-700">
                        {coupon.discount_type === 'percentage' ? 'نسبة مئوية (%)' : 'مبلغ ثابت (ر.س)'}
                      </td>

                      <td className="px-6 py-4 font-bold text-neutral-900">
                        {coupon.discount_type === 'percentage'
                          ? `%${coupon.discount_value}`
                          : `${coupon.discount_value} ر.س`}
                      </td>

                      <td className="px-6 py-4 text-neutral-600 text-xs">
                        {coupon.min_order > 0 ? `${coupon.min_order} ر.س` : 'بدون حد أدنى'}
                      </td>

                      <td className="px-6 py-4 text-xs font-mono">
                        {coupon.used_count} / {coupon.max_uses > 0 ? coupon.max_uses : 'غير محدود'}
                      </td>

                      <td className="px-6 py-4 text-xs text-neutral-500">
                        {coupon.expires_at ? (
                          <span className={isExpired ? 'text-rose-600 font-semibold' : ''}>
                            {new Date(coupon.expires_at).toLocaleDateString('ar-SA')}
                            {isExpired && ' (منتهي)'}
                          </span>
                        ) : (
                          'مستمر'
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {coupon.is_active && !isExpired ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>مفعّل</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-semibold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>معطل</span>
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-5">
              <h3 className="text-base font-bold text-neutral-900">
                {editingCoupon ? 'تعديل كود الخصم' : 'إنشاء كود خصم جديد'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  كود الكوبون *
                </label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VIP20 or RAMADAN"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm font-mono font-bold focus:border-[#D4942B] outline-none"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    نوع الخصم *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs bg-white focus:border-[#D4942B] outline-none"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ر.س)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    قيمة الخصم *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="15"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#D4942B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    الحد الأدنى للطلب (ر.س)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#D4942B] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    أقصى عدد استخدامات (0 = غير محدود)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formMaxUses}
                    onChange={(e) => setFormMaxUses(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#D4942B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  تاريخ انتهاء الصلاحية
                </label>
                <input
                  type="date"
                  value={formExpiresAt}
                  onChange={(e) => setFormExpiresAt(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#D4942B] outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 pt-1">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D4942B] accent-[#D4942B]"
                />
                <span>تفعيل الكوبون للزبائن فوراً</span>
              </label>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#D4942B] hover:bg-[#B87F22] text-black text-xs font-semibold shadow-gold disabled:opacity-50"
                >
                  {submitting ? 'جاري الحفظ...' : editingCoupon ? 'حفظ التعديلات' : 'إنشاء الكوبون'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
