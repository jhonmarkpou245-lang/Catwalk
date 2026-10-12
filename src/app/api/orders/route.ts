export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { mockDb } from '@/lib/mock-db';
import { Order } from '@/types';

function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CW-${dateStr}-${randomNum}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      items,
      subtotal,
      shipping_cost = 0,
      discount = 0,
      total,
      payment_method = 'cod',
      coupon_code,
      notes,
    } = body;

    if (!customer_name || !customer_phone || !shipping_address || !city || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'ÙŠØ±Ø¬Ù‰ Ø§Ø³ØªÙƒÙ…Ø§Ù„ Ø¬Ù…ÙŠØ¹ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ù…ÙŠÙ„ ÙˆØ§Ù„Ø¹Ù†ÙˆØ§Ù† ÙˆØ§Ù„Ù…Ù†ØªØ¬Ø§Øª' },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const calculatedSubtotal = Number(subtotal);
    const calculatedShipping = Number(shipping_cost);
    const calculatedDiscount = Number(discount);
    const calculatedTotal = Number(total ?? calculatedSubtotal + calculatedShipping - calculatedDiscount);

    const orderData: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name,
      customer_email: customer_email || null,
      customer_phone,
      shipping_address,
      city,
      items,
      subtotal: calculatedSubtotal,
      shipping_cost: calculatedShipping,
      discount: calculatedDiscount,
      total: calculatedTotal,
      status: 'pending',
      payment_method,
      coupon_code: coupon_code || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data: dbOrder, error } = await supabaseAdmin
          .from('orders')
          .insert({
            order_number: orderNumber,
            customer_name,
            customer_email,
            customer_phone,
            shipping_address,
            city,
            items,
            subtotal: calculatedSubtotal,
            shipping_cost: calculatedShipping,
            discount: calculatedDiscount,
            total: calculatedTotal,
            status: 'pending',
            payment_method,
            coupon_code: coupon_code || null,
            notes: notes || null,
          })
          .select()
          .single();

        if (!error && dbOrder) {
          // Increment coupon used_count if provided
          if (coupon_code) {
            try {
              await supabaseAdmin.rpc('increment_coupon_usage', { coupon_code_input: coupon_code });
            } catch {
              await supabaseAdmin
                .from('coupons')
                .update({ used_count: 1 })
                .eq('code', coupon_code.toUpperCase());
            }
          }

          // Upsert customer
          const { data: existingCustomer } = await supabaseAdmin
            .from('customers')
            .select('*')
            .eq('phone', customer_phone)
            .single();

          if (existingCustomer) {
            await supabaseAdmin
              .from('customers')
              .update({
                orders_count: (existingCustomer.orders_count || 0) + 1,
                total_spent: Number(existingCustomer.total_spent || 0) + calculatedTotal,
              })
              .eq('id', existingCustomer.id);
          } else {
            await supabaseAdmin.from('customers').insert({
              name: customer_name,
              email: customer_email,
              phone: customer_phone,
              orders_count: 1,
              total_spent: calculatedTotal,
            });
          }

          mockDb.orders.unshift(dbOrder as Order);
          return NextResponse.json({ success: true, order: dbOrder }, { status: 201 });
        }
      } catch (err) {
        console.warn('Supabase order creation failed, fallback to mockDb:', err);
      }
    }

    // Update coupon usage in mockDb
    if (coupon_code) {
      const coupon = mockDb.coupons.find((c) => c.code.toUpperCase() === coupon_code.toUpperCase());
      if (coupon) coupon.used_count += 1;
    }

    // Update customer in mockDb
    const existingCust = mockDb.customers.find((c) => c.phone === customer_phone);
    if (existingCust) {
      existingCust.orders_count += 1;
      existingCust.total_spent += calculatedTotal;
    } else {
      mockDb.customers.push({
        id: `cu-${Date.now()}`,
        name: customer_name,
        email: customer_email || null,
        phone: customer_phone,
        orders_count: 1,
        total_spent: calculatedTotal,
        created_at: new Date().toISOString(),
      });
    }

    mockDb.orders.unshift(orderData);
    return NextResponse.json({ success: true, order: orderData }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ø± Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}

