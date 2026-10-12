'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Bell,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { label: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
  { label: 'المنتجات', href: '/admin/products', icon: Package },
  { label: 'الفئات', href: '/admin/categories', icon: Layers },
  { label: 'الطلبات', href: '/admin/orders', icon: ShoppingBag },
  { label: 'العملاء', href: '/admin/customers', icon: Users },
  { label: 'الكوبونات', href: '/admin/coupons', icon: Tag },
  { label: 'الإعدادات', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; username: string }>({
    name: 'مدير البوتيك',
    username: 'admin',
  });

  // If this is the login page, render children directly without admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    // Check current session
    fetch('/api/admin/auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      toast.success('تم تسجيل الخروج بنجاح');
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#111111] font-sans flex antialiased" dir="rtl">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#111111] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } border-l border-[#222222] shadow-2xl`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#D4942B]/40 flex items-center justify-center text-[#D4942B] shadow-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-lg font-bold tracking-wider text-white">
                CATWALK
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#D4942B] font-medium">
                لوحة التحكم الإدارية
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#D4942B] text-black font-semibold shadow-gold'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Links */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-[#D4942B] hover:bg-white/5 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>زيارة المتجر المباشر</span>
            </span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-right"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-72 min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-sm font-semibold text-neutral-800 hidden sm:block">
              {NAV_ITEMS.find((n) =>
                n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href)
              )?.label || 'لوحة الإدارة'}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F5] border border-neutral-200 rounded-lg text-xs text-neutral-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>المتجر نشط وبحالة ممتازة</span>
            </div>

            <div className="flex items-center gap-3 pr-2 border-r border-neutral-200">
              <div className="w-9 h-9 rounded-full bg-[#111111] text-[#D4942B] font-bold text-xs flex items-center justify-center border border-[#D4942B]/30">
                {adminUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-xs font-semibold text-neutral-800 leading-tight">
                  {adminUser.name}
                </div>
                <div className="text-[10px] text-neutral-500 leading-tight">
                  مسؤول النظام
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
