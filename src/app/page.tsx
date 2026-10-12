import React from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { PromoBanner } from '@/components/home/PromoBanner';
import { NewArrivals } from '@/components/home/NewArrivals';

export const metadata = {
  title: 'كاتووك | بوتيك الأزياء النسائية الفاخرة',
  description: 'اكتشفي أرقى تصاميم فساتين السهرة والعبايات الملكية والقفاطين في متجر كاتووك الإلكتروني',
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <NewArrivals />
    </main>
  );
}
