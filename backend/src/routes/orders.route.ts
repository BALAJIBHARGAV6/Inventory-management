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
}
