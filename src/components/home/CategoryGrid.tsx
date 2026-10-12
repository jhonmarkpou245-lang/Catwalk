'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { categories } from '@/data/mockData';

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-surface-soft" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold tracking-widest text-gold-dark uppercase">
            مجموعات كاتووك
          </span>
          <h2 className="font-body text-2xl sm:text-3xl md:text-4xl font-bold text-noir">
            تسوّقي حسب الفئة
          </h2>
          <div className="w-12 h-0.5 bg-gold-primary mx-auto mt-3" />
        </div>

        {/* Categories Grid (2 columns on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-noir shadow-sm hover:shadow-gold transition-all duration-500"
              >
                {/* Background Category Image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover object-center opacity-85 transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-transparent group-hover:from-noir/90 transition-all duration-300" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-right flex flex-col justify-end">
                  <span className="text-[11px] text-gold-accent font-medium mb-1">
                    {cat.productCount} قطعة فاخرة
                  </span>
                  <h3 className="font-body text-lg sm:text-xl font-bold text-white group-hover:text-gold-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-1 mt-1 hidden sm:block">
                    {cat.description}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-white font-medium group-hover:text-gold-primary transition-colors">
                    <span>تصفحي المجموعة</span>
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
