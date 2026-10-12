'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, Heart, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { MobileNav } from './MobileNav';
import { CartDrawer } from '../cart/CartDrawer';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalItems, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const cartCount = getTotalItems();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'جديد', href: '/products?filter=new' },
    { label: 'فساتين', href: '/categories/dresses' },
    { label: 'عبايات', href: '/categories/abayas' },
    { label: 'قفاطين', href: '/categories/kaftans' },
    { label: 'إكسسوارات', href: '/categories/accessories' },
    { label: 'تخفيضات', href: '/products?filter=sale', isSale: true },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 backdrop-blur-md bg-white/85 border-b ${
          isScrolled ? 'border-black/10 shadow-sm py-2' : 'border-black/5 py-3'
        }`}
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Top Bar */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left side: hamburger menu & search icon */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-start">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                type="button"
                aria-label="القائمة الرئيسية"
                className="p-2 text-noir hover:text-gold-primary transition-colors rounded-full hover:bg-black/5"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                type="button"
                aria-label="البحث"
                className="p-2 text-noir hover:text-gold-primary transition-colors rounded-full hover:bg-black/5"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-shrink-0 text-center">
              <Link href="/" className="inline-block group">
                <span className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.2em] text-noir transition-colors group-hover:text-gold-primary">
                  CATWALK
                </span>
                <span className="block text-[9px] uppercase tracking-[0.35em] text-gold-primary font-medium">
                  HAUTE COUTURE
                </span>
              </Link>
            </div>

            {/* Right side: Wishlist & Cart bag */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                aria-label="قائمة الأمنيات"
                className="relative p-2 text-noir hover:text-gold-primary transition-colors rounded-full hover:bg-black/5"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-gold-primary text-noir text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <button
                onClick={openDrawer}
                type="button"
                aria-label="حقيبة التسوق"
                className="relative p-2 text-noir hover:text-gold-primary transition-colors rounded-full hover:bg-black/5"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-noir text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links (Below Logo) */}
          <nav className="hidden md:flex items-center justify-center gap-8 pt-2 pb-1 border-t border-black/[0.04]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-gold-primary font-bold'
                      : link.isSale
                      ? 'text-rose-700 hover:text-rose-900'
                      : 'text-noir/80 hover:text-gold-primary'
                  } group`}
                >
                  {link.label}
                  {/* Animated golden underline */}
                  <span
                    className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-gold-primary to-gold-accent transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="border-t border-black/10 bg-surface-soft/95 backdrop-blur-md px-4 py-3 transition-all animate-fadeIn">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحثي عن فساتين، عبايات، إكسسوارات..."
                  className="w-full bg-white border border-black/15 rounded-sm py-2.5 pr-10 pl-10 text-sm text-noir focus:outline-none focus:border-gold-primary text-right"
                  autoFocus
                />
                <Search className="w-4 h-4 absolute right-3.5 text-noir/40 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute left-3 text-noir/40 hover:text-noir"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Global Drawers */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      <CartDrawer />
    </>
  );
};
