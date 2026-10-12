export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';
import { Category } from '@/types';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('categories')
          .select('*, products(count)')
          .order('sort_order', { ascending: true });

        if (!error && data) {
          const formatted = data.map((cat: any) => ({
            ...cat,
            products_count: cat.products?.[0]?.count ?? 0,
          }));
          return NextResponse.json({ categories: formatted });
        }
      } catch (err) {
        console.warn('Supabase categories fetch error:', err);
      }
    }

    const categoriesWithCount = mockDb.categories.map((cat) => {
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
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¬Ù„Ø¨ Ø§Ù„ØªØµÙ†ÙŠÙØ§Øª' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, name_en, slug, image, description, parent_id, sort_order } = body;

    if (!name) {
      return NextResponse.json({ error: 'Ø§Ø³Ù… Ø§Ù„ØªØµÙ†ÙŠÙ Ù…Ø·Ù„ÙˆØ¨' }, { status: 400 });
    }

    const finalSlug =
      slug ||
      (name_en ? name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `cat-${Date.now()}`);

    const newCategory: Category = {
      id: `c-${Date.now()}`,
      name,
      name_en: name_en || '',
      slug: finalSlug,
      image: image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      description: description || '',
      parent_id: parent_id || null,
      sort_order: Number(sort_order ?? mockDb.categories.length + 1),
      is_active: true,
      products_count: 0,
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('categories')
          .insert({
            name: newCategory.name,
            name_en: newCategory.name_en,
            slug: newCategory.slug,
            image: newCategory.image,
            description: newCategory.description,
            parent_id: newCategory.parent_id,
            sort_order: newCategory.sort_order,
            is_active: true,
          })
          .select()
          .single();

        if (!error && data) {
          mockDb.categories.push({ ...data, products_count: 0 });
          return NextResponse.json({ success: true, category: data }, { status: 201 });
        }
      } catch (err) {
        console.warn('Supabase category insert error, falling back:', err);
      }
    }

    mockDb.categories.push(newCategory);
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¥Ø¶Ø§ÙØ© Ø§Ù„ØªØµÙ†ÙŠÙ' }, { status: 500 });
  }
}

