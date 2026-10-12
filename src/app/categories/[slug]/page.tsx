import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { categories, products } from '@/data/mockData';
import { ProductCard } from '@/components/product/ProductCard';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((p) => p.categorySlug === category.slug);

  return (
    <div className="min-h-screen bg-surface-soft" dir="rtl">
      {/* Category Hero */}
      <section className="relative w-full h-72 sm:h-96 bg-noir overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/50 to-transparent" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 text-right">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-4">
            <Link href="/" className="hover:text-gold-primary transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3 h-3" />
            <Link href="/products" className="hover:text-gold-primary transition-colors">
              المجموعات
            </Link>
            <ChevronLeft className="w-3 h-3" />
            <span className="text-white font-medium">{category.name}</span>
          </nav>

          <span className="text-xs uppercase font-semibold tracking-widest text-gold-accent mb-1">
            تشكيلة كاتووك الحصرية
          </span>
          <h1 className="font-headline text-3xl sm:text-5xl font-bold text-white mb-2">
            {category.name}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl font-normal">
            {category.description}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between pb-6 border-b border-black/10 mb-8">
          <p className="text-sm text-noir/70 font-medium">
            عرض {categoryProducts.length} قطعة مصممة بعناية
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/products"
              className="text-noir font-semibold hover:text-gold-primary underline transition-colors"
            >
              عرض كافة التصاميم
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        {categoryProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-sm border border-black/5 p-8">
            <h3 className="text-base font-bold text-noir mb-2">
              جاري تجهيز قطع جديدة لهذا القسم
            </h3>
            <p className="text-xs text-noir/60 mb-6">
              ترقبي إطلاق التشكيلة الجديدة قريباً جداً في بوتيك كاتووك
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 bg-noir text-white text-xs font-semibold rounded-sm hover:bg-gold-primary hover:text-noir transition-colors"
            >
              تصفحي باقي الأقسام
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
