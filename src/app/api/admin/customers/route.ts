export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim().toLowerCase() || '';

    if (isSupabaseConfigured) {
      try {
        let query = supabaseAdmin
          .from('customers')
          .select('*')
          .order('total_spent', { ascending: false });

        if (search) {
          query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (!error && data) {
          return NextResponse.json({ customers: data });
        }
      } catch (err) {
        console.warn('Supabase customers fetch error:', err);
      }
    }

    let items = [...mockDb.customers];

    if (search) {
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.phone.includes(search) ||
          (c.email && c.email.toLowerCase().includes(search))
      );
    }

    // Sort by total spent descending
    items.sort((a, b) => b.total_spent - a.total_spent);

    return NextResponse.json({ customers: items });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¬Ù„Ø¨ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡' }, { status: 500 });
  }
}

