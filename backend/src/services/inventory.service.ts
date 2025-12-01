import prisma from '../config/database';
import type { InventoryRecommendation } from '../types';

export class InventoryService {
  /**
   * Get all inventory items with optional filters
   */
  async getAllInventory(filters?: {
    lowStock?: boolean;
    location?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.location) {
      where.location = filters.location;
    }

    if (filters?.lowStock) {
      // Note: This should be done with a raw query or in post-processing
      // For now, we'll filter in code after fetching
      // where.qtyAvailable = { lte: reorderPoint }
    }

    const inventory = await prisma.inventory.findMany({
      where,
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
      orderBy: {
        qtyAvailable: 'asc',
      },
    });

    // Post-process for low stock filtering
    if (filters?.lowStock) {
      return inventory.filter(item => item.qtyAvailable <= item.reorderPoint);
    }

    return inventory;
  }

  /**
   * Get inventory for a specific SKU
   */
  async getInventoryBySku(sku: string, location: string = 'main_warehouse') {
    const inventory = await prisma.inventory.findFirst({
      where: {
        sku,
        location,
      },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!inventory) {
      throw new Error(`Inventory not found for SKU: ${sku}`);
    }

    // Calculate status
    const status = this.getStockStatus(inventory);

    // Get recent sales for AI recommendation
    const recentSales = await prisma.sales.aggregate({
      where: {
        sku,
        soldAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      _sum: {
        qty: true,
      },
    });

    // Get latest forecast
    const forecast = await prisma.forecast.findFirst({
      where: {
        sku,
        horizonDays: 30,
      },
      orderBy: {
        generatedAt: 'desc',
      },
    });

    const forecastedDemand = forecast
      ? (forecast.predictions as any[]).reduce(
          (sum, pred) => sum + pred.predicted_qty,
          0
        )
      : 0;

    // Generate AI recommendation
    const aiRecommendation = this.generateRecommendation({
      qtyAvailable: inventory.qtyAvailable,
      reorderPoint: inventory.reorderPoint,
      safetyStock: inventory.safetyStock,
      leadTimeDays: inventory.leadTimeDays,
      forecastedDemand,
    });

    return {
      ...inventory,
      status,
      recentSales: recentSales._sum.qty || 0,
      forecastedDemand,
      aiRecommendation,
    };
  }

  /**
   * Update inventory quantity
   */
  async updateInventory(params: {
    sku: string;
    qtyChange: number;
    changeType: 'sale' | 'restock' | 'adjustment' | 'return';
    referenceId?: string;
    reason?: string;
    changedBy?: string;
    location?: string;
  }) {
    const { sku, qtyChange, changeType, referenceId, reason, changedBy, location } =
      params;

    const inventory = await prisma.inventory.findFirst({
      where: {
        sku,
        location: location || 'main_warehouse',
      },
    });

    if (!inventory) {
      throw new Error(`Inventory not found for SKU: ${sku}`);
    }

    const newQty = inventory.qtyAvailable + qtyChange;

    if (newQty < 0) {
      throw new Error(`Insufficient inventory. Available: ${inventory.qtyAvailable}`);
    }

    // Update inventory in a transaction
    const result = await prisma.$transaction([
      // Update inventory
      prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          qtyAvailable: newQty,
          lastRestockedAt: changeType === 'restock' ? new Date() : undefined,
        },
      }),
      // Log the change
      prisma.inventoryAuditLog.create({
        data: {
          sku,
          changeType,
          qtyChange,
          qtyBefore: inventory.qtyAvailable,
          qtyAfter: newQty,
          referenceId,
          reason,
          changedBy,
        },
      }),
    ]);

    return result[0];
  }

  /**
   * Reserve inventory for an order
   */
  async reserveInventory(sku: string, qty: number, _orderId: string) {
    const inventory = await prisma.inventory.findFirst({
      where: { sku },
    });

    if (!inventory) {
      throw new Error(`Inventory not found for SKU: ${sku}`);
    }

    if (inventory.qtyAvailable < qty) {
      throw new Error(
        `Insufficient inventory for SKU: ${sku}. Available: ${inventory.qtyAvailable}, Requested: ${qty}`
      );
    }

    return await prisma.inventory.update({
      where: { id: inventory.id },
      data: {
        qtyAvailable: { decrement: qty },
        qtyReserved: { increment: qty },
      },
    });
  }

  /**
   * Get stock status based on thresholds
   */
  private getStockStatus(inventory: any): string {
    if (inventory.qtyAvailable === 0) {
      return 'out_of_stock';
    } else if (inventory.qtyAvailable < inventory.safetyStock) {
      return 'critical';
    } else if (inventory.qtyAvailable < inventory.reorderPoint) {
      return 'low_stock';
    } else {
      return 'in_stock';
    }
  }

  /**
   * Generate reorder recommendation
   */
  private generateRecommendation(params: {
    qtyAvailable: number;
    reorderPoint: number;
    safetyStock: number;
    leadTimeDays: number;
    forecastedDemand: number;
  }): InventoryRecommendation {
    const {
      qtyAvailable,
      reorderPoint,
      safetyStock,
      leadTimeDays,
      forecastedDemand,
    } = params;

    const shouldReorder = qtyAvailable < reorderPoint;

    if (!shouldReorder) {
      return {
        should_reorder: false,
        suggested_qty: 0,
        reasoning: `Current stock (${qtyAvailable}) is above reorder point (${reorderPoint}). No action needed.`,
        urgency: 'low',
      };
    }

    // Calculate suggested quantity
    // Formula: forecasted demand + safety stock - current stock
    const suggestedQty = Math.max(
      forecastedDemand + safetyStock - qtyAvailable,
      safetyStock
    );

    // Determine urgency
    let urgency: 'low' | 'medium' | 'high';
    if (qtyAvailable < safetyStock) {
      urgency = 'high';
    } else if (qtyAvailable < reorderPoint * 0.5) {
      urgency = 'medium';
    } else {
      urgency = 'low';
    }

    const reasoning = `Current stock (${qtyAvailable}) is below reorder point (${reorderPoint}). Based on 30-day forecast of ${forecastedDemand} units and ${leadTimeDays}-day lead time, recommend ordering ${suggestedQty} units to maintain safety stock buffer.`;

    return {
      should_reorder: shouldReorder,
      suggested_qty: suggestedQty,
      reasoning,
      urgency,
    };
  }

  /**
   * Get low stock items
   */
  async getLowStockItems() {
    return await prisma.$queryRaw`
      SELECT i.*, v.price_inr, p.name, p.category
      FROM inventory i
      JOIN variants v ON i.sku = v.sku
      JOIN products p ON v.product_id = p.id
      WHERE i.qty_available < i.reorder_point
      ORDER BY (i.qty_available - i.reorder_point) ASC
    `;
  }
}

export default new InventoryService();
