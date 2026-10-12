export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';

export async function POST(request: NextRequest) {
  try {
    const { code, cart_total = 0 } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'ÙƒÙˆØ¯ Ø§Ù„ÙƒÙˆØ¨ÙˆÙ† Ù…Ø·Ù„ÙˆØ¨' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    let coupon: any = null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('coupons')
          .select('*')
          .eq('code', cleanCode)
          .single();

        if (!error && data) {
          coupon = data;
        }
      } catch (err) {
        console.warn('Supabase coupon validate query error:', err);
      }
    }

    if (!coupon) {
      coupon = mockDb.coupons.find((c) => c.code.toUpperCase() === cleanCode);
    }

    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: 'ÙƒÙˆØ¯ Ø§Ù„ÙƒÙˆØ¨ÙˆÙ† ØºÙŠØ± ØµØ­ÙŠØ­' },
        { status: 404 }
      );
    }

    if (!coupon.is_active) {
      return NextResponse.json(
        { valid: false, message: 'Ù‡Ø°Ø§ Ø§Ù„ÙƒÙˆØ¨ÙˆÙ† ØºÙŠØ± Ù…ÙØ¹Ù‘Ù„ Ø­Ø§Ù„ÙŠØ§Ù‹' },
        { status: 400 }
      );
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, message: 'Ù‡Ø°Ø§ Ø§Ù„ÙƒÙˆØ¨ÙˆÙ† Ù…Ù†ØªÙ‡ÙŠ Ø§Ù„ØµÙ„Ø§Ø­ÙŠØ©' },
        { status: 400 }
      );
    }

    if (coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json(
        { valid: false, message: 'ØªÙ… Ø§Ø³ØªÙ†ÙØ§Ø¯ Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ù‚ØµÙ‰ Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ù‡Ø°Ø§ Ø§Ù„ÙƒÙˆØ¨ÙˆÙ†' },
        { status: 400 }
      );
    }

    if (coupon.min_order > 0 && cart_total < coupon.min_order) {
      return NextResponse.json(
        {
          valid: false,
          message: `Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ø¯Ù†Ù‰ Ù„ØªØ·Ø¨ÙŠÙ‚ Ù‡Ø°Ø§ Ø§Ù„ÙƒÙˆØ¨ÙˆÙ† Ù‡Ùˆ ${coupon.min_order} Ø±.Ø³`,
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (cart_total * Number(coupon.discount_value)) / 100;
    } else {
      discountAmount = Math.min(Number(coupon.discount_value), cart_total);
    }

    return NextResponse.json({
      valid: true,
      message: 'ØªÙ… ØªÙØ¹ÙŠÙ„ Ø§Ù„ÙƒÙˆØ¨ÙˆÙ† Ø¨Ù†Ø¬Ø§Ø­',
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: Math.round(discountAmount * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„ÙƒÙˆØ¨ÙˆÙ†' }, { status: 500 });
  }
}

