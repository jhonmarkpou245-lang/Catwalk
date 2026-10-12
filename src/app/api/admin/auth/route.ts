export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { hashPassword, signAdminToken, verifyAdminToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Ø§Ø³Ù… Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ÙˆÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ù…Ø·Ù„ÙˆØ¨Ø§Ù†' },
        { status: 400 }
      );
    }

    let userAuthenticated = false;
    let adminName = 'Ù…Ø¯ÙŠØ± Ø¨ÙˆØªÙŠÙƒ ÙƒØ§ØªÙˆÙˆÙƒ';

    // 1. Try Supabase admin_users table if configured
    if (isSupabaseConfigured) {
      try {
        const hashedPassword = await hashPassword(password);
        const { data: user, error } = await supabaseAdmin
          .from('admin_users')
          .select('*')
          .eq('username', username)
          .single();

        if (!error && user) {
          // Check password hash
          if (user.password_hash === hashedPassword || user.password_hash === password) {
            userAuthenticated = true;
            adminName = user.name || 'Ù…Ø¯ÙŠØ± Ø§Ù„Ù†Ø¸Ø§Ù…';
          }
        }
      } catch (err) {
        console.warn('Supabase auth query error, checking fallback credentials:', err);
      }
    }

    // 2. Fallback default credentials: admin / admin123 or admin / catwalk2026
    if (!userAuthenticated) {
      if (
        (username === 'admin' && (password === 'admin123' || password === 'catwalk2026')) ||
        (username === 'catwalk' && password === 'admin123')
      ) {
        userAuthenticated = true;
        adminName = 'Ù…Ø¯ÙŠØ± Ø¨ÙˆØªÙŠÙƒ ÙƒØ§ØªÙˆÙˆÙƒ';
      }
    }

    if (!userAuthenticated) {
      return NextResponse.json(
        { error: 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¯Ø®ÙˆÙ„ ØºÙŠØ± ØµØ­ÙŠØ­Ø©. ÙŠØ±Ø¬Ù‰ Ø§Ù„ØªØ£ÙƒØ¯ Ù…Ù† Ø§Ø³Ù… Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ÙˆÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±' },
        { status: 401 }
      );
    }

    // Create JWT Token
    const token = await signAdminToken({
      username,
      name: adminName,
      role: 'admin',
    });

    const response = NextResponse.json({
      success: true,
      message: 'ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¨Ù†Ø¬Ø§Ø­',
      user: { username, name: adminName, role: 'admin' },
    });

    // Set cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = await verifyAdminToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: payload.username,
      name: payload.name,
      role: payload.role,
    },
  });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬ Ø¨Ù†Ø¬Ø§Ø­',
  });

  response.cookies.delete('admin_token');
  return response;
}

