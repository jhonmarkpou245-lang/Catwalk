export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updateData: Record<string, any> = { ...body };
    if (body.discount_value !== undefined) updateData.discount_value = Number(body.discount_value);
    if (body.min_order !== undefined) updateData.min_order = Number(body.min_order);
    if (body.max_uses !== undefined) updateData.max_uses = Number(body.max_uses);
    if (body.code) updateData.code = body.code.trim().toUpperCase();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('coupons')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          const index = mockDb.coupons.findIndex((c) => c.id === id);
          if (index !== -1) {
            mockDb.coupons[index] = { ...mockDb.coupons[index], ...data };
          }
          return NextResponse.json({ success: true, coupon: data });
        }
      } catch (err) {
        console.warn('Supabase coupon update error:', err);
      }
    }

    const index = mockDb.coupons.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'الكوبون غير موجود' }, { status: 404 });
    }

    mockDb.coupons[index] = {
      ...mockDb.coupons[index],
      ...updateData,
    };

    return NextResponse.json({ success: true, coupon: mockDb.coupons[index] });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ error: 'تعذر تعديل الكوبون' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabaseAdmin
          .from('coupons')
          .delete()
          .eq('id', id);

        if (!error) {
          mockDb.coupons = mockDb.coupons.filter((c) => c.id !== id);
          return NextResponse.json({ success: true, message: 'تم حذف الكوبون بنجاح' });
        }
      } catch (err) {
        console.warn('Supabase coupon delete error:', err);
      }
    }

    mockDb.coupons = mockDb.coupons.filter((c) => c.id !== id);
    return NextResponse.json({ success: true, message: 'تم حذف الكوبون بنجاح' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: 'تعذر حذف الكوبون' }, { status: 500 });
  }
}
