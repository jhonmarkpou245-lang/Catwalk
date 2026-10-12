'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShieldCheck,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('شكراً لاشتراكك في النشرة البريدية الحصرية لكاتووك');
    setEmail('');
  };

  return (
    <footer className="bg-[#111111] text-[#FAF8F5] pt-16 pb-12 border-t border-gold-primary/20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-5 text-right space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-playfair text-3xl font-bold tracking-[0.2em] text-white">
                CATWALK
              </span>
              <span className="block text-[10px] uppercase tracking-[0.35em] text-gold-accent font-medium">
                HAUTE COUTURE
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              وجهتك الفاخرة للأزياء النسائية الراقية وتصاميم الهوت كوتور والعبايات الملكية. نجمع بين عراقة التراث الشرقي وأحدث صيحات الموضة العالمية بدقة متناهية وأقمشة منتقاة بعناية.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="إنستغرام"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-gold-primary hover:border-gold-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="فيسبوك"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-gold-primary hover:border-gold-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="منصة إكس"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-gold-primary hover:border-gold-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-7 flex flex-col justify-center text-right space-y-3">
            <h3 className="font-body text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-primary inline-block"></span>
              انضمي إلى النادي الحصري لكاتووك
            </h3>
            <p className="text-white/60 text-xs sm:text-sm">
              كوني أول من يكتشف التشكيلات الحصرية الجديدة وعروض التخفيضات الخاصة بالأعضاء.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخلي بريدكِ الإلكتروني..."
                required
                className="flex-1 bg-white/5 border border-white/15 px-4 py-3 rounded-sm text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-primary text-right"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gold-primary hover:bg-gold-dark text-noir font-bold text-xs sm:text-sm rounded-sm transition-colors flex items-center justify-center gap-2 shadow-gold"
              >
                <span>اشتراك</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-12 border-b border-white/10 text-right">
          {/* Column 1: Store Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gold-accent tracking-wider uppercase">
              المتجر
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/70">
              <li>
                <Link href="/products?filter=new" className="hover:text-gold-primary transition-colors">
                  وصل حديثاً
                </Link>
              </li>
              <li>
                <Link href="/categories/dresses" className="hover:text-gold-primary transition-colors">
                  فساتين السهرة
                </Link>
              </li>
              <li>
                <Link href="/categories/abayas" className="hover:text-gold-primary transition-colors">
                  عبايات كوتور
                </Link>
              </li>
              <li>
                <Link href="/categories/kaftans" className="hover:text-gold-primary transition-colors">
                  قفاطين وجلاليب
                </Link>
              </li>
              <li>
                <Link href="/categories/accessories" className="hover:text-gold-primary transition-colors">
                  إكسسوارات وحقائب
                </Link>
              </li>
              <li>
                <Link href="/products?filter=sale" className="text-rose-400 hover:text-rose-300 transition-colors">
                  العروض والتخفيضات
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gold-accent tracking-wider uppercase">
              خدمة العملاء
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/70">
              <li>
                <Link href="/products" className="hover:text-gold-primary transition-colors">
                  دليل المقاسات
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-gold-primary transition-colors">
                  سياسة الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-gold-primary transition-colors">
                  سياسة الاسترجاع والاستبدال
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gold-primary transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gold-primary transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gold-primary transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="text-sm font-bold text-gold-accent tracking-wider uppercase">
              تواصل معنا
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-gold-primary flex-shrink-0" />
                <span>الرياض، المملكة العربية السعودية - طريق التحلية</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-primary flex-shrink-0" />
                <span dir="ltr">+966 11 000 0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-primary flex-shrink-0" />
                <span>concierge@catwalk-boutique.com</span>
              </li>
              <li className="text-xs text-white/50 pt-1">
                ساعات العمل: السبت - الخميس (9:00 ص - 10:00 م)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Payment Methods & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} بوتيك كاتووك للأزياء الفاخرة (Catwalk Haute Couture). جميع الحقوق محفوظة.</p>

          {/* Payment Icons */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-white/60 ml-2">وسائل دفع آمنة:</span>
            <div className="px-2 py-1 bg-white/10 rounded text-[11px] font-bold text-white tracking-wider">
              MADA
            </div>
            <div className="px-2 py-1 bg-white/10 rounded text-[11px] font-bold text-white tracking-wider">
              VISA
            </div>
            <div className="px-2 py-1 bg-white/10 rounded text-[11px] font-bold text-white tracking-wider">
              MASTERCARD
            </div>
            <div className="px-2 py-1 bg-white/10 rounded text-[11px] font-bold text-white tracking-wider">
              APPLE PAY
            </div>
            <div className="px-2 py-1 bg-white/10 rounded text-[11px] font-bold text-white tracking-wider">
              TABBY
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
