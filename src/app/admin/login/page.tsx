'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, User, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('مرحباً بك! تم تسجيل الدخول بنجاح');
        router.push(redirectUrl);
        router.refresh();
      } else {
        toast.error(data.error || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      toast.error('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-neutral-300 mb-2">
          اسم المستخدم
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            className="w-full bg-[#1E1E1E] text-white text-sm rounded-xl px-4 py-3 pl-10 border border-white/10 focus:border-[#D4942B] focus:ring-1 focus:ring-[#D4942B] outline-none transition-all placeholder:text-neutral-500"
            dir="ltr"
          />
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-300 mb-2">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#1E1E1E] text-white text-sm rounded-xl px-4 py-3 pl-10 border border-white/10 focus:border-[#D4942B] focus:ring-1 focus:ring-[#D4942B] outline-none transition-all placeholder:text-neutral-500"
            dir="ltr"
          />
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      <div className="p-3 bg-[#1B1B1B] rounded-xl border border-white/5 text-[11px] text-neutral-400 flex items-center justify-between">
        <span>بيانات الدخول الافتراضية:</span>
        <span className="font-mono text-[#D4942B]" dir="ltr">admin / admin123</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D4942B] to-[#F3C973] hover:from-[#B87F22] hover:to-[#D4942B] text-black font-semibold rounded-xl text-sm transition-all duration-300 shadow-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>دخول إلى لوحة الإدارة</span>
            <ArrowLeft className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#D4942B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#D4942B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#1E1E1E] to-[#2A2A2A] border border-[#D4942B]/40 shadow-gold mb-4">
            <Sparkles className="w-8 h-8 text-[#D4942B]" />
          </div>
          <h1 className="text-3xl font-bold tracking-wider text-white font-serif mb-1">
            CATWALK
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4942B] font-medium mb-2">
            Haute Couture
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] border border-white/10 text-xs text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4942B]" />
            <span>بوابة الإدارة السرية</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-white">تسجيل الدخول للنظام</h2>
            <p className="text-xs text-neutral-400 mt-1">
              أدخل بيانات حساب الإدارة للوصول إلى لوحة التحكم
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-8 text-neutral-400">جاري التحميل...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Back to store */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-neutral-400 hover:text-[#D4942B] transition-colors inline-flex items-center gap-1.5"
          >
            <span>العودة إلى متجر كاتووك الرئيسي</span>
          </a>
        </div>
      </div>
    </div>
  );
}
