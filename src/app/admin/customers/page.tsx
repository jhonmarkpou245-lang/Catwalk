'use client';

import React, { useState, useEffect } from 'react';
import { Search, Users, Phone, Mail, ShoppingBag, Award, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Customer } from '@/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      const data = await res.json();
      if (data.customers) {
        setCustomers(data.customers);
      }
    } catch {
      toast.error('تعذر جلب بيانات العملاء');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalSpentAll = customers.reduce((acc, c) => acc + Number(c.total_spent || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">إدارة العملاء</h1>
          <p className="text-xs text-neutral-500 mt-1">
            سجل العميلات، سجل الطلبات، وحجم الإنفاق الإجمالي
          </p>
        </div>

        {/* Aggregate Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-neutral-200 text-xs flex items-center gap-2">
            <Users className="w-4 h-4 text-[#D4942B]" />
            <span>إجمالي العميلات: <strong>{customers.length}</strong></span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-neutral-200 text-xs flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D4942B]" />
            <span>إجمالي المشتريات: <strong>{formatCurrency(totalSpentAll)}</strong></span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-sm">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم العميلة، رقم الجوال، أو البريد..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#FAF8F5] text-neutral-600 text-xs font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">العميلة</th>
                <th className="px-6 py-4">رقم الجوال</th>
                <th className="px-6 py-4">البريد الإلكتروني</th>
                <th className="px-6 py-4">عدد الطلبات</th>
                <th className="px-6 py-4">إجمالي الإنفاق</th>
                <th className="px-6 py-4">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-neutral-400 text-xs">
                    جاري تحميل بيانات العملاء...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-neutral-400 text-xs">
                    لا توجد عميلات مسجلات
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#111111] text-[#D4942B] font-bold text-xs flex items-center justify-center border border-[#D4942B]/30">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900 leading-tight">
                            {customer.name}
                          </div>
                          {customer.total_spent > 3000 && (
                            <span className="inline-block mt-0.5 px-2 py-0.2 rounded bg-amber-50 text-[#D4942B] border border-amber-200 text-[10px] font-semibold">
                              VIP عميلة مميزة
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-neutral-700 text-xs" dir="ltr">
                      {customer.phone}
                    </td>

                    <td className="px-6 py-4 text-xs text-neutral-500 font-mono">
                      {customer.email || '—'}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800">
                        <ShoppingBag className="w-3 h-3 text-[#D4942B]" />
                        <span>{customer.orders_count} طلبات</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-neutral-900 font-serif">
                      {formatCurrency(customer.total_spent)}
                    </td>

                    <td className="px-6 py-4 text-xs text-neutral-500">
                      {new Date(customer.created_at).toLocaleDateString('ar-SA')}
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
