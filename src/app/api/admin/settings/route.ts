export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb, StoreSettings } from '@/lib/mock-db';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin.from('settings').select('*');
        if (!error && data && data.length > 0) {
          const settingsObj: Record<string, any> = {};
          data.forEach((row) => {
            settingsObj[row.key] = row.value;
          });

          // Flatten to convenient unified settings object
          const unified: StoreSettings = {
            store_name: settingsObj.store_profile?.store_name || mockDb.settings.store_name,
            store_name_en: settingsObj.store_profile?.store_name_en || mockDb.settings.store_name_en,
            email: settingsObj.store_profile?.email || mockDb.settings.email,
            phone: settingsObj.store_profile?.phone || mockDb.settings.phone,
            address: settingsObj.store_profile?.address || mockDb.settings.address,
            tax_number: settingsObj.store_profile?.tax_number || mockDb.settings.tax_number,
            shipping_cost: settingsObj.shipping_settings?.shipping_cost ?? mockDb.settings.shipping_cost,
            free_shipping_threshold: settingsObj.shipping_settings?.free_shipping_threshold ?? mockDb.settings.free_shipping_threshold,
            instagram: settingsObj.social_links?.instagram || mockDb.settings.instagram,
            tiktok: settingsObj.social_links?.tiktok || mockDb.settings.tiktok,
            snapchat: settingsObj.social_links?.snapchat || mockDb.settings.snapchat,
            whatsapp: settingsObj.social_links?.whatsapp || mockDb.settings.whatsapp,
          };

          return NextResponse.json({ settings: unified });
        }
      } catch (err) {
        console.warn('Supabase settings fetch failed, falling back:', err);
      }
    }

    return NextResponse.json({ settings: mockDb.settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¬Ù„Ø¨ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Partial<StoreSettings> = await request.json();

    mockDb.settings = {
      ...mockDb.settings,
      ...body,
    };

    if (isSupabaseConfigured) {
      try {
        const profile = {
          store_name: mockDb.settings.store_name,
          store_name_en: mockDb.settings.store_name_en,
          email: mockDb.settings.email,
          phone: mockDb.settings.phone,
          address: mockDb.settings.address,
          tax_number: mockDb.settings.tax_number,
        };

        const shipping = {
          shipping_cost: mockDb.settings.shipping_cost,
          free_shipping_threshold: mockDb.settings.free_shipping_threshold,
        };

        const social = {
          instagram: mockDb.settings.instagram,
          tiktok: mockDb.settings.tiktok,
          snapchat: mockDb.settings.snapchat,
          whatsapp: mockDb.settings.whatsapp,
        };

        await Promise.all([
          supabaseAdmin.from('settings').upsert({ key: 'store_profile', value: profile }, { onConflict: 'key' }),
          supabaseAdmin.from('settings').upsert({ key: 'shipping_settings', value: shipping }, { onConflict: 'key' }),
          supabaseAdmin.from('settings').upsert({ key: 'social_links', value: social }, { onConflict: 'key' }),
        ]);
      } catch (err) {
        console.warn('Supabase settings update failed, mockDb updated:', err);
      }
    }

    return NextResponse.json({ success: true, settings: mockDb.settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª' }, { status: 500 });
  }
}

