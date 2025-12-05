/**
 * Order Routes
 * @module routes/orders
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../config/database';

// Type definitions
interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  full_name: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
}

interface CreateOrderBody {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}

interface IdParams {
  id: string;
}

interface UserIdParams {
  userId: string;
}

interface StatusUpdateBody {
  status: string;
}

/**
 * Register order routes
 * @param {FastifyInstance} fastify - Fastify instance
 */
export default async function ordersRoutes(fastify: FastifyInstance): Promise<void> {
  
  // Create order
  fastify.post('/', async (request: FastifyRequest<{ Body: CreateOrderBody }>, reply: FastifyReply) => {
    const { items, shippingAddress } = request.body;
    const userId = request.headers['x-user-id'] as string | undefined;

    try {
      const subtotal = items.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0);
      const total = subtotal;
      const orderNumber = `ORD-${Date.now()}`;

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: userId || null,
          status: 'pending',
          payment_status: 'pending',
          subtotal,
          total,
          shipping_address: shippingAddress,
        })
        .select()
        .single();

      if (error) throw error;

      // Insert order items
      const orderItems = items.map((item: OrderItem) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      await supabase.from('order_items').insert(orderItems);

      // Update stock for each product
      for (const item of items) {
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single();
        
        if (product) {
          await supabase
            .from('products')
            .update({ stock_quantity: Math.max(0, product.stock_quantity - item.quantity) })
            .eq('id', item.product_id);
        }
      }

      return { order, orderNumber };
    } catch (error: Error | any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get user orders
  fastify.get('/user/:userId', async (request: FastifyRequest<{ Params: UserIdParams }>, reply: FastifyReply) => {
    const { userId } = request.params;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { orders: data };
    } catch (error: Error | any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get order by ID
  fastify.get('/:id', async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
    const { id } = request.params;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { order: data };
    } catch (error: Error | any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Update order status (admin)
  fastify.patch('/:id/status', async (request: FastifyRequest<{ Params: IdParams; Body: StatusUpdateBody }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { status } = request.body;

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { order: data };
    } catch (error: Error | any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Admin: Get all orders
  fastify.get('/admin/all', async (request: FastifyRequest<{ Querystring: { status?: string; limit?: string; offset?: string } }>, reply: FastifyReply) => {
    const { status, limit = '50', offset = '0' } = request.query || {};

    try {
      if (supabase) {
        console.log('Fetching all orders from Supabase...');
        
        // First, let's do a simple query to check if orders exist
        const { data: simpleCheck, error: checkError } = await supabase
          .from('orders')
          .select('id, order_number, status, total, created_at')
          .limit(10);
        
        console.log('Simple orders check:', { count: simpleCheck?.length, error: checkError?.message });
        if (simpleCheck && simpleCheck.length > 0) {
          console.log('Sample orders:', simpleCheck.slice(0, 3));
        }
        
        let query = supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (
                name,
                price,
                thumbnail
              )
            )
          `, { count: 'exact' })
          .order('created_at', { ascending: false });

        if (status) {
          query = query.eq('status', status);
        }

        query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        const { data, error, count } = await query;
        
        console.log('Full orders query result:', { dataCount: data?.length, error: error?.message, totalCount: count });
        
        if (error) throw error;

        return { orders: data || [], total: count || 0 };
      }

      // Return empty if no database connection
      console.log('No Supabase connection');
      return { orders: [], total: 0 };
    } catch (error: Error | any) {
      console.error('Error fetching orders:', error);
      return reply.status(500).send({ error: error.message });
    }
  });

  // Admin: Get order statistics
  fastify.get('/admin/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (supabase) {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('status, total, created_at');

        if (error) throw error;

        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders?.filter(o => o.created_at.startsWith(today)) || [];

        const stats = {
          total: orders?.length || 0,
          pending: orders?.filter(o => o.status === 'pending').length || 0,
          approved: orders?.filter(o => o.status === 'approved').length || 0,
          processing: orders?.filter(o => o.status === 'processing').length || 0,
          shipped: orders?.filter(o => o.status === 'shipped').length || 0,
          delivered: orders?.filter(o => o.status === 'delivered').length || 0,
          cancelled: orders?.filter(o => o.status === 'cancelled').length || 0,
          totalRevenue: orders?.reduce((sum, o) => sum + o.total, 0) || 0,
          averageOrderValue: orders?.length ? Math.round((orders.reduce((sum, o) => sum + o.total, 0) / orders.length)) : 0,
          todayOrders: todayOrders.length,
          todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0) || 0
        };

        return stats;
      }

      return {
        total: 0,
        pending: 0,
        approved: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        todayOrders: 0,
        todayRevenue: 0
      };
    } catch (error: Error | any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Admin: Approve order (with inventory update)
  fastify.post('/:id/approve', async (request: FastifyRequest<{ Params: IdParams; Body: { adminNotes?: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { adminNotes } = request.body || {};

    try {
      if (!supabase) {
        return {
          order: {
            id,
            status: 'approved',
            admin_notes: adminNotes,
            updated_at: new Date().toISOString()
          }
        };
      }

      // Get order with items
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_id,
            quantity,
            products (
              stock_quantity,
              name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      if (order.status !== 'pending') {
        return reply.status(400).send({ error: 'Order is not in pending status' });
      }

      // Check stock availability
      for (const item of order.order_items) {
        if (item.products.stock_quantity < item.quantity) {
          return reply.status(400).send({ 
            error: `Insufficient stock for ${item.products.name}. Available: ${item.products.stock_quantity}, Required: ${item.quantity}` 
          });
        }
      }

      // Update order status
      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update inventory quantities
      for (const item of order.order_items) {
        const newQuantity = item.products.stock_quantity - item.quantity;
        
        const { error: inventoryError } = await supabase
          .from('products')
          .update({ stock_quantity: newQuantity })
          .eq('id', item.product_id);

        if (inventoryError) throw inventoryError;
      }

      return { order: updatedOrder };
    } catch (error: Error | any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Admin: Reject/Cancel order
  fastify.post('/:id/reject', async (request: FastifyRequest<{ Params: IdParams; Body: { adminNotes?: string; reason?: string } }>, reply: FastifyReply) => {
    const { id } = request.params;

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { order: data };
    } catch (error: Error | any) {
      return reply.status(500).send({ error: error.message });
    }
  });
}
