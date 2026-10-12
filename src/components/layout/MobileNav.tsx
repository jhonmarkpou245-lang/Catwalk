'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, User, Phone, Sparkles, ChevronLeft } from 'lucide-react';
import { categories } from '@/data/mockData';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { items: wishlistItems } = useWishlistStore();
  const { items: cartItems } = useCartStore();

  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'جديد كاتووك', href: '/products?filter=new', highlight: true },
    { label: 'فساتين سهرة', href: '/categories/dresses' },
    { label: 'عبايات كوتور', href: '/categories/abayas' },
    { label: 'قفاطين وجلاليب', href: '/categories/kaftans' },
    { label: 'إكسسوارات', href: '/categories/accessories' },
    { label: 'جميع المنتجات', href: '/products' },
    { label: 'تخفيضات حصرية', href: '/products?filter=sale', isSale: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex" dir="rtl">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer content (slides from right for RTL) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative ml-auto w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-black/10 flex items-center justify-between bg-surface-soft">
              <span className="font-playfair text-xl tracking-widest font-bold text-noir">
                CATWALK
              </span>
              <button
                onClick={onClose}
                aria-label="إغلاق القائمة"
                className="p-1.5 text-noir/70 hover:text-noir hover:bg-black/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 divide-x divide-x-reverse divide-black/10 border-b border-black/10 bg-white">
              <Link
                href="/wishlist"
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-3 text-xs font-semibold text-noir hover:text-gold-primary"
              >
                <Heart className="w-4 h-4 text-gold-primary" />
                <span>الأمنيات ({wishlistItems.length})</span>
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-3 text-xs font-semibold text-noir hover:text-gold-primary"
              >
                <ShoppingBag className="w-4 h-4 text-gold-primary" />
                <span>الحقيبة ({cartItems.length})</span>
              </Link>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
              <p className="text-[11px] font-bold text-noir/40 uppercase tracking-widest px-2 mb-2">
                الأقسام والتصنيفات
              </p>
              {navLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-3 rounded-sm text-sm font-medium transition-colors ${
                    item.isSale
                      ? 'text-rose-700 bg-rose-50/50 hover:bg-rose-50'
                      : item.highlight
                      ? 'text-gold-dark bg-gold-light/40 hover:bg-gold-light'
                      : 'text-noir hover:bg-surface-soft hover:text-gold-primary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.highlight && <Sparkles className="w-3.5 h-3.5 text-gold-primary" />}
                    <span>{item.label}</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 opacity-40" />
                </Link>
              ))}
            </div>

            {/* Footer / Account */}
            <div className="p-5 border-t border-black/10 bg-surface-soft space-y-3">
              <div className="flex items-center gap-2 text-xs text-noir/80">
                <Phone className="w-4 h-4 text-gold-primary" />
                <span>خدمة كبار الشخصيات: 920000000</span>
              </div>
              <p className="text-[11px] text-noir/50">
                شحن مجاني على كافة الطلبيات الملكية لأكثر من 1,000 ر.س
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
