'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Maximize2 } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-soft rounded-sm border border-black/5 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative w-full h-full cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={images[selectedIndex]}
              alt={`${productName} - صورة ${selectedIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover object-top transition-transform duration-500 ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100'
              }`}
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows (RTL aware) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              aria-label="الصورة السابقة"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-noir hover:bg-gold-primary hover:text-white flex items-center justify-center shadow-md transition-all z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              aria-label="الصورة التالية"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-noir hover:bg-gold-primary hover:text-white flex items-center justify-center shadow-md transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom hint button */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          type="button"
          aria-label="تكبير الصورة"
          className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-black/60 text-white backdrop-blur-md flex items-center justify-center hover:bg-gold-primary hover:text-black transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedIndex(idx);
                setIsZoomed(false);
              }}
              className={`relative aspect-[3/4] w-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-300 ${
                selectedIndex === idx
                  ? 'border-gold-primary ring-2 ring-gold-accent/40 shadow-sm'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} مصغرة ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
