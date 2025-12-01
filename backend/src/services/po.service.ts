import prisma from '../config/database';
import openaiService from './openai.service';
import forecastService from './forecast.service';

export class POService {
  /**
   * Generate AI-powered purchase order draft
   */
  async generateDraftPO(params: {
    skus: string[];
    supplierId: string;
    reason: string;
    notes?: string;
    createdBy?: string;
  }) {
    const { skus, supplierId, reason, notes, createdBy } = params;

    // Get supplier details
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: {
        supplierPrices: {
          where: {
            sku: { in: skus },
            OR: [
              { validUntil: null },
              { validUntil: { gte: new Date() } },
            ],
          },
        },
      },
    });

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    // Get inventory and forecast for each SKU
    const lineItemsData = await Promise.all(
      skus.map(async sku => {
        const inventory = await prisma.inventory.findFirst({
          where: { sku },
          include: {
            variant: {
              include: { product: true },
            },
          },
        });

        if (!inventory) {
          throw new Error(`Inventory not found for SKU: ${sku}`);
        }

        const forecast = await forecastService.getLatestForecast(sku, 30);
        const forecastedDemand = forecast?.summary.total_predicted || 0;

        const supplierPrice = supplier.supplierPrices.find((sp: any) => sp.sku === sku);
        const unitPrice = supplierPrice
          ? Number(supplierPrice.unitPriceInr)
          : Number(inventory.variant.costPriceInr || 0);

        return {
          sku,
          productName: `${inventory.variant.product.name} - ${JSON.stringify(
            inventory.variant.attributes
          )}`,
          currentStock: inventory.qtyAvailable,
          forecastedDemand,
          safetyStock: inventory.safetyStock,
          unitPrice,
        };
      })
    );

    // Generate PO draft using OpenAI
    const poDraft = await openaiService.generatePODraft({
      supplier: {
        name: supplier.name,
        email: supplier.email || '',
        leadTimeDays: supplier.leadTimeDays,
      },
      lineItems: lineItemsData,
      reason,
    });

    // Generate PO number
    const lastPO = await prisma.purchaseOrder.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const lastNumber = lastPO
      ? parseInt(lastPO.poNumber.split('-')[2] || '0')
      : 0;
    const poNumber = `PO-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(
      4,
      '0'
    )}`;

    // Build line items from AI recommendations
    const lineItems = poDraft.recommended_quantities.map(rec => {
      const itemData = lineItemsData.find(item => item.sku === rec.sku);
      return {
        sku: rec.sku,
        product_name: itemData?.productName || rec.sku,
        qty: rec.qty,
        unit_price_inr: itemData?.unitPrice || 0,
        total_inr: rec.total_inr,
      };
    });

    // Create draft PO
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId,
        status: 'draft',
        lineItems: lineItems as any,
        totalAmountInr: poDraft.total_order_value_inr,
        expectedDeliveryDate: new Date(poDraft.expected_delivery_date),
        aiReasoning: poDraft.reasoning,
        draftEmailSubject: poDraft.email_subject,
        draftEmailBody: poDraft.email_body,
        notes,
        createdBy,
      },
      include: {
        supplier: true,
      },
    });

    return purchaseOrder;
  }

  /**
   * Get all purchase orders with filters
   */
  async getAllPOs(filters?: {
    status?: string;
    supplierId?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.supplierId) {
      where.supplierId = filters.supplierId;
    }

    const pos = await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });

    return pos;
  }

  /**
   * Get PO by ID
   */
  async getPOById(id: string) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
      },
    });

    if (!po) {
      throw new Error('Purchase order not found');
    }

    return po;
  }

  /**
   * Approve purchase order
   */
  async approvePO(id: string, approvedBy: string) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
    });

    if (!po) {
      throw new Error('Purchase order not found');
    }

    if (po.status !== 'draft' && po.status !== 'pending_approval') {
      throw new Error(`Cannot approve PO with status: ${po.status}`);
    }

    return await prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: 'approved',
        approvedBy,
        approvedAt: new Date(),
      },
    });
  }

  /**
   * Mark PO as sent
   */
  async sendPO(id: string) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
    });

    if (!po) {
      throw new Error('Purchase order not found');
    }

    if (po.status !== 'approved') {
      throw new Error('Only approved POs can be sent');
    }

    return await prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });
  }

  /**
   * Receive PO and update inventory
   */
  async receivePO(id: string, receivedBy: string) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
    });

    if (!po) {
      throw new Error('Purchase order not found');
    }

    if (po.status !== 'sent') {
      throw new Error('Only sent POs can be received');
    }

    const lineItems = po.lineItems as any[];

    // Update inventory for each line item
    await prisma.$transaction([
      ...lineItems.map(item =>
        prisma.inventory.updateMany({
          where: { sku: item.sku },
          data: {
            qtyAvailable: { increment: item.qty },
            lastRestockedAt: new Date(),
          },
        })
      ),
      ...lineItems.map(item =>
        prisma.inventoryAuditLog.create({
          data: {
            sku: item.sku,
            changeType: 'restock',
            qtyChange: item.qty,
            qtyBefore: 0, // Will be calculated
            qtyAfter: 0, // Will be calculated
            referenceId: po.poNumber,
            reason: `Received from PO ${po.poNumber}`,
            changedBy: receivedBy,
          },
        })
      ),
      prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: 'received',
          receivedAt: new Date(),
        },
      }),
    ]);

    return await this.getPOById(id);
  }

  /**
   * Update PO
   */
  async updatePO(id: string, updates: any) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
    });

    if (!po) {
      throw new Error('Purchase order not found');
    }

    if (po.status !== 'draft') {
      throw new Error('Only draft POs can be updated');
    }

    return await prisma.purchaseOrder.update({
      where: { id },
      data: updates,
    });
  }

  /**
   * Cancel PO
   */
  async cancelPO(id: string) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
    });

    if (!po) {
      throw new Error('Purchase order not found');
    }

    if (po.status === 'received') {
      throw new Error('Cannot cancel received PO');
    }

    return await prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });
  }
}

export default new POService();
