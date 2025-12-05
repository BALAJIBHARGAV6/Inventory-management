import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

// Create clients lazily to avoid build-time errors
const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

const getGroq = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new Groq({ apiKey });
};

export async function POST(request) {
  try {
    const supabase = getSupabase();
    const groq = getGroq();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    
    const { productId, days = 30 } = await request.json();

    // Fetch product data
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError) throw productError;

    // Fetch sales history (last 90 days)
    const { data: salesData, error: salesError } = await supabase
      .from('sales_analytics')
      .select('*')
      .eq('product_id', productId)
      .gte('date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: true });

    if (salesError) throw salesError;

    // Prepare data for AI analysis
    const salesSummary = salesData?.map(s => ({
      date: s.date,
      qty: s.quantity_sold,
      revenue: s.revenue
    })) || [];

    const totalSold = salesSummary.reduce((sum, s) => sum + s.qty, 0);
    const avgDailySales = totalSold / (salesSummary.length || 1);
    const totalRevenue = salesSummary.reduce((sum, s) => sum + parseFloat(s.revenue), 0);

    // AI Prediction using Groq
    const prompt = `You are an inventory management AI. Analyze this product data and predict demand for the next ${days} days.

Product: ${product.name}
Category: ${product.category_id}
Current Stock: ${product.stock_quantity}
Reorder Level: ${product.reorder_level}
Price: ₹${product.price}

Sales Data (last 90 days):
- Total Units Sold: ${totalSold}
- Average Daily Sales: ${avgDailySales.toFixed(2)}
- Total Revenue: ₹${totalRevenue.toFixed(2)}
- Recent trend: ${JSON.stringify(salesSummary.slice(-7))}

Provide your prediction in this exact JSON format:
{
  "predicted_demand_${days}_days": <number>,
  "confidence_score": <0.0-1.0>,
  "recommended_reorder_quantity": <number>,
  "predicted_stockout_date": "<YYYY-MM-DD or null>",
  "trend": "<increasing|stable|decreasing>",
  "insights": "<brief insight about the prediction>",
  "risk_level": "<low|medium|high>"
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.3,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    // Parse AI response
    let prediction;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      prediction = JSON.parse(jsonMatch[0]);
    } catch {
      // Fallback calculation if AI parsing fails
      const daysUntilStockout = product.stock_quantity / (avgDailySales || 1);
      prediction = {
        [`predicted_demand_${days}_days`]: Math.round(avgDailySales * days),
        confidence_score: 0.7,
        recommended_reorder_quantity: Math.round(avgDailySales * 30),
        predicted_stockout_date: daysUntilStockout < days 
          ? new Date(Date.now() + daysUntilStockout * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : null,
        trend: 'stable',
        insights: 'Prediction based on historical average.',
        risk_level: daysUntilStockout < 14 ? 'high' : daysUntilStockout < 30 ? 'medium' : 'low'
      };
    }

    // Store prediction in database
    await supabase.from('inventory_predictions').insert({
      product_id: productId,
      prediction_date: new Date().toISOString().split('T')[0],
      predicted_demand: prediction[`predicted_demand_${days}_days`],
      confidence_score: prediction.confidence_score,
      recommended_reorder_qty: prediction.recommended_reorder_quantity,
      predicted_stockout_date: prediction.predicted_stockout_date,
    });

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        current_stock: product.stock_quantity,
        reorder_level: product.reorder_level,
      },
      sales_summary: {
        total_sold_90_days: totalSold,
        avg_daily_sales: avgDailySales,
        total_revenue: totalRevenue,
      },
      prediction,
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    let query = supabase
      .from('inventory_predictions')
      .select('*, products(name, stock_quantity)')
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query.limit(50);
    if (error) throw error;

    return NextResponse.json({ predictions: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
