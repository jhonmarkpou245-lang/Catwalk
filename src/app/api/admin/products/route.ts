export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';
import { Product } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const categoryId = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const status = searchParams.get('status') || ''; // 'active', 'inactive', 'all'

    if (isSupabaseConfigured) {
      try {
        let query = supabaseAdmin
          .from('products')
          .select('*, category:categories(id, name, slug)', { count: 'exact' });

        if (status === 'active') {
          query = query.eq('is_active', true);
        } else if (status === 'inactive') {
          query = query.eq('is_active', false);
        }

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        if (search) {
          query = query.or(`name.ilike.%${search}%,name_en.ilike.%${search}%,slug.ilike.%${search}%`);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        query = query.order('created_at', { ascending: false }).range(from, to);

        const { data, count, error } = await query;

        if (!error && data) {
          return NextResponse.json({
            products: data,
            total: count ?? data.length,
            page,
            limit,
          });
        }
      } catch (err) {
        console.warn('Supabase products fetch failed, using fallback mockDb:', err);
      }
    }

    // Fallback using mockDb
    let items = [...mockDb.products];

    if (status === 'active') {
      items = items.filter((p) => p.is_active !== false);
    } else if (status === 'inactive') {
      items = items.filter((p) => p.is_active === false);
    }

    if (categoryId) {
      items = items.filter((p) => p.category_id === categoryId);
    }

    if (search) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          (p.name_en && p.name_en.toLowerCase().includes(search)) ||
          p.slug.toLowerCase().includes(search)
      );
    }

    // Attach category
    const productsWithCategory = items.map((product) => {
      const cat = mockDb.categories.find((c) => c.id === product.category_id);
      return {
        ...product,
        category: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : undefined,
      };
    });

    const total = productsWithCategory.length;
    const startIndex = (page - 1) * limit;
    const paginated = productsWithCategory.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      products: paginated,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¬Ù„Ø¨ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      name_en,
      slug,
      description,
      price,
      sale_price,
      images,
      category_id,
      sizes,
      colors,
      stock,
      is_featured,
      is_new,
      is_on_sale,
    } = body;

    if (!name || !price || !category_id) {
      return NextResponse.json(
        { error: 'Ø§Ø³Ù… Ø§Ù„Ù…Ù†ØªØ¬ØŒ Ø§Ù„Ø³Ø¹Ø±ØŒ ÙˆØ§Ù„ØªØµÙ†ÙŠÙ Ø­Ù‚ÙˆÙ„ Ù…Ø·Ù„ÙˆØ¨Ø©' },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug ||
      (name_en ? name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `prod-${Date.now()}`);

    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name,
      name_en: name_en || '',
      slug: generatedSlug,
      description: description || '',
      price: Number(price),
      sale_price: sale_price ? Number(sale_price) : null,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'],
      category_id,
      sizes: sizes && sizes.length > 0 ? sizes : ['S', 'M', 'L'],
      colors: colors && colors.length > 0 ? colors : [{ name: 'Ø£Ø³ÙˆØ¯', hex: '#111111' }],
      stock: Number(stock ?? 0),
      is_featured: Boolean(is_featured),
      is_new: Boolean(is_new),
      is_on_sale: Boolean(is_on_sale || (sale_price && Number(sale_price) < Number(price))),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('products')
          .insert({
            name: newProduct.name,
            name_en: newProduct.name_en,
            slug: newProduct.slug,
            description: newProduct.description,
            price: newProduct.price,
            sale_price: newProduct.sale_price,
            images: newProduct.images,
            category_id: newProduct.category_id,
            sizes: newProduct.sizes,
            colors: newProduct.colors,
            stock: newProduct.stock,
            is_featured: newProduct.is_featured,
            is_new: newProduct.is_new,
            is_on_sale: newProduct.is_on_sale,
            is_active: true,
          })
          .select()
          .single();

        if (!error && data) {
          // Also keep mockDb in sync
          mockDb.products.unshift(data as Product);
          return NextResponse.json({ success: true, product: data }, { status: 201 });
        }
      } catch (err) {
        console.warn('Supabase product insert failed, fallback to mockDb:', err);
      }
    }

    // Save to mockDb
    mockDb.products.unshift(newProduct);
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ù…Ù†ØªØ¬' }, { status: 500 });
  }
}

