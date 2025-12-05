import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client lazily to avoid build-time errors
const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    return null;
  }
  
  return createClient(url, key);
};

export async function GET(request) {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return NextResponse.json({ cart: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    
    const { userId, productId, quantity = 1 } = await request.json();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select('*, products(*)')
        .single();
    } else {
      result = await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id: productId, quantity })
        .select('*, products(*)')
        .single();
    }

    if (result.error) throw result.error;
    return NextResponse.json({ item: result.data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    
    const { cartItemId, quantity } = await request.json();

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select('*, products(*)')
      .single();

    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (cartItemId) {
      await supabase.from('cart_items').delete().eq('id', cartItemId);
    } else if (userId) {
      await supabase.from('cart_items').delete().eq('user_id', userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
