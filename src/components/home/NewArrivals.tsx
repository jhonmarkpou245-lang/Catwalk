'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Flame } from 'lucide-react';
import { products } from '@/data/mockData';
import { ProductCard } from '@/components/product/ProductCard';

export const NewArrivals: React.FC = () => {
  const newItems = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-surface-soft" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-black/5 gap-4">
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-dark mb-1">
              <Flame className="w-3.5 h-3.5 text-gold-primary" />
              <span>أحدث إبداعات الموسم</span>
            </div>
            <h2 className="font-body text-2xl sm:text-3xl font-bold text-noir">
              وصل حديثاً
            </h2>
          </div>
          <Link
            href="/products?filter=new"
            className="inline-flex items-center gap-1 text-sm font-semibold text-noir hover:text-gold-primary transition-colors group"
          >
            <span>استكشفي كل جديد</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Product Cards Grid / Mobile Horizontal Scroll */}
        <div className="flex overflow-x-auto pb-4 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible scrollbar-none snap-x snap-mandatory">
          {newItems.map((product) => (
            <div key={product.id} className="min-w-[260px] flex-shrink-0 sm:min-w-0 sm:flex-shrink snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
