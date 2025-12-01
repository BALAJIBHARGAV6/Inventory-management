import { FastifyInstance } from 'fastify';
import prisma from '../config/database';

export default async function suppliersRoutes(fastify: FastifyInstance) {
  // Get all suppliers
  fastify.get('/', async (request, reply) => {
    try {
      const { limit, offset } = request.query as any;

      const suppliers = await prisma.supplier.findMany({
        where: { isActive: true },
        take: limit ? parseInt(limit) : 50,
        skip: offset ? parseInt(offset) : 0,
        orderBy: {
          name: 'asc',
        },
      });

      return reply.send({
        data: suppliers,
        count: suppliers.length,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get supplier by ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;

      const supplier = await prisma.supplier.findUnique({
        where: { id },
        include: {
          supplierPrices: {
            where: {
              OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
            },
          },
        },
      });

      if (!supplier) {
        return reply.status(404).send({ error: 'Supplier not found' });
      }

      return reply.send(supplier);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create supplier
  fastify.post('/', async (request, reply) => {
    try {
      const {
        name,
        contact_person,
        email,
        phone,
        address,
        payment_terms,
        lead_time_days,
        rating,
        notes,
      } = request.body as any;

      if (!name) {
        return reply.status(400).send({ error: 'Name is required' });
      }

      const supplier = await prisma.supplier.create({
        data: {
          name,
          contactPerson: contact_person,
          email,
          phone,
          address,
          paymentTerms: payment_terms,
          leadTimeDays: lead_time_days || 14,
          rating,
          notes,
        },
      });

      return reply.status(201).send(supplier);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Update supplier
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const updates = request.body as any;

      // Convert snake_case to camelCase
      const data: any = {};
      if (updates.name) data.name = updates.name;
      if (updates.contact_person) data.contactPerson = updates.contact_person;
      if (updates.email) data.email = updates.email;
      if (updates.phone) data.phone = updates.phone;
      if (updates.address) data.address = updates.address;
      if (updates.payment_terms) data.paymentTerms = updates.payment_terms;
      if (updates.lead_time_days) data.leadTimeDays = updates.lead_time_days;
      if (updates.rating !== undefined) data.rating = updates.rating;
      if (updates.notes) data.notes = updates.notes;
      if (updates.is_active !== undefined) data.isActive = updates.is_active;

      const supplier = await prisma.supplier.update({
        where: { id },
        data,
      });

      return reply.send(supplier);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Get supplier prices
  fastify.get('/:id/prices', async (request, reply) => {
    try {
      const { id } = request.params as any;

      const prices = await prisma.supplierPrice.findMany({
        where: {
          supplierId: id,
          OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
        },
        orderBy: {
          sku: 'asc',
        },
      });

      return reply.send({
        data: prices,
        count: prices.length,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Add/update supplier price
  fastify.post('/:id/prices', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const { sku, unit_price_inr, moq, valid_until } = request.body as any;

      if (!sku || !unit_price_inr) {
        return reply.status(400).send({ error: 'SKU and unit_price_inr are required' });
      }

      // Check if price already exists
      const existingPrice = await prisma.supplierPrice.findFirst({
        where: {
          supplierId: id,
          sku,
          OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
        },
      });

      if (existingPrice) {
        // Update existing price
        const updated = await prisma.supplierPrice.update({
          where: { id: existingPrice.id },
          data: {
            unitPriceInr: unit_price_inr,
            moq: moq || 1,
            validUntil: valid_until ? new Date(valid_until) : null,
          },
        });

        return reply.send(updated);
      } else {
        // Create new price
        const price = await prisma.supplierPrice.create({
          data: {
            supplierId: id,
            sku,
            unitPriceInr: unit_price_inr,
            moq: moq || 1,
            validUntil: valid_until ? new Date(valid_until) : null,
          },
        });

        return reply.status(201).send(price);
      }
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });
}
