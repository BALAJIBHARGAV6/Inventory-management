import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'created_at-desc';
    const limit = parseInt(searchParams.get('limit')) || 50;

    let query = supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_active', true);

    if (category) query = query.eq('category_id', category);
    if (brand) query = query.eq('brand', brand);
    if (minPrice) query = query.gte('price', parseFloat(minPrice));
    if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
    if (inStock === 'true') query = query.gt('stock_quantity', 0);
    if (featured === 'true') query = query.eq('is_featured', true);

    const [field, order] = sort.split('-');
    query = query.order(field, { ascending: order === 'asc' }).limit(limit);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ products: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
