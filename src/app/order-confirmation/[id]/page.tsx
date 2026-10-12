import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, Calendar, MapPin, ArrowLeft, Printer, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OrderConfirmationPageProps {
  params: {
    id: string;
  };
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const orderId = params.id || 'CW-849201';
  const currentDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-right" dir="rtl">
      {/* Success Badge & Banner */}
      <div className="bg-white p-8 sm:p-12 rounded-sm border border-black/5 shadow-sm text-center flex flex-col items-center mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <span className="text-xs uppercase font-bold tracking-widest text-gold-dark mb-1">
          تم تأكيد الطلب بنجاح
        </span>
        <h1 className="font-body text-2xl sm:text-4xl font-bold text-noir mb-3">
          شكراً لتسوقكِ من كاتووك!
        </h1>
        <p className="text-xs sm:text-sm text-noir/70 max-w-lg leading-relaxed mb-6">
          لقد استلمنا طلبكِ وسيبدأ فريقنا المتخصص في العناية به وتجهيزه وتغليفه الفاخر على الفور. تم إرسال رسالة تأكيد إلكترونية إلى بريدكِ المسجل.
        </p>

        {/* Order Number pill */}
        <div className="inline-flex items-center gap-3 bg-surface-soft px-5 py-2.5 rounded-sm border border-black/10 text-xs sm:text-sm">
          <span className="text-noir/60 font-medium">رقم الطلب المرجعي:</span>
          <span className="font-bold font-mono text-noir tracking-wider text-base text-gold-dark">
            {orderId}
          </span>
        </div>
      </div>

      {/* Order Tracking & Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-sm border border-black/5 shadow-sm flex items-center gap-3.5">
          <Calendar className="w-6 h-6 text-gold-primary flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-noir">تاريخ الطلب</h4>
            <p className="text-xs text-noir/60 mt-0.5">{currentDate}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-black/5 shadow-sm flex items-center gap-3.5">
          <Truck className="w-6 h-6 text-gold-primary flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-noir">الموعد المتوقع للتوصيل</h4>
            <p className="text-xs text-noir/60 mt-0.5">خلال 2 إلى 4 أيام عمل</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-black/5 shadow-sm flex items-center gap-3.5">
          <Package className="w-6 h-6 text-gold-primary flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-noir">طريقة التغليف</h4>
            <p className="text-xs text-noir/60 mt-0.5">صندوق كاتووك الملكي مع كيس الحفظ</p>
          </div>
        </div>
      </div>

      {/* Summary Details */}
      <div className="bg-white p-6 sm:p-8 rounded-sm border border-black/5 shadow-sm space-y-6 mb-8">
        <h3 className="text-sm font-bold text-noir pb-3 border-b border-black/10">
          تفاصيل التوصيل وعنوان الاستلام
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-noir/80">
          <div className="space-y-1">
            <span className="font-bold text-noir block">عنوان الشحن:</span>
            <p>المملكة العربية السعودية، الرياض</p>
            <p>حي النخيل، شارع التخصصي</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-noir block">طريقة الدفع:</span>
            <p>دفع آمن بالبطاقة الائتمانية (مكتمل)</p>
            <p className="text-emerald-700 font-medium">حالة الدفع: مدفوع بالكامل</p>
          </div>
        </div>
      </div>

      {/* Customer Support Notice */}
      <div className="p-4 bg-gold-light/40 rounded-sm border border-gold-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-gold-primary flex-shrink-0" />
          <p className="text-xs text-noir/80">
            هل لديكِ أي استفسار أو ترغبين بتعديل موعد التوصيل؟ تواصل مع خدمة كبار العملاء على <strong className="text-noir font-bold">920000000</strong>
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            <span>العودة للصفحة الرئيسية</span>
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            استكشاف المزيد من القطع
          </Button>
        </Link>
      </div>
    </div>
  );
}
