export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';
import { Coupon } from '@/types';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return NextResponse.json({ coupons: data });
        }
      } catch (err) {
        console.warn('Supabase coupons fetch error:', err);
      }
    }

    return NextResponse.json({ coupons: mockDb.coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¬Ù„Ø¨ Ø§Ù„ÙƒÙˆØ¨ÙˆÙ†Ø§Øª' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, discount_type, discount_value, min_order, max_uses, expires_at } = body;

    if (!code || !discount_type || discount_value === undefined) {
      return NextResponse.json(
        { error: 'ÙƒÙˆØ¯ Ø§Ù„ÙƒÙˆØ¨ÙˆÙ†ØŒ Ù†ÙˆØ¹ Ø§Ù„Ø®ØµÙ…ØŒ ÙˆÙ‚ÙŠÙ…Ø© Ø§Ù„Ø®ØµÙ… Ø­Ù‚ÙˆÙ„ Ù…Ø·Ù„ÙˆØ¨Ø©' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: cleanCode,
      discount_type: discount_type === 'fixed' ? 'fixed' : 'percentage',
      discount_value: Number(discount_value),
      min_order: Number(min_order || 0),
      max_uses: Number(max_uses || 0),
      used_count: 0,
      is_active: true,
      expires_at: expires_at ? new Date(expires_at).toISOString() : null,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('coupons')
          .insert({
            code: newCoupon.code,
            discount_type: newCoupon.discount_type,
            discount_value: newCoupon.discount_value,
            min_order: newCoupon.min_order,
            max_uses: newCoupon.max_uses,
            used_count: 0,
            is_active: true,
            expires_at: newCoupon.expires_at,
          })
          .select()
          .single();

        if (!error && data) {
          mockDb.coupons.unshift(data as Coupon);
          return NextResponse.json({ success: true, coupon: data }, { status: 201 });
        }
      } catch (err) {
        console.warn('Supabase coupon insert error:', err);
      }
    }

    mockDb.coupons.unshift(newCoupon);
    return NextResponse.json({ success: true, coupon: newCoupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„ÙƒÙˆØ¨ÙˆÙ†' }, { status: 500 });
  }
}

