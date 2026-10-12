'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Product, Category } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      toast.error('تعذر جلب المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch {}
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, statusFilter]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في تعطيل وحذف المنتج "${name}"؟`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`تم تعطيل المنتج "${name}" بنجاح`);
        fetchProducts();
      } else {
        toast.error(data.error || 'تعذر حذف المنتج');
      }
    } catch {
      toast.error('حدث خطأ أثناء محاولة الحذف');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">إدارة المنتجات</h1>
          <p className="text-xs text-neutral-500 mt-1">
            إضافة وتعديل فساتين وعبايات وأزياء الهوت كوتور في البوتيك
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4942B] hover:bg-[#B87F22] text-black font-semibold text-sm transition-all shadow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث بالاسم أو الوصف..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] focus:ring-1 focus:ring-[#D4942B] outline-none"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:border-[#D4942B] outline-none text-neutral-700"
          >
            <option value="">جميع الفئات</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:border-[#D4942B] outline-none text-neutral-700"
          >
            <option value="all">كل الحالات</option>
            <option value="active">النشطة فقط</option>
            <option value="inactive">المعطلة</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#FAF8F5] text-neutral-600 text-xs font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">المنتج</th>
                <th className="px-6 py-4">الفئة</th>
                <th className="px-6 py-4">السعر</th>
                <th className="px-6 py-4">المخزون</th>
                <th className="px-6 py-4">الميزات</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400 text-xs">
                    جاري تحميل المنتجات...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400 text-xs">
                    لم يتم العثور على أي منتجات مطابقة
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80';
                  const isDeactivated = product.is_active === false;

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-neutral-50/80 transition-colors ${
                        isDeactivated ? 'opacity-60 bg-neutral-50/40' : ''
                      }`}
                    >
                      {/* Product Name & Image */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-lg overflow-hidden bg-neutral-100 relative shrink-0 border border-neutral-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={primaryImage}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 leading-tight">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono mt-0.5" dir="ltr">
                              {product.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-neutral-600 text-xs">
                        {typeof product.category === 'object' ? product.category?.name : (product.category || 'غير محدد')}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-neutral-900">
                          {formatCurrency(product.sale_price ?? product.price)}
                        </div>
                        {product.sale_price && (
                          <div className="text-[11px] text-neutral-400 line-through">
                            {formatCurrency(product.price)}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (product.stock ?? 0) > 5
                              ? 'bg-neutral-100 text-neutral-700'
                              : (product.stock ?? 0) > 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {product.stock ?? 0} قطع
                        </span>
                      </td>

                      {/* Features Badges */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.is_featured && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-[#D4942B] border border-amber-200 text-[10px] font-semibold">
                              مميز
                            </span>
                          )}
                          {product.is_new && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px]">
                              جديد
                            </span>
                          )}
                          {product.is_on_sale && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px]">
                              تخفيض
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {isDeactivated ? (
                          <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>معطل</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>نشط</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                            title="تعديل المنتج"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {!isDeactivated && (
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="تعطيل المنتج"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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
    </div>
  );
}
