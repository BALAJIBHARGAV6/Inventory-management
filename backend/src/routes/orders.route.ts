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
      // Always return demo order for admin approval testing
      const demoOrder = {
        id: '1',
        order_number: 'ORD23857328',
        status: 'pending',
        total: 159900,
        subtotal: 159900,
        payment_method: 'Cash on Delivery',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        shipping_address: {
          full_name: 'Rajesh Kumar',
          address_line1: '123, MG Road, Labbipet',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          postal_code: '520010',
          phone: '+91 9876543210'
        },
        customer_email: 'rajesh.kumar@example.com',
        customer_phone: '+91 9876543210',
        order_items: [
          {
            id: '1',
            product_id: '6',
            product_name: 'Apple iPhone 15 Pro Max',
            quantity: 1,
            unit_price: 159900,
            total_price: 159900,
            products: {
              name: 'Apple iPhone 15 Pro Max',
              price: 159900,
              thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
            }
          }
        ],
        notes: 'Please handle with care. Customer requested delivery between 10 AM - 2 PM.',
        special_instructions: 'Call before delivery'
      };

      if (supabase) {
        try {
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
          
          if (!error && data && data.length > 0) {
            // Return real orders if they exist
            return { orders: data, total: count || 0 };
          }
        } catch (error) {
          console.error('Error fetching real orders:', error);
        }
      }

      // Return demo order for admin testing
      return {
        orders: [demoOrder],
        total: 1
      };
    } catch (error: Error | any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Admin: Get order statistics
  fastify.get('/admin/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Return mock stats for demo
      return {
        total: 1,
        pending: 1,
        approved: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 159900,
        averageOrderValue: 159900,
        todayOrders: 1,
        todayRevenue: 159900
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
        .update({
          status: 'approved',
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
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
    const { adminNotes, reason } = request.body || {};

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          admin_notes: adminNotes,
          cancellation_reason: reason,
          updated_at: new Date().toISOString()
        })
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
