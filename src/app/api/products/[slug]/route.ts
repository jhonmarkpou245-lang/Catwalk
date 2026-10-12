export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('products')
          .select('*, category:categories(id, name, slug)')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .eq('is_active', true)
          .single();

        if (!error && data) {
          return NextResponse.json({ product: data });
        }
      } catch (err) {
        console.warn('Supabase product slug query error:', err);
      }
    }

    const product = mockDb.products.find(
      (p) => (p.slug === slug || p.id === slug) && p.is_active !== false
    );

    if (!product) {
      return NextResponse.json({ error: 'المنتج غير متوفر' }, { status: 404 });
    }

    const category = mockDb.categories.find((c) => c.id === product.category_id);

    return NextResponse.json({
      product: {
        ...product,
        category: category ? { id: category.id, name: category.name, slug: category.slug } : undefined,
      },
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json({ error: 'تعذر جلب تفاصيل المنتج' }, { status: 500 });
  }
}
