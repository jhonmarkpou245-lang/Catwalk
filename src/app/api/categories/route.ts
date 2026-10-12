export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('categories')
          .select('*, products(count)')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (!error && data) {
          const formatted = data.map((cat: any) => ({
            ...cat,
            products_count: cat.products?.[0]?.count ?? 0,
          }));
          return NextResponse.json({ categories: formatted });
        }
      } catch (err) {
        console.warn('Supabase public categories query failed:', err);
      }
    }

    const categoriesWithCount = mockDb.categories
      .filter((c) => c.is_active !== false)
      .map((cat) => {
        const count = mockDb.products.filter(
          (p) => p.category_id === cat.id && p.is_active !== false
        ).length;
        return {
          ...cat,
          products_count: count,
        };
      });

    return NextResponse.json({ categories: categoriesWithCount });
  } catch (error) {
    console.error('Error fetching public categories:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¬Ù„Ø¨ Ø§Ù„ÙØ¦Ø§Øª' }, { status: 500 });
  }
}

