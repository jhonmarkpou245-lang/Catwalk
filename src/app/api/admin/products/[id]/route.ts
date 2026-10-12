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
          .from('products')
          .select('*, category:categories(id, name, slug)')
          .eq('id', id)
          .single();

        if (!error && data) {
          return NextResponse.json({ product: data });
        }
      } catch (err) {
        console.warn('Supabase fetch failed for product, using mockDb:', err);
      }
    }

    const product = mockDb.products.find((p) => p.id === id);
    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    const category = mockDb.categories.find((c) => c.id === product.category_id);
    return NextResponse.json({
      product: {
        ...product,
        category: category ? { id: category.id, name: category.name, slug: category.slug } : undefined,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'تعذر جلب بيانات المنتج' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updateData: Record<string, any> = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.sale_price !== undefined) {
      updateData.sale_price = body.sale_price ? Number(body.sale_price) : null;
    }
    if (body.stock !== undefined) updateData.stock = Number(body.stock);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('products')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          const index = mockDb.products.findIndex((p) => p.id === id);
          if (index !== -1) {
            mockDb.products[index] = { ...mockDb.products[index], ...data };
          }
          return NextResponse.json({ success: true, product: data });
        }
      } catch (err) {
        console.warn('Supabase product update error, falling back:', err);
      }
    }

    const index = mockDb.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    mockDb.products[index] = {
      ...mockDb.products[index],
      ...updateData,
    };

    return NextResponse.json({ success: true, product: mockDb.products[index] });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'تعذر تحديث المنتج' }, { status: 500 });
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
          .from('products')
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (!error) {
          const index = mockDb.products.findIndex((p) => p.id === id);
          if (index !== -1) {
            mockDb.products[index].is_active = false;
          }
          return NextResponse.json({ success: true, message: 'تم تعطيل المنتج بنجاح' });
        }
      } catch (err) {
        console.warn('Supabase product delete error, falling back:', err);
      }
    }

    const index = mockDb.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    mockDb.products[index].is_active = false;
    return NextResponse.json({ success: true, message: 'تم تعطيل المنتج بنجاح' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'تعذر حذف المنتج' }, { status: 500 });
  }
}
