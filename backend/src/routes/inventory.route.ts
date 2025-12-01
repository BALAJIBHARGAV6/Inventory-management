import { FastifyInstance } from 'fastify';
import inventoryService from '../services/inventory.service';

export default async function inventoryRoutes(fastify: FastifyInstance) {
  // Get all inventory
  fastify.get('/', async (request: any, reply: any) => {
    try {
      const { lowStock, location, limit, offset } = request.query as any;

      const inventory = await inventoryService.getAllInventory({
        lowStock: lowStock === 'true',
        location,
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      });

      return reply.send({
        data: inventory,
        count: inventory.length,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get inventory by SKU
  fastify.get('/:sku', async (request: any, reply: any) => {
    try {
      const { sku } = request.params as any;
      const { location } = request.query as any;

      const inventory = await inventoryService.getInventoryBySku(sku, location);

      return reply.send(inventory);
    } catch (error: any) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // Update inventory
  fastify.put('/:sku', async (request: any, reply: any) => {
    try {
      const { sku } = request.params as any;
      const { qtyChange, changeType, reason, location } = request.body as any;

      const updated = await inventoryService.updateInventory({
        sku,
        qtyChange,
        changeType,
        reason,
        location,
      });

      return reply.send(updated);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Adjust inventory (manual)
  fastify.post('/adjust', async (request: any, reply: any) => {
    try {
      const { sku, qtyChange, reason, changedBy } = request.body as any;

      const updated = await inventoryService.updateInventory({
        sku,
        qtyChange,
        changeType: 'adjustment',
        reason,
        changedBy,
      });

      return reply.status(200).send(updated);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Get low stock items
  fastify.get('/alerts/low-stock', async (_request: any, reply: any) => {
    try {
      const lowStockItems = await inventoryService.getLowStockItems();

      return reply.send({
        data: lowStockItems,
        count: (lowStockItems as any[]).length,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
}
