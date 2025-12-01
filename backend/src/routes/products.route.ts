import { FastifyInstance } from 'fastify';
import prisma from '../config/database';

export default async function productsRoutes(fastify: FastifyInstance) {
  // Get all products
  fastify.get('/', async (request, reply) => {
    try {
      const { category, limit, offset } = request.query as any;

      const where: any = {
        isActive: true,
      };

      if (category) {
        where.category = category;
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          variants: {
            where: { isActive: true },
            include: {
              inventory: true,
            },
          },
        },
        take: limit ? parseInt(limit) : 20,
        skip: offset ? parseInt(offset) : 0,
      });

      const total = await prisma.product.count({ where });

      return reply.send({
        data: products,
        pagination: {
          limit: limit ? parseInt(limit) : 20,
          offset: offset ? parseInt(offset) : 0,
          total,
        },
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get product by ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          variants: {
            where: { isActive: true },
            include: {
              inventory: true,
            },
          },
        },
      });

      if (!product) {
        return reply.status(404).send({ error: 'Product not found' });
      }

      return reply.send(product);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create product (admin only)
  fastify.post('/', async (request, reply) => {
    try {
      const { sku, name, description, category, brand, images } = request.body as any;

      if (!sku || !name) {
        return reply.status(400).send({ error: 'SKU and name are required' });
      }

      const product = await prisma.product.create({
        data: {
          sku,
          name,
          description,
          category,
          brand,
          images: images || [],
        },
      });

      return reply.status(201).send(product);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Update product
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const updates = request.body as any;

      const product = await prisma.product.update({
        where: { id },
        data: updates,
      });

      return reply.send(product);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Delete product (soft delete)
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;

      const product = await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      return reply.send(product);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Get variants
  fastify.get('/variants/all', async (request, reply) => {
    try {
      const { limit, offset } = request.query as any;

      const variants = await prisma.variant.findMany({
        where: { isActive: true },
        include: {
          product: true,
          inventory: true,
        },
        take: limit ? parseInt(limit) : 50,
        skip: offset ? parseInt(offset) : 0,
      });

      return reply.send({
        data: variants,
        count: variants.length,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create variant
  fastify.post('/variants', async (request, reply) => {
    try {
      const {
        product_id,
        sku,
        attributes,
        price_inr,
        compare_at_price_inr,
        cost_price_inr,
        weight_grams,
      } = request.body as any;

      if (!product_id || !sku || !price_inr) {
        return reply
          .status(400)
          .send({ error: 'product_id, sku, and price_inr are required' });
      }

      const variant = await prisma.variant.create({
        data: {
          productId: product_id,
          sku,
          attributes: attributes || {},
          priceInr: price_inr,
          compareAtPriceInr: compare_at_price_inr,
          costPriceInr: cost_price_inr,
          weightGrams: weight_grams,
        },
      });

      // Create inventory record for this variant
      await prisma.inventory.create({
        data: {
          sku: variant.sku,
          qtyAvailable: 0,
        },
      });

      return reply.status(201).send(variant);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });
}
