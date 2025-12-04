import { FastifyInstance } from 'fastify';
import { supabase } from '../config/database';
import aiService from '../services/ai.service';

export default async function forecastRoutes(fastify: FastifyInstance) {
  // Generate AI forecast for inventory
  fastify.post('/generate', async (request: any, reply: any) => {
    try {
      const { horizon_days = 30 } = request.body;

      if (![30, 60, 90].includes(horizon_days)) {
        return reply.status(400).send({ error: 'horizon_days must be 30, 60, or 90' });
      }

      // Get products with low stock priority
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true })
        .limit(20);

      // Get sales analytics data
      const { data: salesData } = await supabase
        .from('sales_analytics')
        .select('product_id, quantity_sold, revenue, date')
        .gte('date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      const forecast = await aiService.generateInventoryForecast({
        products: products || [],
        salesHistory: salesData || [],
        horizonDays: horizon_days,
      });

      // Save predictions to database
      if (forecast.forecasts) {
        for (const f of forecast.forecasts) {
          const product = products?.find(p => p.name === f.product_name);
          if (product) {
            await supabase.from('inventory_predictions').insert({
              product_id: product.id,
              prediction_date: new Date(Date.now() + horizon_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              predicted_demand: f.predicted_demand,
              confidence_score: 0.85,
              recommended_reorder_qty: f.restock_needed ? Math.max(20, f.predicted_demand) : 0,
            });
          }
        }
      }

      return { forecast, generated_at: new Date().toISOString() };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get AI recommendations for low stock
  fastify.get('/recommendations', async (_request: any, reply: any) => {
    try {
      const { data: lowStockProducts } = await supabase
        .from('products')
        .select('*')
        .lt('stock_quantity', 10)
        .order('stock_quantity', { ascending: true });

      if (!lowStockProducts || lowStockProducts.length === 0) {
        return { recommendations: [], message: 'All products are well stocked!' };
      }

      const recommendations = await aiService.generateReorderRecommendations(lowStockProducts);
      return { recommendations };
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
}
