'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { products, categories } from '@/data/mockData';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialFilter = searchParams.get('filter') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Extract all unique sizes and colors from products
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set);
  }, []);

  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
        return false;
      }
      // Special filter
      if (initialFilter === 'new' && !p.isNew) return false;
      if (initialFilter === 'sale' && !p.isSale) return false;

      // Search keyword
      if (initialSearch) {
        const query = initialSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const catStr = typeof p.category === 'object' ? (p.category?.name || '') : (p.category || '');
        const matchesCat = catStr.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Size filter
      if (selectedSize !== 'all' && !p.sizes.includes(selectedSize)) {
        return false;
      }

      // Color filter
      if (selectedColor !== 'all' && !p.colors.some((c) => c.name === selectedColor)) {
        return false;
      }

      // Price filter
      if (p.price > priceRange) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // featured default
    });
  }, [selectedCategory, initialFilter, initialSearch, selectedSize, selectedColor, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setPriceRange(5000);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const FilterSidebarContent = (
    <div className="space-y-6 text-right">
      {/* Category Filter */}
      <div>
        <h3 className="text-xs font-bold text-noir uppercase tracking-wider mb-3">
          الفئات والتصنيفات
        </h3>
        <div className="space-y-1.5 text-xs">
          <button
            type="button"
            onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
            className={`w-full text-right py-1.5 px-2 rounded-sm transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'font-bold text-gold-dark bg-gold-light/60'
                : 'text-noir/70 hover:text-noir hover:bg-black/5'
            }`}
          >
            <span>جميع القطع</span>
            <span className="text-[10px] text-noir/40">({products.length})</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
              className={`w-full text-right py-1.5 px-2 rounded-sm transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'font-bold text-gold-dark bg-gold-light/60'
                  : 'text-noir/70 hover:text-noir hover:bg-black/5'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-noir/40">({cat.productCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="border-t border-black/10 pt-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-noir uppercase tracking-wider">
            السعر الأقصى
          </h3>
          <span className="text-xs font-bold text-gold-dark">
            {priceRange.toLocaleString('ar-SA')} ر.س
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={priceRange}
          onChange={(e) => {
            setPriceRange(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-full accent-gold-primary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-noir/50 mt-1">
          <span>500 ر.س</span>
          <span>5,000 ر.س</span>
        </div>
      </div>

      {/* Sizes Filter */}
      <div className="border-t border-black/10 pt-5">
        <h3 className="text-xs font-bold text-noir uppercase tracking-wider mb-3">
          المقاس
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setSelectedSize('all'); setCurrentPage(1); }}
            className={`px-3 py-1 text-xs rounded-sm border transition-colors ${
              selectedSize === 'all'
                ? 'border-noir bg-noir text-white'
                : 'border-black/15 bg-white text-noir/80 hover:border-gold-primary'
            }`}
          >
            الكل
          </button>
          {allSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setSelectedSize(s); setCurrentPage(1); }}
              className={`px-2.5 py-1 text-xs rounded-sm border transition-colors ${
                selectedSize === s
                  ? 'border-noir bg-noir text-white'
                  : 'border-black/15 bg-white text-noir/80 hover:border-gold-primary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors Filter */}
      <div className="border-t border-black/10 pt-5">
        <h3 className="text-xs font-bold text-noir uppercase tracking-wider mb-3">
          اللون
        </h3>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => { setSelectedColor('all'); setCurrentPage(1); }}
            className={`px-3 py-1 text-xs rounded-sm border transition-colors ${
              selectedColor === 'all'
                ? 'border-noir bg-noir text-white'
                : 'border-black/15 bg-white text-noir/80 hover:border-gold-primary'
            }`}
          >
            الكل
          </button>
          {allColors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => { setSelectedColor(color.name); setCurrentPage(1); }}
              title={color.name}
              className={`w-6 h-6 rounded-full border border-black/20 flex items-center justify-center transition-all ${
                selectedColor === color.name ? 'ring-2 ring-gold-primary ring-offset-1 scale-110' : ''
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {selectedColor === color.name && (
                <Check className="w-3 h-3 text-white mix-blend-difference" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={resetFilters}
        type="button"
        className="w-full mt-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-sm transition-colors"
      >
        إعادة تعيين الفلاتر
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir="rtl">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-8 text-right">
        <h1 className="font-body text-3xl sm:text-4xl font-bold text-noir">
          {initialFilter === 'new'
            ? 'وصل حديثاً'
            : initialFilter === 'sale'
            ? 'تخفيضات وعروض حصرية'
            : initialSearch
            ? `نتائج البحث عن: "${initialSearch}"`
            : 'جميع التشكيلات الفاخرة'}
        </h1>
        <p className="text-sm text-noir/60 mt-1">
          عرض {filteredProducts.length} قطعة من أحدث تصاميم كاتووك الراقية
        </p>
      </div>

      {/* Mobile Filter Toggle & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-black/10">
        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-black/15 bg-white rounded-sm text-xs font-semibold text-noir"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-primary" />
            <span>تصفية القطع</span>
          </button>

          <span className="text-xs text-noir/60 hidden sm:inline-block">
            {filteredProducts.length} نتيجة متطابقة
          </span>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sortSelect" className="text-xs text-noir/60 font-medium">
            الترتيب حسب:
          </label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-black/15 rounded-sm text-xs font-semibold text-noir focus:outline-none focus:border-gold-primary"
          >
            <option value="featured">المميز أولاً</option>
            <option value="newest">الأحدث وصولاً</option>
            <option value="price-low">السعر: من الأقل للأعلى</option>
            <option value="price-high">السعر: من الأعلى للأقل</option>
          </select>
        </div>
      </div>

      {/* Main Grid & Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-sm border border-black/5 shadow-sm h-fit sticky top-28">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10">
            <div className="flex items-center gap-2 font-bold text-sm text-noir">
              <Filter className="w-4 h-4 text-gold-primary" />
              <span>خيارات التصفية</span>
            </div>
          </div>
          {FilterSidebarContent}
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-sm border border-black/5 p-8">
              <p className="text-base font-semibold text-noir mb-2">
                لا توجد قطع تطابق معايير البحث المحددة
              </p>
              <p className="text-xs text-noir/60 mb-6">
                يرجى تجربة معايير أخرى أو إعادة تعيين الفلاتر
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 bg-noir text-white text-xs font-medium rounded-sm hover:bg-gold-primary hover:text-noir transition-colors"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-black/10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-sm border border-black/15 bg-white text-noir disabled:opacity-40 hover:border-gold-primary transition-colors"
                aria-label="الصفحة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-9 h-9 text-xs font-bold rounded-sm border transition-colors ${
                      currentPage === pageNumber
                        ? 'border-noir bg-noir text-white'
                        : 'border-black/15 bg-white text-noir hover:border-gold-primary'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-sm border border-black/15 bg-white text-noir disabled:opacity-40 hover:border-gold-primary transition-colors"
                aria-label="الصفحة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative mr-auto w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-6">
              <span className="font-bold text-sm text-noir">تصفية القطع</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-noir/60 hover:text-noir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {FilterSidebarContent}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <LoadingSpinner size="lg" label="جاري تحميل المنتجات..." />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
