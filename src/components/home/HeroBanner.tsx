'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tagline: 'مجموعة كاتووك الحصرية',
    title: 'عالم الأناقة والجمال',
    subtitle: 'اكتشفي تشكيلة موسم الخريف الجديدة بتصاميم استثنائية وأقمشة ملكية',
    ctaText: 'تسوّقي الآن',
    ctaLink: '/products',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 2,
    tagline: 'هوت كوتور 2026',
    title: 'سحر العبايات والقفاطين',
    subtitle: 'تطريز يدوي بخيوط الذهب الخالص وتفاصيل تأسر القلوب في كل مناسبة',
    ctaText: 'استكشفي العبايات',
    ctaLink: '/categories/abayas',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 3,
    tagline: 'فساتين السهرة الراقية',
    title: 'تألقي كأميرة في كل مناسبة',
    subtitle: 'تصاميم فاخرة مفعمة بالأنوثة تجمع بين فخامة الشرق وحداثة الغرب',
    ctaText: 'شاهدي فساتين السهرة',
    ctaLink: '/categories/dresses',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1600&auto=format&fit=crop',
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full h-[75vh] min-h-[520px] max-h-[800px] overflow-hidden bg-noir" dir="rtl">
      {/* Background Images with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-65"
          />
          {/* Gradient Overlay for luxury readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/50 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-noir/60" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-right items-start">
        <motion.div
          key={`content-${slide.id}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-primary/20 backdrop-blur-md border border-gold-primary/40 text-gold-accent text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.tagline}</span>
          </div>

          <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide leading-tight drop-shadow-md">
            {slide.title}
          </h1>

          <p className="font-body text-sm sm:text-lg text-white/85 leading-relaxed max-w-xl font-normal drop-shadow">
            {slide.subtitle}
          </p>

          <div className="pt-3 flex items-center gap-4">
            <Link href={slide.ctaLink}>
              <Button
                variant="gold"
                size="lg"
                className="font-bold tracking-wider px-8 shadow-gold-lg"
              >
                {slide.ctaText}
              </Button>
            </Link>
            <Link href="/products?filter=sale">
              <Button
                variant="outline"
                size="lg"
                className="border-white/50 text-white hover:border-gold-primary hover:text-gold-primary hover:bg-black/30"
              >
                عروض الموسم
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls (Arrows) */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
        <button
          onClick={handlePrev}
          type="button"
          aria-label="الشريحة السابقة"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold-primary text-white hover:text-noir backdrop-blur-md flex items-center justify-center transition-all border border-white/20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          type="button"
          aria-label="الشريحة التالية"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold-primary text-white hover:text-noir backdrop-blur-md flex items-center justify-center transition-all border border-white/20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            aria-label={`انتقال إلى شريحة ${idx + 1}`}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              currentSlide === idx ? 'w-8 bg-gold-primary' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
