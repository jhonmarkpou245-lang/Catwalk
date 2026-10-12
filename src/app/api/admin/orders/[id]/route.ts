export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('orders')
          .select('*')
          .or(`id.eq.${id},order_number.eq.${id}`)
          .single();

        if (!error && data) {
          return NextResponse.json({ order: data });
        }
      } catch (err) {
        console.warn('Supabase order fetch error:', err);
      }
    }

    const order = mockDb.orders.find(
      (o) => o.id === id || o.order_number === id
    );

    if (!order) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'تعذر جلب تفاصيل الطلب' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'حالة الطلب غير صالحة' }, { status: 400 });
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('orders')
          .update(updateData)
          .or(`id.eq.${id},order_number.eq.${id}`)
          .select()
          .single();

        if (!error && data) {
          const index = mockDb.orders.findIndex(
            (o) => o.id === id || o.order_number === id
          );
          if (index !== -1) {
            mockDb.orders[index] = { ...mockDb.orders[index], ...data };
          }
          return NextResponse.json({ success: true, order: data });
        }
      } catch (err) {
        console.warn('Supabase update order error:', err);
      }
    }

    const index = mockDb.orders.findIndex(
      (o) => o.id === id || o.order_number === id
    );
    if (index === -1) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    mockDb.orders[index] = {
      ...mockDb.orders[index],
      ...updateData,
    };

    return NextResponse.json({ success: true, order: mockDb.orders[index] });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'تعذر تحديث حالة الطلب' }, { status: 500 });
  }
}
