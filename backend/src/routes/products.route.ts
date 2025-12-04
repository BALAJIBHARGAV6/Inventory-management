import { FastifyInstance } from 'fastify';
import { supabase } from '../config/database';

export default async function productsRoutes(fastify: FastifyInstance) {
  // Get all products
  fastify.get('/', async (request: any, reply: any) => {
    try {
      const { category, search, minPrice, maxPrice, limit = 20, offset = 0 } = request.query;

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      if (category) query = query.eq('category_id', category);
      if (search) query = query.ilike('name', `%${search}%`);
      if (minPrice) query = query.gte('price', minPrice);
      if (maxPrice) query = query.lte('price', maxPrice);

      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return { products: data, total: count };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get product by ID
  fastify.get('/:id', async (request: any, reply: any) => {
    try {
      const { id } = request.params;

      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return reply.status(404).send({ error: 'Product not found' });

      return { product: data };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create product (admin)
  fastify.post('/', async (request: any, reply: any) => {
    try {
      const productData = request.body;

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;
      return reply.status(201).send({ product: data });
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Update product
  fastify.put('/:id', async (request: any, reply: any) => {
    try {
      const { id } = request.params;
      const updates = request.body;

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { product: data };
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Update stock
  fastify.patch('/:id/stock', async (request: any, reply: any) => {
    try {
      const { id } = request.params;
      const { quantity } = request.body;

      const { data, error } = await supabase
        .from('products')
        .update({ stock_quantity: quantity })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { product: data };
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Get categories
  fastify.get('/categories/all', async (_request: any, reply: any) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return { categories: data };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
}
