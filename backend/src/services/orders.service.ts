import { supabase } from '../config/database';

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  product_name?: string;
}

interface Order {
  id?: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  items: OrderItem[];
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

class OrdersService {
  async getAllOrders(params: { status?: string; limit?: number; offset?: number }) {
    const { status, limit = 50, offset = 0 } = params;

    if (!supabase) {
      // Mock orders for demo
      return [
        {
          id: '1',
          order_number: 'ORD23857328',
          customer_name: 'Rajesh Kumar',
          customer_email: 'rajesh@example.com',
          customer_phone: '+91 9876543210',
          shipping_address: {
            street: '123 MG Road',
            city: 'Vijayawada',
            state: 'Andhra Pradesh',
            pincode: '520001',
            country: 'India'
          },
          items: [
            {
              product_id: '1',
              product_name: 'Apple iPhone 15 Pro Max',
              quantity: 1,
              price: 159900
            }
          ],
          total_amount: 159900,
          payment_method: 'Cash on Delivery',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

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
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrderById(id: string) {
    if (!supabase) {
      return {
        id: '1',
        order_number: 'ORD23857328',
        customer_name: 'Rajesh Kumar',
        customer_email: 'rajesh@example.com',
        customer_phone: '+91 9876543210',
        shipping_address: {
          street: '123 MG Road',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          pincode: '520001',
          country: 'India'
        },
        items: [
          {
            product_id: '1',
            product_name: 'Apple iPhone 15 Pro Max',
            quantity: 1,
            price: 159900
          }
        ],
        total_amount: 159900,
        payment_method: 'Cash on Delivery',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await supabase
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
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: string, adminNotes?: string) {
    if (!supabase) {
      return {
        id: orderId,
        status,
        updated_at: new Date().toISOString()
      };
    }

    try {
      // Start a transaction
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_id,
            quantity,
            products (
              stock_quantity
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      // Update order status
      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (updateError) throw updateError;

      // If order is approved, update inventory quantities
      if (status === 'approved' && order.status === 'pending') {
        for (const item of order.order_items) {
          const newQuantity = item.products.stock_quantity - item.quantity;
          
          if (newQuantity < 0) {
            throw new Error(`Insufficient stock for product ${item.product_id}`);
          }

          const { error: inventoryError } = await supabase
            .from('products')
            .update({ stock_quantity: newQuantity })
            .eq('id', item.product_id);

          if (inventoryError) throw inventoryError;
        }
      }

      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) {
      return {
        id: Date.now().toString(),
        ...orderData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderData.order_number,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          shipping_address: orderData.shipping_address,
          total_amount: orderData.total_amount,
          payment_method: orderData.payment_method,
          status: orderData.status || 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrderStats() {
    if (!supabase) {
      return {
        total: 1,
        pending: 1,
        approved: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 159900,
        averageOrderValue: 159900
      };
    }

    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, total_amount');

      if (error) throw error;

      const stats = {
        total: orders?.length || 0,
        pending: orders?.filter(o => o.status === 'pending').length || 0,
        approved: orders?.filter(o => o.status === 'approved').length || 0,
        processing: orders?.filter(o => o.status === 'processing').length || 0,
        shipped: orders?.filter(o => o.status === 'shipped').length || 0,
        delivered: orders?.filter(o => o.status === 'delivered').length || 0,
        cancelled: orders?.filter(o => o.status === 'cancelled').length || 0,
        totalRevenue: orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0,
        averageOrderValue: orders?.length ? (orders.reduce((sum, o) => sum + o.total_amount, 0) / orders.length) : 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
}

export default new OrdersService();
