import { FastifyInstance } from 'fastify';
import { supabase } from '../config/database';
import { groqAIService } from '../services/groq-ai.service';
import { productRecommendationsService } from '../services/product-recommendations.service';

// AI Analytics Helper Functions
function calculateHealthScore(pending: number, approved: number, cancelled: number, criticalStock: number): number {
  let score = 100;
  
  // Deduct for pending orders (need attention)
  score -= Math.min(pending * 5, 20);
  
  // Deduct for cancelled orders (lost revenue)
  score -= Math.min(cancelled * 10, 30);
  
  // Deduct for critical stock items
  score -= Math.min(criticalStock * 8, 25);
  
  // Bonus for approved orders
  score += Math.min(approved * 2, 15);
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function generateOrderAnalysis(pending: number, approved: number, cancelled: number): string {
  const total = pending + approved + cancelled;
  if (total === 0) return "No orders yet. Start marketing to attract customers!";
  
  if (pending > approved) {
    return `⚠️ ${pending} orders awaiting approval. Process them quickly to improve customer satisfaction.`;
  }
  if (cancelled > approved) {
    return `🔴 High cancellation rate detected. Review pricing and product availability.`;
  }
  if (approved > pending + cancelled) {
    return `✅ Great job! Most orders are being fulfilled successfully.`;
  }
  return `📊 ${total} total orders processed. Keep monitoring for trends.`;
}

function generateRevenueAnalysis(total: number, avg: number, today: number): string {
  if (total === 0) return "Start selling to track revenue metrics!";
  
  if (today > avg) {
    return `🚀 Today's performance is above average! Revenue: ₹${today.toLocaleString('en-IN')}`;
  }
  if (avg > 100000) {
    return `💎 Premium segment performing well with ₹${Math.round(avg).toLocaleString('en-IN')} average order value.`;
  }
  return `📈 Total revenue: ₹${total.toLocaleString('en-IN')}. Focus on upselling to increase AOV.`;
}

function generateInventoryAnalysis(critical: number, low: number, total: number): string {
  if (critical > 0) {
    return `🚨 URGENT: ${critical} products critically low. Restock immediately to avoid stockouts!`;
  }
  if (low > 0) {
    return `⚠️ ${low} products below reorder level. Plan restocking within this week.`;
  }
  const healthyPercent = ((total - critical - low) / total * 100).toFixed(0);
  return `✅ Inventory health: ${healthyPercent}% of products well-stocked.`;
}

function generateAIRecommendations(
  pending: number, 
  criticalProducts: any[], 
  lowProducts: any[], 
  avgOrderValue: number,
  totalRevenue: number
): string[] {
  const recommendations: string[] = [];
  
  // Order recommendations
  if (pending > 3) {
    recommendations.push(`🎯 Process ${pending} pending orders to improve fulfillment rate and customer satisfaction`);
  }
  
  // Inventory recommendations
  if (criticalProducts.length > 0) {
    const productNames = criticalProducts.slice(0, 2).map(p => p.name).join(', ');
    recommendations.push(`🚨 Urgent restock needed: ${productNames} - critically low inventory`);
  }
  
  if (lowProducts.length > 0) {
    recommendations.push(`📦 Plan restocking for ${lowProducts.length} products approaching reorder level`);
  }
  
  // Revenue recommendations
  if (avgOrderValue < 50000) {
    recommendations.push(`💡 Consider bundling products to increase average order value from ₹${Math.round(avgOrderValue).toLocaleString('en-IN')}`);
  }
  
  if (totalRevenue > 500000) {
    recommendations.push(`🌟 Strong revenue performance! Consider expanding product range in top categories`);
  }
  
  // Default recommendations
  if (recommendations.length === 0) {
    recommendations.push(`📊 Monitor daily sales trends to identify growth opportunities`);
    recommendations.push(`🎯 Focus on customer retention through quality service`);
  }
  
  return recommendations.slice(0, 5);
}

export default async function forecastRoutes(fastify: FastifyInstance) {
  // Generate AI forecast for inventory
  fastify.post('/generate', async (request: any, reply: any) => {
    try {
      const { horizon_days = 30 } = request.body;

      if (![30, 60, 90].includes(horizon_days)) {
        return reply.status(400).send({ error: 'horizon_days must be 30, 60, or 90' });
      }

      if (!supabase) {
        // Mock AI forecast for demo with time-specific variations
        const mockForecasts = {
          30: {
            summary: `IMMEDIATE FORECAST (${horizon_days} days): Current winter season with urgent restocking needs. Focus on fast-moving inventory and critical stock levels.`,
            high_demand_products: ['Sony PlayStation 5', 'Apple iPhone 15 Pro Max'],
            recommendations: [
              '🚨 URGENT: PlayStation 5 critical stock - only 8 units for 30-day demand',
              '📱 SHORT-TERM: Winter electronics surge - increase iPhone inventory',
              '💰 PRICING: Maintain competitive pricing for immediate conversion'
            ],
            confidence_score: 0.92
          },
          60: {
            summary: `STRATEGIC FORECAST (${horizon_days} days): Transitioning to spring season with festival preparation. Medium-term supply chain optimization needed.`,
            high_demand_products: ['Samsung Galaxy S24 Ultra', 'Sony WH-1000XM5'],
            recommendations: [
              '🌟 SEASONAL: Spring festival preparation - Samsung phones trending',
              '🎯 MEDIUM-TERM: Holi festival impact on electronics and fashion',
              '🚛 SUPPLY CHAIN: Optimize for spring season logistics'
            ],
            confidence_score: 0.87
          },
          90: {
            summary: `LONG-TERM VISION (${horizon_days} days): Strategic positioning for summer season and premium brand growth. Focus on market expansion.`,
            high_demand_products: ['Apple MacBook Pro', 'Dyson V15 Detect'],
            recommendations: [
              '💎 PREMIUM FOCUS: Long-term growth in luxury segment - expand MacBook inventory',
              '📈 MARKET EVOLUTION: Premium brands dominating, value brands struggling',
              '🌍 EXPANSION: Consider tier-2 city market penetration'
            ],
            confidence_score: 0.83
          }
        };

        const mockForecast = mockForecasts[horizon_days] || mockForecasts[30];
        return {
          forecast: {
            ...mockForecast,
            horizon_days,
            total_products_analyzed: 19,
            generated_at: new Date().toISOString()
          }
        };
      }

      // Get products with current stock levels
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true });

      if (!products || products.length === 0) {
        return reply.status(404).send({ error: 'No products found' });
      }

      // Use advanced Groq AI service for intelligent forecasting
      const forecast = await groqAIService.generateAdvancedForecast({
        products,
        horizon_days,
        current_date: new Date()
      });

      return { forecast, generated_at: new Date().toISOString() };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get AI recommendations for low stock
  fastify.get('/recommendations', async (_request: any, reply: any) => {
    try {
      if (!supabase) {
        // Mock recommendations for demo
        return {
          recommendations: [
            {
              product_name: 'Gaming Mouse',
              current_stock: 3,
              recommended_order: 25,
              urgency: 'high',
              reasoning: 'Critical stock level - immediate restock required to avoid stockout',
              estimated_days_until_stockout: 2,
              suggested_supplier: 'GameTech Direct'
            },
            {
              product_name: 'Modern Table Lamp',
              current_stock: 12,
              recommended_order: 15,
              urgency: 'medium',
              reasoning: 'Below reorder threshold - restock recommended within 1 week',
              estimated_days_until_stockout: 8,
              suggested_supplier: 'LightCraft Wholesale'
            }
          ],
          generated_at: new Date().toISOString(),
          total_recommendations: 2
        };
      }

      // Get products that need restocking
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true });

      if (!products) {
        return { recommendations: [], total_recommendations: 0 };
      }

      const recommendations = [];

      // Generate recommendations for low stock products
      products.forEach(product => {
        if (product.stock_quantity <= 5) {
          recommendations.push({
            product_name: product.name,
            current_stock: product.stock_quantity,
            recommended_order: Math.max(30, product.reorder_level || 20),
            urgency: 'high',
            reasoning: `Critical stock level - only ${product.stock_quantity} units remaining. Immediate restock required.`,
            estimated_days_until_stockout: Math.max(1, Math.floor(product.stock_quantity / 2)),
            suggested_supplier: `${product.brand} Direct`,
            product_id: product.id,
            current_value: product.price * product.stock_quantity,
            reorder_cost: product.price * Math.max(30, product.reorder_level || 20)
          });
        } else if (product.stock_quantity <= (product.reorder_level || 15)) {
          recommendations.push({
            product_name: product.name,
            current_stock: product.stock_quantity,
            recommended_order: Math.max(20, product.reorder_level || 15),
            urgency: 'medium',
            reasoning: `Below reorder threshold of ${product.reorder_level || 15} units. Restock recommended within 1-2 weeks.`,
            estimated_days_until_stockout: Math.max(5, Math.floor(product.stock_quantity / 3)),
            suggested_supplier: `${product.brand} Wholesale`,
            product_id: product.id,
            current_value: product.price * product.stock_quantity,
            reorder_cost: product.price * Math.max(20, product.reorder_level || 15)
          });
        }
      });

      // Sort by urgency (high first)
      recommendations.sort((a, b) => {
        if (a.urgency === 'high' && b.urgency !== 'high') return -1;
        if (b.urgency === 'high' && a.urgency !== 'high') return 1;
        return a.current_stock - b.current_stock;
      });

      return {
        recommendations,
        generated_at: new Date().toISOString(),
        total_recommendations: recommendations.length,
        summary: {
          high_priority: recommendations.filter(r => r.urgency === 'high').length,
          medium_priority: recommendations.filter(r => r.urgency === 'medium').length,
          total_reorder_cost: recommendations.reduce((sum, r) => sum + r.reorder_cost, 0)
        }
      };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get sales analytics
  fastify.get('/analytics', async (request: any, reply: any) => {
    try {
      const { days = 30 } = request.query;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Get from sales_analytics table
      const { data: salesData } = await supabase
        .from('sales_analytics')
        .select('*')
        .gte('date', startDate);

      const totalRevenue = salesData?.reduce((sum, s) => sum + (parseFloat(s.revenue) || 0), 0) || 0;
      const totalSold = salesData?.reduce((sum, s) => sum + (s.quantity_sold || 0), 0) || 0;

      // Get orders count
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      return {
        period_days: days,
        total_orders: totalOrders || 0,
        total_revenue: totalRevenue,
        total_items_sold: totalSold,
        average_order_value: totalOrders ? totalRevenue / totalOrders : 0,
      };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get predictions history
  fastify.get('/predictions', async (_request: any, reply: any) => {
    try {
      const { data } = await supabase
        .from('inventory_predictions')
        .select('*, products(name, stock_quantity)')
        .order('created_at', { ascending: false })
        .limit(50);

      return { predictions: data || [] };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // AI-powered business analytics insights
  fastify.get('/ai-analytics', async (_request: any, reply: any) => {
    try {
      // Get all orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Get all products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (!orders || !products) {
        return { insights: null, error: 'No data available' };
      }

      // Calculate real metrics
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const approvedOrders = orders.filter(o => o.status === 'approved').length;
      const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Today's metrics
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter(o => o.created_at?.startsWith(today));
      const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

      // Inventory metrics
      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => p.stock_quantity > 5 && p.stock_quantity <= (p.reorder_level || 10));
      const criticalStockProducts = products.filter(p => p.stock_quantity <= 5 && p.stock_quantity > 0);
      const outOfStockProducts = products.filter(p => p.stock_quantity === 0);
      const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);

      // Top selling categories (based on orders)
      const topProducts = products.sort((a, b) => a.stock_quantity - b.stock_quantity).slice(0, 5);

      // Generate AI insights
      const insights = {
        summary: {
          headline: totalOrders > 0 
            ? `Your store has processed ${totalOrders} orders with ₹${totalRevenue.toLocaleString('en-IN')} in revenue`
            : 'Start tracking your business performance with AI-powered insights',
          health_score: calculateHealthScore(pendingOrders, approvedOrders, cancelledOrders, criticalStockProducts.length),
          trend: todayOrders.length > 0 ? 'positive' : 'neutral'
        },
        
        order_insights: {
          total: totalOrders,
          pending: pendingOrders,
          approved: approvedOrders,
          cancelled: cancelledOrders,
          conversion_rate: totalOrders > 0 ? ((approvedOrders / totalOrders) * 100).toFixed(1) : 0,
          cancellation_rate: totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : 0,
          analysis: generateOrderAnalysis(pendingOrders, approvedOrders, cancelledOrders)
        },

        revenue_insights: {
          total_revenue: totalRevenue,
          avg_order_value: Math.round(avgOrderValue),
          today_revenue: todayRevenue,
          today_orders: todayOrders.length,
          projected_monthly: Math.round(todayRevenue * 30),
          analysis: generateRevenueAnalysis(totalRevenue, avgOrderValue, todayRevenue)
        },

        inventory_insights: {
          total_products: totalProducts,
          total_value: totalInventoryValue,
          critical_stock: criticalStockProducts.length,
          low_stock: lowStockProducts.length,
          out_of_stock: outOfStockProducts.length,
          healthy_stock: totalProducts - criticalStockProducts.length - lowStockProducts.length - outOfStockProducts.length,
          critical_products: criticalStockProducts.map(p => ({ name: p.name, stock: p.stock_quantity, value: p.price })),
          analysis: generateInventoryAnalysis(criticalStockProducts.length, lowStockProducts.length, totalProducts)
        },

        ai_recommendations: generateAIRecommendations(
          pendingOrders, 
          criticalStockProducts, 
          lowStockProducts, 
          avgOrderValue,
          totalRevenue
        ),

        performance_metrics: {
          order_fulfillment_rate: totalOrders > 0 ? (((approvedOrders) / totalOrders) * 100).toFixed(1) : 0,
          inventory_health: ((totalProducts - criticalStockProducts.length - outOfStockProducts.length) / totalProducts * 100).toFixed(1),
          revenue_per_product: totalProducts > 0 ? Math.round(totalRevenue / totalProducts) : 0
        },

        generated_at: new Date().toISOString()
      };

      return { insights };
    } catch (error: any) {
      console.error('AI Analytics error:', error);
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get AI product recommendations for new products to add
  fastify.get('/product-recommendations', async (_request: any, reply: any) => {
    try {
      if (!supabase) {
        // Mock recommendations for demo
        return {
          recommendations: [
            {
              name: 'Apple iPad 10th Generation',
              category: 'Electronics',
              price_range: '₹35,000 - ₹45,000',
              expected_demand: 'High',
              priority: 'high',
              reasoning: 'Missing tablet category. High demand from students and professionals.',
              investment_required: 350000,
              expected_roi: '25-30%',
              launch_timing: 'Immediate - before academic season'
            },
            {
              name: 'boAt Airdopes 800 TWS',
              category: 'Electronics', 
              price_range: '₹2,000 - ₹4,000',
              expected_demand: 'Very High',
              priority: 'high',
              reasoning: 'boAt is #1 audio brand in India. TWS earbuds massive growth.',
              investment_required: 80000,
              expected_roi: '40-45%',
              launch_timing: 'Immediate - consistent demand'
            }
          ],
          market_insights: {
            current_trends: ['Health and fitness products seeing 40% growth', 'Audio products showing consistent growth'],
            consumer_behavior: { online_preference: 'Very High (85%)', brand_consciousness: 'High' }
          }
        };
      }

      // Get current products to analyze gaps
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (!products) {
        return { recommendations: [], market_insights: {} };
      }

      // Get current season
      const currentMonth = new Date().getMonth() + 1;
      const season = currentMonth >= 3 && currentMonth <= 5 ? 'summer' :
                   currentMonth >= 6 && currentMonth <= 9 ? 'monsoon' :
                   currentMonth >= 10 && currentMonth <= 11 ? 'post_monsoon' : 'winter';

      // Generate AI recommendations
      const recommendations = await productRecommendationsService.generateRecommendations(
        products,
        season,
        { month: currentMonth }
      );

      return recommendations;
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
}
