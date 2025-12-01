import { FastifyInstance } from 'fastify';
import poService from '../services/po.service';

export default async function poRoutes(fastify: FastifyInstance) {
  // Get all purchase orders
  fastify.get('/', async (request, reply) => {
    try {
      const { status, supplierId, limit, offset } = request.query as any;

      const pos = await poService.getAllPOs({
        status,
        supplierId,
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      });

      return reply.send({
        data: pos,
        count: pos.length,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Generate draft PO with AI
  fastify.post('/draft', async (request, reply) => {
    try {
      const { skus, supplier_id, reason, notes, created_by } = request.body as any;

      if (!skus || !Array.isArray(skus) || skus.length === 0) {
        return reply.status(400).send({ error: 'SKUs array is required' });
      }

      if (!supplier_id) {
        return reply.status(400).send({ error: 'supplier_id is required' });
      }

      const po = await poService.generateDraftPO({
        skus,
        supplierId: supplier_id,
        reason: reason || 'Regular reorder',
        notes,
        createdBy: created_by,
      });

      return reply.status(201).send(po);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get PO by ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;

      const po = await poService.getPOById(id);

      return reply.send(po);
    } catch (error: any) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // Approve PO
  fastify.post('/:id/approve', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const { approved_by } = request.body as any;

      if (!approved_by) {
        return reply.status(400).send({ error: 'approved_by is required' });
      }

      const po = await poService.approvePO(id, approved_by);

      return reply.send(po);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Send PO
  fastify.post('/:id/send', async (request, reply) => {
    try {
      const { id } = request.params as any;

      const po = await poService.sendPO(id);

      return reply.send(po);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Receive PO
  fastify.post('/:id/receive', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const { received_by } = request.body as any;

      if (!received_by) {
        return reply.status(400).send({ error: 'received_by is required' });
      }

      const po = await poService.receivePO(id, received_by);

      return reply.send(po);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Update PO
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const updates = request.body;

      const po = await poService.updatePO(id, updates);

      return reply.send(po);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Cancel PO
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;

      const po = await poService.cancelPO(id);

      return reply.send(po);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });
}
