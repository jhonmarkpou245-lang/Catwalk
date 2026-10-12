'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Users,
  ArrowUpRight,
  PlusCircle,
  Tag,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  productsCount: number;
  customersCount: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

interface RevenuePoint {
  label: string;
  date: string;
  amount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    productsCount: 0,
    customersCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [revenueChart, setRevenueChart] = useState<RevenuePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
          setRevenueChart(data.revenueChart || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>تم التوصيل</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3" />
            <span>تم الشحن</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <RotateCcw className="w-3 h-3" />
            <span>قيد التجهيز</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>مؤكد</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            <span>ملغي</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-300">
            <Clock className="w-3 h-3" />
            <span>قيد الانتظار</span>
          </span>
        );
    }
  };

  const maxRevenue = Math.max(...revenueChart.map((d) => d.amount), 100);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#111111] via-[#1A1A1A] to-[#242424] text-white rounded-2xl p-6 lg:p-8 border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4942B]/20 text-[#D4942B] border border-[#D4942B]/30 text-xs font-medium mb-3">
            <span>نظرة عامة على أداء المتجر</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
            مرحباً بك في لوحة تحكم بوتيك كاتووك
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl">
            متابعة فورية للطلبات الجديدة، حركة المبيعات، ومخزون الأزياء الراقية وتصاميم الهوت كوتور.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4942B] hover:bg-[#B87F22] text-black font-semibold text-sm transition-all duration-300 shadow-gold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all duration-300 border border-white/10"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>متابعة الطلبات</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-neutral-500">إجمالي الإيرادات</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D4942B] border border-[#D4942B]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">
            {loading ? '...' : formatCurrency(stats.totalRevenue)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% نمو هذا الشهر</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-neutral-500">إجمالي الطلبات</span>
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">
            {loading ? '...' : stats.totalOrders}
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            طلب مسجل في النظام
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-neutral-500">المنتجات المعروضة</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D4942B] border border-[#D4942B]/20 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">
            {loading ? '...' : stats.productsCount}
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            منتج جاهز للطلب
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-neutral-500">قاعدة العملاء</span>
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">
            {loading ? '...' : stats.customersCount}
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            عميلة مسجلة
          </div>
        </div>
      </div>

      {/* Grid: Revenue Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-neutral-900">مؤشر الإيرادات الأسبوعي</h2>
              <p className="text-xs text-neutral-500 mt-0.5">حجم المبيعات لآخر 7 أيام بالريال السعودي</p>
            </div>
            <div className="text-xs font-medium text-[#D4942B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              تحديث تلقائي
            </div>
          </div>

          {/* Bar Chart Area */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-neutral-100">
            {revenueChart.map((item, index) => {
              const heightPercent = Math.max(12, Math.round((item.amount / maxRevenue) * 100));
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip amount on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#111111] text-white text-[11px] py-1 px-2 rounded shadow-lg whitespace-nowrap mb-1">
                    {item.amount.toLocaleString('ar-SA')} ر.س
                  </div>
                  {/* The Bar */}
                  <div className="w-full max-w-[40px] bg-neutral-100 rounded-t-lg relative flex items-end overflow-hidden h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-[#B87F22] to-[#D4942B] group-hover:to-[#F3C973] rounded-t-lg transition-all duration-500"
                    />
                  </div>
                  {/* Day Label */}
                  <span className="text-xs text-neutral-600 font-medium text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 mb-1">إجراءات سريعة</h2>
            <p className="text-xs text-neutral-500 mb-6">اختصارات لإدارة المتجر بكفاءة</p>

            <div className="space-y-3">
              <Link
                href="/admin/products/new"
                className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 hover:border-[#D4942B] hover:bg-amber-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#D4942B] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-neutral-800">إضافة فستان أو منتج</div>
                    <div className="text-[11px] text-neutral-400">إضافة صور، أسعار، ومقاسات</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#D4942B]" />
              </Link>

              <Link
                href="/admin/coupons"
                className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 hover:border-[#D4942B] hover:bg-amber-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-neutral-800">إنشاء كود خصم ترويجي</div>
                    <div className="text-[11px] text-neutral-400">حملات التخفيضات والكوبونات</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#D4942B]" />
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 hover:border-[#D4942B] hover:bg-amber-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-neutral-800">تحديث حالات الشحن</div>
                    <div className="text-[11px] text-neutral-400">إشعار العميل بتحديث الطلب</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#D4942B]" />
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#FAF8F5] border border-amber-200/60 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-900 block mb-1">دعم متكامل:</span>
            يمكنك تخصيص الشحن وسياسات المتجر من صفحة الإعدادات في أي وقت.
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">أحدث الطلبات المستلمة</h2>
            <p className="text-xs text-neutral-500 mt-0.5">قائمة بآخر العمليات الشرائية المكتملة أو الجارية</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-[#D4942B] hover:text-[#B87F22] flex items-center gap-1"
          >
            <span>عرض كل الطلبات</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#FAF8F5] text-neutral-600 text-xs font-medium border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">رقم الطلب</th>
                <th className="px-6 py-4">اسم العميلة</th>
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4">المبلغ الإجمالي</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-neutral-400 text-xs">
                    لا توجد طلبات مسجلة بعد
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-neutral-900 text-xs" dir="ltr">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-800">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 text-neutral-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 font-semibold text-neutral-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/orders/${order.order_number || order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-[#D4942B] hover:text-black text-xs font-medium text-neutral-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>تفاصيل</span>
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
