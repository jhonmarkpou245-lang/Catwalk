import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { products } from '@/data/mockData';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = products.find((p) => p.slug === params.slug) || products[0];

  if (!product) {
    notFound();
  }

  // Related products from same category or featured
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.isFeatured))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" dir="rtl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-noir/60 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-gold-primary transition-colors">
          الرئيسية
        </Link>
        <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href="/products" className="hover:text-gold-primary transition-colors">
          المتجر
        </Link>
        <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
        <Link
          href={`/categories/${product.categorySlug}`}
          className="hover:text-gold-primary transition-colors"
        >
          {typeof product.category === 'object' ? product.category?.name : product.category}
        </Link>
        <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-noir font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase (Gallery + Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
        {/* Gallery Section */}
        <div className="lg:col-span-6 xl:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Details Section */}
        <div className="lg:col-span-6 xl:col-span-5">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-16 border-t border-black/10">
          <div className="flex items-center justify-between mb-8">
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-dark mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>إطلالات متناسقة</span>
              </div>
              <h2 className="font-body text-2xl sm:text-3xl font-bold text-noir">
                قطع قد تعجبكِ أيضاً
              </h2>
            </div>
            <Link
              href={`/categories/${product.categorySlug}`}
              className="text-xs font-semibold text-noir hover:text-gold-primary underline transition-colors"
            >
              عرض المزيد من هذا القسم
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
