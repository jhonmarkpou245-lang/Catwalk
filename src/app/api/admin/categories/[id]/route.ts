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

    const updateData: Record<string, any> = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    if (body.sort_order !== undefined) updateData.sort_order = Number(body.sort_order);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('categories')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          const index = mockDb.categories.findIndex((c) => c.id === id);
          if (index !== -1) {
            mockDb.categories[index] = { ...mockDb.categories[index], ...data };
          }
          return NextResponse.json({ success: true, category: data });
        }
      } catch (err) {
        console.warn('Supabase category update error:', err);
      }
    }

    const index = mockDb.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'التصنيف غير موجود' }, { status: 404 });
    }

    mockDb.categories[index] = {
      ...mockDb.categories[index],
      ...updateData,
    };

    return NextResponse.json({ success: true, category: mockDb.categories[index] });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'تعذر تعديل التصنيف' }, { status: 500 });
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
          .from('categories')
          .delete()
          .eq('id', id);

        if (!error) {
          mockDb.categories = mockDb.categories.filter((c) => c.id !== id);
          return NextResponse.json({ success: true, message: 'تم حذف التصنيف بنجاح' });
        }
      } catch (err) {
        console.warn('Supabase category delete error:', err);
      }
    }

    mockDb.categories = mockDb.categories.filter((c) => c.id !== id);
    return NextResponse.json({ success: true, message: 'تم حذف التصنيف بنجاح' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'تعذر حذف التصنيف' }, { status: 500 });
  }
}
