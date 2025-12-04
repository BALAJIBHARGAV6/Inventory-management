/**
 * Inventory Routes
 * @module routes/inventory
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import inventoryService from '../services/inventory.service';

interface InventoryQuery {
  lowStock?: string;
  limit?: string;
  offset?: string;
}

interface IdParams {
  id: string;
}

interface StockUpdateBody {
  qtyChange: number;
}

/**
 * Register inventory routes
 * @param {FastifyInstance} fastify - Fastify instance
 */
export default async function inventoryRoutes(fastify: FastifyInstance): Promise<void> {
  
  // Get all inventory with optional low stock filter
  fastify.get('/', async (request: FastifyRequest<{ Querystring: InventoryQuery }>, reply: FastifyReply) => {
    try {
      const { lowStock, limit, offset } = request.query;
      const inventory = await inventoryService.getAllInventory({
        lowStock: lowStock === 'true',
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0,
      });
      return { data: inventory, count: inventory.length };
    } catch (error: Error | any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get inventory stats summary
  fastify.get('/stats', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await inventoryService.getInventoryStats();
      return stats;
    } catch (error: Error | any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get low stock alerts
  fastify.get('/alerts/low-stock', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const items = await inventoryService.getLowStockItems();
      return { data: items, count: items.length };
    } catch (error: Error | any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get product by ID
  fastify.get('/:id', async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const inventory = await inventoryService.getInventoryById(id);
      return inventory;
    } catch (error: Error | any) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // Update product stock
  fastify.put('/:id/stock', async (request: FastifyRequest<{ Params: IdParams; Body: StockUpdateBody }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const { qtyChange } = request.body;
      const updated = await inventoryService.updateInventory({ productId: id, qtyChange });
      return updated;
    } catch (error: Error | any) {
      return reply.status(400).send({ error: error.message });
    }
  });
}
