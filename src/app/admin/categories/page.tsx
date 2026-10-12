'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers, Image as ImageIcon, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSortOrder, setFormSortOrder] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch {
      toast.error('تعذر جلب الفئات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormNameEn('');
    setFormSlug('');
    setFormImage('https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80');
    setFormDescription('');
    setFormSortOrder(String(categories.length + 1));
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormNameEn(cat.name_en || '');
    setFormSlug(cat.slug);
    setFormImage(cat.image);
    setFormDescription(cat.description || '');
    setFormSortOrder(String(cat.sort_order ?? 0));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('اسم الفئة مطلوب');
      return;
    }

    setSubmitting(true);
    const payload = {
      name: formName.trim(),
      name_en: formNameEn.trim() || undefined,
      slug: formSlug.trim() || undefined,
      image: formImage.trim() || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      description: formDescription.trim(),
      sort_order: Number(formSortOrder || 0),
    };

    try {
      if (editingCategory) {
        // Update
        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success('تم تعديل الفئة بنجاح');
          setModalOpen(false);
          fetchCategories();
        } else {
          toast.error(data.error || 'تعذر تعديل الفئة');
        }
      } else {
        // Create
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success('تمت إضافة الفئة بنجاح');
          setModalOpen(false);
          fetchCategories();
        } else {
          toast.error(data.error || 'تعذر إنشاء الفئة');
        }
      }
    } catch {
      toast.error('حدث خطأ في الاتصال بالخادم');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الفئة "${name}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`تم حذف الفئة "${name}" بنجاح`);
        fetchCategories();
      } else {
        toast.error(data.error || 'تعذر حذف الفئة');
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
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">إدارة الأقسام والفئات</h1>
          <p className="text-xs text-neutral-500 mt-1">
            تصنيف أزياء البوتيك وتحديد ترتيب عرضها في واجهة المتجر
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4942B] hover:bg-[#B87F22] text-black font-semibold text-sm transition-all shadow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة فئة جديدة</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#FAF8F5] text-neutral-600 text-xs font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">الفئة</th>
                <th className="px-6 py-4">الاسم بالإنجليزية</th>
                <th className="px-6 py-4">الرابط (Slug)</th>
                <th className="px-6 py-4">عدد المنتجات</th>
                <th className="px-6 py-4">الترتيب</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-neutral-400 text-xs">
                    جاري تحميل الفئات...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-neutral-400 text-xs">
                    لا توجد فئات حالياً
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-neutral-100 relative shrink-0 border border-neutral-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cat.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900 leading-tight">
                            {cat.name}
                          </div>
                          {cat.description && (
                            <div className="text-[11px] text-neutral-400 max-w-xs truncate mt-0.5">
                              {cat.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-neutral-600" dir="ltr">
                      {cat.name_en || '—'}
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-neutral-500" dir="ltr">
                      {cat.slug}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                        {cat.products_count ?? 0} منتجات
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-neutral-500 font-mono">
                      #{cat.sort_order ?? 0}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                          title="تعديل الفئة"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="حذف الفئة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
                {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
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
                  اسم الفئة بالعربية *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: فساتين سهرة"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  الاسم بالإنجليزية
                </label>
                <input
                  type="text"
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  placeholder="e.g. Evening Dresses"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  الرابط الدائم (Slug)
                </label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. evening-dresses"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  رابط صورة الغلاف
                </label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  الوصف المختصر
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="وصف محتوى وتصاميم هذا القسم..."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  min="0"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                />
              </div>

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
                  {submitting ? 'جاري الحفظ...' : editingCategory ? 'حفظ التعديلات' : 'إضافة الفئة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
