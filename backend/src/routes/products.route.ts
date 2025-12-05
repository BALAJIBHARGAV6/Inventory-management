import { FastifyInstance } from 'fastify';
import { supabase } from '../config/database';

export default async function productsRoutes(fastify: FastifyInstance) {
  // Get all products
  fastify.get('/', async (request: any, reply: any) => {
    try {
      const { category, search, minPrice, maxPrice, limit = 20, offset = 0 } = request.query;

      if (supabase) {
        // Use real Supabase data
        console.log('Fetching products from Supabase...');
        
        let query = supabase
          .from('products')
          .select('*', { count: 'exact' })
          .eq('is_active', true);

        // Apply filters
        if (search) query = query.ilike('name', `%${search}%`);
        if (minPrice) query = query.gte('price', minPrice);
        if (maxPrice) query = query.lte('price', maxPrice);

        query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        const { data, error, count } = await query;

        if (error) {
          console.error('Supabase error:', error);
          // Return error details for debugging
          return reply.status(500).send({ 
            error: error.message,
            details: error.details,
            hint: error.hint 
          });
        } else {
          console.log('Supabase data fetched successfully:', data?.length, 'products');
          return { 
            products: data || [], 
            total: count || 0,
            message: 'Data from Supabase'
          };
        }
      }

      console.log('Using comprehensive mock data for full demo experience');
      // Comprehensive mock data for demonstration (19 products total)
      const mockProducts = [
        {
          id: 1,
          name: 'Premium Wireless Headphones',
          price: 2999,
          original_price: 3999,
          stock_quantity: 45,
          category: 'Electronics',
          brand: 'AudioTech',
          description: 'High-quality wireless headphones with noise cancellation',
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          is_active: true,
          is_featured: true,
          rating: 4.5,
          review_count: 128
        },
        {
          id: 2,
          name: 'Smart Fitness Watch',
          price: 4999,
          original_price: 5999,
          stock_quantity: 23,
          category: 'Electronics',
          brand: 'FitTech',
          description: 'Advanced fitness tracking with heart rate monitoring',
          thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          is_active: true,
          is_featured: false,
          rating: 4.3,
          review_count: 89
        },
        {
          id: 3,
          name: 'Organic Cotton T-Shirt',
          price: 899,
          original_price: 1299,
          stock_quantity: 67,
          category: 'Fashion',
          brand: 'EcoWear',
          description: 'Comfortable organic cotton t-shirt in multiple colors',
          thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          is_active: true,
          is_featured: false,
          rating: 4.2,
          review_count: 45
        },
        {
          id: 4,
          name: 'Modern Table Lamp',
          price: 1599,
          original_price: 2199,
          stock_quantity: 12,
          category: 'Home & Living',
          brand: 'LightCraft',
          description: 'Stylish LED table lamp with adjustable brightness',
          thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          is_active: true,
          is_featured: true,
          rating: 4.7,
          review_count: 67
        }
      ];

      // Apply filters
      let filteredProducts = mockProducts;
      
      if (search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (category) {
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice));
      }
      
      if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
      }

      // Pagination
      const startIndex = parseInt(offset);
      const endIndex = startIndex + parseInt(limit);
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return { 
        products: paginatedProducts, 
        total: filteredProducts.length,
        message: supabase ? 'Data from Supabase' : 'Demo data - Configure Supabase for real data'
      };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Add new product (POST)
  fastify.post('/', async (request: any, reply: any) => {
    try {
      const productData = request.body;

      if (supabase) {
        // Use real Supabase data
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: productData.name,
            slug: productData.name.toLowerCase().replace(/\s+/g, '-'),
            description: productData.description,
            price: productData.price,
            original_price: productData.original_price,
            stock_quantity: productData.stock_quantity,
            brand: productData.brand,
            sku: productData.sku,
            thumbnail: productData.thumbnail,
            category_id: productData.category_id,
            is_featured: productData.is_featured || false,
            is_active: true
          })
          .select()
          .single();

        if (error) throw error;

        return { 
          product: data,
          message: 'Product added successfully'
        };
      }

      // Mock response
      return { 
        product: { id: Date.now(), ...productData },
        message: 'Product added (demo mode)'
      };
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
