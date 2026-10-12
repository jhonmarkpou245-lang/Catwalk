'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Upload,
  Plus,
  Trash2,
  Check,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Category } from '@/types';

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', '52', '54', '56', '58', '60', '36', '37', '38', '39', '40', 'ONE_SIZE'];

const DEFAULT_COLOR_PALETTES = [
  { name: 'أسود نوار', hex: '#111111' },
  { name: 'ذهبي كاتووك', hex: '#D4942B' },
  { name: 'عاجي كريمي', hex: '#FAF8F5' },
  { name: 'زمردي ملكي', hex: '#0D4D3D' },
  { name: 'عنابي داكن', hex: '#4A0E17' },
  { name: 'كحلي ليلي', hex: '#131E3A' },
  { name: 'وردي بودري', hex: '#E0A899' },
];

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState('10');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L']);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([
    { name: 'أسود نوار', hex: '#111111' },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#D4942B');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isOnSale, setIsOnSale] = useState(false);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setCategoryId(data.categories[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setImages([...images, data.url]);
        toast.success('تم رفع الصورة بنجاح');
      } else {
        toast.error(data.error || 'فشل رفع الصورة');
      }
    } catch {
      toast.error('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('يرجى كتابة اسم المنتج');
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error('يرجى تحديد سعر صالح للمنتج');
      return;
    }
    if (!categoryId) {
      toast.error('يرجى اختيار تصنيف المنتج');
      return;
    }
    if (images.length === 0) {
      toast.error('يرجى إضافة صورة واحدة على الأقل');
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      name_en: nameEn.trim() || undefined,
      slug: slug.trim() || undefined,
      description,
      price: Number(price),
      sale_price: salePrice ? Number(salePrice) : null,
      category_id: categoryId,
      images,
      sizes: selectedSizes,
      colors,
      stock: Number(stock),
      is_featured: isFeatured,
      is_new: isNew,
      is_on_sale: isOnSale || (salePrice ? Number(salePrice) < Number(price) : false),
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('تم إنشاء المنتج بنجاح');
        router.push('/admin/products');
        router.refresh();
      } else {
        toast.error(data.error || 'تعذر إنشاء المنتج');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لقائمة المنتجات</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 lg:p-8">
        <div className="border-b border-neutral-200 pb-5 mb-6">
          <h1 className="text-xl font-bold text-neutral-900">إضافة قطعة أزياء جديدة</h1>
          <p className="text-xs text-neutral-500 mt-1">
            أدخل تفاصيل التصميم، الصور، المقاسات، والألوان المتوفرة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-neutral-800 border-r-2 border-[#D4942B] pr-2">
              البيانات الأساسية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  اسم المنتج بالعربية *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: فستان سهرة فيردي رويال مرصع بالكريستال"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  الاسم بالإنجليزية (اختياري)
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Verdi Royal Crystal Evening Dress"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  التصنيف الرئيسي *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:border-[#D4942B] outline-none"
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  الرابط الدائم (Slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="يتم إنشاؤه تلقائياً في حال تركه فارغاً"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                وصف المنتج والتفاصيل
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف دقيق للخامات (حرير، مخمل، كريب)، أسلوب التطريز، والمناسبات الملائمة..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-neutral-800 border-r-2 border-[#D4942B] pr-2">
              الأسعار والمخزون
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  السعر الأساسي (ر.س) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2450"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  سعر التخفيض (اختياري)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="1950"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  الكمية المتوفرة في المخزون
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="12"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sizes Selection */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-neutral-800 border-r-2 border-[#D4942B] pr-2">
              المقاسات المتوفرة
            </h2>
            <div className="flex flex-wrap gap-2">
              {COMMON_SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleToggleSize(size)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#111111] text-[#D4942B] border-[#D4942B]'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors Selection */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-neutral-800 border-r-2 border-[#D4942B] pr-2">
              خيارات الألوان
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white shadow-sm text-xs"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="font-medium text-neutral-800">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(i)}
                    className="text-neutral-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Palette */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] text-neutral-500">ألوان مقترحة:</span>
              {DEFAULT_COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => {
                    if (!colors.some((c) => c.name === palette.name)) {
                      setColors([...colors, palette]);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200 bg-neutral-50 text-[11px] hover:border-[#D4942B]"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10"
                    style={{ backgroundColor: palette.hex }}
                  />
                  <span>{palette.name}</span>
                </button>
              ))}
            </div>

            {/* Custom Color Inputs */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="text"
                placeholder="اسم اللون (مثال: كحلي ملكي)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs w-48 focus:border-[#D4942B] outline-none"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-9 h-8 p-0 border border-neutral-200 rounded-lg cursor-pointer bg-transparent"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
              >
                إضافة اللون
              </button>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-neutral-800 border-r-2 border-[#D4942B] pr-2">
              معرض الصور
            </h2>

            {/* Upload Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="border-2 border-dashed border-neutral-300 hover:border-[#D4942B] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group bg-[#FAF8F5]">
                <Upload className="w-8 h-8 text-neutral-400 group-hover:text-[#D4942B] mb-2 transition-colors" />
                <span className="text-xs font-semibold text-neutral-800">
                  {uploadingImage ? 'جاري رفع الصورة...' : 'اضغط لرفع صورة من جهازك'}
                </span>
                <span className="text-[11px] text-neutral-400 mt-1">PNG, JPG, WEBP بحد أقصى 5 ميجابايت</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              <div className="flex flex-col justify-center space-y-2">
                <span className="text-xs font-semibold text-neutral-700">أو أضف رابط صورة مباشر:</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 text-xs outline-none focus:border-[#D4942B]"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-neutral-800 text-white rounded-xl text-xs hover:bg-neutral-900 font-semibold"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>

            {/* Image Previews */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {images.map((imgUrl, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 relative group border border-neutral-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium">
                      الرئيسية
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Visibility and Flags */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-neutral-800 border-r-2 border-[#D4942B] pr-2">
              العلامات الترويجية
            </h2>

            <div className="flex flex-wrap gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D4942B] accent-[#D4942B]"
                />
                <span>تمييز في الصفحة الرئيسية (Featured)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D4942B] accent-[#D4942B]"
                />
                <span>منتج من تشكيلة الموسم الجديد (New Arrival)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                <input
                  type="checkbox"
                  checked={isOnSale}
                  onChange={(e) => setIsOnSale(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D4942B] accent-[#D4942B]"
                />
                <span>تخفيض خاص (On Sale)</span>
              </label>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-neutral-200 flex items-center justify-end gap-3">
            <Link
              href="/admin/products"
              className="px-6 py-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              إلغاء
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-[#D4942B] hover:bg-[#B87F22] text-black font-semibold text-xs transition-all shadow-gold disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ ونشر المنتج'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
