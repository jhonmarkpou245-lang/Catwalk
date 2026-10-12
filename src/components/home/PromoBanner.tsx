'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PromoBanner: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-noir my-8 py-20 sm:py-28" dir="rtl">
      {/* Background with luxury texture/image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop"
          alt="عروض كاتووك"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/90 to-noir/70" />
        <div className="absolute inset-0 border-y border-gold-primary/30 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Gold Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/20 border border-gold-accent/50 text-gold-accent text-xs font-bold uppercase tracking-widest shadow-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>عرض موسمي حصري لفترة محدودة</span>
          </div>

          {/* Heading */}
          <h2 className="font-body text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-wide leading-tight">
            خصم حتى <span className="text-gold-primary">30%</span> على العبايات والقفاطين
          </h2>

          {/* Description */}
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            استمتعي بأفخم التصاميم الملكية المشغولة يدوياً بأسعار استثنائية. أضيفي لمسة من الفخامة الأبدية إلى خزانتك اليوم.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Link href="/categories/abayas">
              <Button
                variant="gold"
                size="lg"
                className="font-bold text-sm sm:text-base px-10 py-4 shadow-gold-lg gap-2"
              >
                <span>تسوّقي الآن</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
