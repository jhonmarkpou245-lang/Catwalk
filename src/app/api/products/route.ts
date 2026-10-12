export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const sort = searchParams.get('sort') || 'newest'; // newest, price-asc, price-desc, featured
    const featured = searchParams.get('featured') === 'true';
    const onSale = searchParams.get('on_sale') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    if (isSupabaseConfigured) {
      try {
        let query = supabaseAdmin
          .from('products')
          .select('*, category:categories(id, name, slug)', { count: 'exact' })
          .eq('is_active', true);

        if (category) {
          // If category is a slug or uuid
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}/.test(category);
          if (isUuid) {
            query = query.eq('category_id', category);
          } else {
            // Find category ID by slug
            const { data: cat } = await supabaseAdmin
              .from('categories')
              .select('id')
              .eq('slug', category)
              .single();
            if (cat) {
              query = query.eq('category_id', cat.id);
            }
          }
        }

        if (featured) {
          query = query.eq('is_featured', true);
        }

        if (onSale) {
          query = query.eq('is_on_sale', true);
        }

        if (search) {
          query = query.or(`name.ilike.%${search}%,name_en.ilike.%${search}%,description.ilike.%${search}%`);
        }

        if (sort === 'price-asc') {
          query = query.order('price', { ascending: true });
        } else if (sort === 'price-desc') {
          query = query.order('price', { ascending: false });
        } else if (sort === 'featured') {
          query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

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
        console.warn('Supabase public products fetch error:', err);
      }
    }

    let items = mockDb.products.filter((p) => p.is_active !== false);

    if (category) {
      const catObj = mockDb.categories.find(
        (c) => c.slug === category || c.id === category
      );
      if (catObj) {
        items = items.filter((p) => p.category_id === catObj.id);
      }
    }

    if (featured) {
      items = items.filter((p) => p.is_featured);
    }

    if (onSale) {
      items = items.filter((p) => p.is_on_sale);
    }

    if (search) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          (p.name_en && p.name_en.toLowerCase().includes(search)) ||
          p.description.toLowerCase().includes(search)
      );
    }

    if (sort === 'price-asc') {
      items.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    } else if (sort === 'price-desc') {
      items.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    } else if (sort === 'featured') {
      items.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    } else {
      items.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
    }

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
    console.error('Error in public products API:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¬Ù„Ø¨ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª' }, { status: 500 });
  }
}

