'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  RotateCcw,
  Truck,
  AlertCircle,
  CreditCard,
  Banknote,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Order } from '@/types';

const STATUS_TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'pending', label: 'قيد الانتظار' },
  { id: 'confirmed', label: 'مؤكد' },
  { id: 'processing', label: 'قيد التجهيز' },
  { id: 'shipped', label: 'تم الشحن' },
  { id: 'delivered', label: 'تم التوصيل' },
  { id: 'cancelled', label: 'ملغي' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch {
      toast.error('تعذر جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 250);
    return () => clearTimeout(timer);
  }, [statusFilter, search]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>تم التوصيل</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3" />
            <span>تم الشحن</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <RotateCcw className="w-3 h-3" />
            <span>قيد التجهيز</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>مؤكد</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            <span>ملغي</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-300">
            <Clock className="w-3 h-3" />
            <span>قيد الانتظار</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">إدارة الطلبات والمبيعات</h1>
        <p className="text-xs text-neutral-500 mt-1">
          متابعة وتحديث حالات طلبات الزبائن وتأكيد عمليات الدفع والشحن
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#111111] text-[#D4942B] border-[#111111] shadow-sm'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-sm">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="البحث برقم الطلب (CW-...)، اسم العميلة، أو رقم الجوال..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#FAF8F5] text-neutral-600 text-xs font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">رقم الطلب</th>
                <th className="px-6 py-4">العميلة</th>
                <th className="px-6 py-4">المدينة</th>
                <th className="px-6 py-4">طريقة الدفع</th>
                <th className="px-6 py-4">الإجمالي</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-neutral-400 text-xs">
                    جاري تحميل الطلبات...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-neutral-400 text-xs">
                    لا توجد طلبات تطابق معايير البحث
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-neutral-900 text-xs" dir="ltr">
                      {order.order_number}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900 leading-tight">
                        {order.customer_name}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono mt-0.5" dir="ltr">
                        {order.customer_phone}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-neutral-700 text-xs">
                      {order.city}
                    </td>

                    <td className="px-6 py-4">
                      {order.payment_method === 'card' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-neutral-700">
                          <CreditCard className="w-3.5 h-3.5 text-[#D4942B]" />
                          <span>بطاقة بنكية</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-neutral-700">
                          <Banknote className="w-3.5 h-3.5 text-neutral-500" />
                          <span>دفع عند الاستلام</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-bold text-neutral-900">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="px-6 py-4 text-neutral-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString('ar-SA')}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/orders/${order.order_number || order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-[#D4942B] hover:text-black text-xs font-semibold text-neutral-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>عرض التفاصيل</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
