'use client';

import React, { useState, useEffect } from 'react';
import { Save, Store, Truck, Share2, Shield, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { StoreSettings } from '@/lib/mock-db';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: 'كاتووك للأزياء الراقية',
    store_name_en: 'Catwalk Haute Couture',
    email: 'concierge@catwalk-couture.sa',
    phone: '+966 11 456 7890',
    address: 'طريق الأمير محمد بن عبدالعزيز (التحلية)، الرياض، المملكة العربية السعودية',
    tax_number: '31045892300003',
    shipping_cost: 35,
    free_shipping_threshold: 500,
    instagram: 'https://instagram.com/catwalk_sa',
    tiktok: 'https://tiktok.com/@catwalk_sa',
    snapchat: 'https://snapchat.com/add/catwalk_sa',
    whatsapp: '+966501234567',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('تم حفظ إعدادات المتجر بنجاح');
      } else {
        toast.error(data.error || 'تعذر حفظ الإعدادات');
      }
    } catch {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-neutral-400">
        جاري تحميل الإعدادات...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">إعدادات البوتيك والمتجر</h1>
        <p className="text-xs text-neutral-500 mt-1">
          تخصيص البيانات العامة، تكاليف وسياسات الشحن، وقنوات التواصل الاجتماعي
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Profile */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3 mb-2">
            <Store className="w-5 h-5 text-[#D4942B]" />
            <h2 className="text-sm font-bold text-neutral-900">بيانات المتجر والبوتيك</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                اسم المتجر بالعربية *
              </label>
              <input
                type="text"
                required
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                الاسم بالإنجليزية
              </label>
              <input
                type="text"
                value={settings.store_name_en}
                onChange={(e) => setSettings({ ...settings, store_name_en: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                البريد الإلكتروني الرسمي لخدمة العملاء
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                رقم هاتف الاتصال
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                الرقم الضريبي للمنشأة
              </label>
              <input
                type="text"
                value={settings.tax_number}
                onChange={(e) => setSettings({ ...settings, tax_number: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                عنوان البوتيك والمعرض
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3 mb-2">
            <Truck className="w-5 h-5 text-[#D4942B]" />
            <h2 className="text-sm font-bold text-neutral-900">سياسات الشحن والتوصيل</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                رسوم التوصيل القياسية (ر.س)
              </label>
              <input
                type="number"
                min="0"
                value={settings.shipping_cost}
                onChange={(e) =>
                  setSettings({ ...settings, shipping_cost: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                الحد الأدنى للشحن المجاني (ر.س)
              </label>
              <input
                type="number"
                min="0"
                value={settings.free_shipping_threshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    free_shipping_threshold: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3 mb-2">
            <Share2 className="w-5 h-5 text-[#D4942B]" />
            <h2 className="text-sm font-bold text-neutral-900">روابط منصات التواصل الاجتماعي</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                رابط إنستغرام (Instagram)
              </label>
              <input
                type="url"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none font-mono text-xs"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                رابط تيك توك (TikTok)
              </label>
              <input
                type="url"
                value={settings.tiktok}
                onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none font-mono text-xs"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                سناب شات (Snapchat)
              </label>
              <input
                type="url"
                value={settings.snapchat}
                onChange={(e) => setSettings({ ...settings, snapchat: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none font-mono text-xs"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                رقم واتساب المباشر (WhatsApp)
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4942B] outline-none font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#D4942B] hover:bg-[#B87F22] text-black font-semibold text-xs transition-all shadow-gold disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ كافة الإعدادات'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
