export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    if (isSupabaseConfigured) {
      try {
        let query = supabaseAdmin
          .from('orders')
          .select('*', { count: 'exact' });

        if (status && status !== 'all') {
          query = query.eq('status', status);
        }

        if (search) {
          query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        query = query.order('created_at', { ascending: false }).range(from, to);

        const { data, count, error } = await query;

        if (!error && data) {
          return NextResponse.json({
            orders: data,
            total: count ?? data.length,
            page,
            limit,
          });
        }
      } catch (err) {
        console.warn('Supabase orders fetch error:', err);
      }
    }

    let items = [...mockDb.orders];

    if (status && status !== 'all') {
      items = items.filter((o) => o.status === status);
    }

    if (search) {
      items = items.filter(
        (o) =>
          o.order_number.toLowerCase().includes(search) ||
          o.customer_name.toLowerCase().includes(search) ||
          o.customer_phone.includes(search) ||
          (o.customer_email && o.customer_email.toLowerCase().includes(search))
      );
    }

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginated = items.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      orders: paginated,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¬Ù„Ø¨ Ø§Ù„Ø·Ù„Ø¨Ø§Øª' }, { status: 500 });
  }
}

