import prisma from '../config/database';
import openaiService from './openai.service';
import type { ForecastResult } from '../types';

export class ForecastService {
  /**
   * Generate forecast for a SKU
   */
  async generateForecast(params: {
    sku: string;
    horizonDays: 30 | 60 | 90;
    forceRefresh?: boolean;
  }): Promise<ForecastResult> {
    const { sku, horizonDays, forceRefresh } = params;

    // Check if recent forecast exists (within last 24 hours)
    if (!forceRefresh) {
      const existingForecast = await prisma.forecast.findFirst({
        where: {
          sku,
          horizonDays,
          generatedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        orderBy: {
          generatedAt: 'desc',
        },
      });

      if (existingForecast) {
        return {
          predictions: existingForecast.predictions as any,
          summary: (existingForecast.accuracyMetrics as any) || {},
          explanation: existingForecast.aiExplanation || '',
          reorder_recommendation: { should_reorder: false, suggested_qty: 0, reasoning: '' },
        };
      }
    }

    // Fetch historical sales (last 90 days)
    const historicalSales = await prisma.sales.findMany({
      where: {
        sku,
        soldAt: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        soldAt: true,
        qty: true,
        priceInr: true,
      },
      orderBy: {
        soldAt: 'asc',
      },
    });

    if (historicalSales.length === 0) {
      throw new Error(`No historical sales data found for SKU: ${sku}`);
    }

    // Get current inventory
    const inventory = await prisma.inventory.findFirst({
      where: { sku },
    });

    if (!inventory) {
      throw new Error(`No inventory record found for SKU: ${sku}`);
    }

    // Generate forecast using OpenAI
    const forecastResult = await openaiService.generateForecast({
      sku,
      historicalSales: historicalSales.map((s: any) => ({
        date: s.soldAt.toISOString().split('T')[0],
        qty: s.qty,
        price: Number(s.priceInr),
      })),
      horizonDays,
      currentInventory: inventory.qtyAvailable,
      safetyStock: inventory.safetyStock,
    });

    // Save forecast to database
    await prisma.forecast.create({
      data: {
        sku,
        horizonDays,
        predictions: forecastResult.predictions as any,
        accuracyMetrics: forecastResult.summary as any,
        aiExplanation: forecastResult.explanation,
        modelVersion: 'gpt-4-turbo',
      },
    });

    return forecastResult;
  }

  /**
   * Get latest forecast for a SKU
   */
  async getLatestForecast(sku: string, horizonDays: 30 | 60 | 90 = 30) {
    const forecast = await prisma.forecast.findFirst({
      where: {
        sku,
        horizonDays,
      },
      orderBy: {
        generatedAt: 'desc',
      },
    });

    if (!forecast) {
      return null;
    }

    // Calculate summary metrics
    const predictions = forecast.predictions as any[];
    const summary = {
      total_predicted: predictions.reduce((sum, p) => sum + p.predicted_qty, 0),
      daily_average:
        predictions.reduce((sum, p) => sum + p.predicted_qty, 0) / predictions.length,
      peak_day: predictions.reduce((max, p) =>
        p.predicted_qty > max.predicted_qty ? p : max
      ),
    };

    return {
      id: forecast.id,
      sku: forecast.sku,
      horizonDays: forecast.horizonDays,
      generatedAt: forecast.generatedAt,
      predictions: forecast.predictions,
      summary,
      aiExplanation: forecast.aiExplanation,
      accuracyMetrics: forecast.accuracyMetrics,
    };
  }

  /**
   * Get forecast history for accuracy tracking
   */
  async getForecastHistory(sku: string, limit: number = 10) {
    const forecasts = await prisma.forecast.findMany({
      where: { sku },
      orderBy: {
        generatedAt: 'desc',
      },
      take: limit,
    });

    return forecasts.map((f: any) => ({
      id: f.id,
      generatedAt: f.generatedAt,
      horizonDays: f.horizonDays,
      accuracyMetrics: f.accuracyMetrics,
    }));
  }

  /**
   * Calculate forecast accuracy (MAPE)
   */
  async calculateAccuracy(forecastId: string) {
    const forecast = await prisma.forecast.findUnique({
      where: { id: forecastId },
    });

    if (!forecast) {
      throw new Error('Forecast not found');
    }

    const predictions = forecast.predictions as any[];
    const startDate = new Date(predictions[0].date);
    const endDate = new Date(predictions[predictions.length - 1].date);

    // Get actual sales during forecast period
    const actualSales = await prisma.sales.groupBy({
      by: ['soldAt'],
      where: {
        sku: forecast.sku,
        soldAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        qty: true,
      },
    });

    // Calculate MAPE
    let totalError = 0;
    let count = 0;

    predictions.forEach(pred => {
      const actual = actualSales.find(
        (s: any) => s.soldAt.toISOString().split('T')[0] === pred.date
      );
      if (actual && actual._sum.qty) {
        const error = Math.abs(actual._sum.qty - pred.predicted_qty) / actual._sum.qty;
        totalError += error;
        count++;
      }
    });

    const mape = count > 0 ? (totalError / count) * 100 : null;

    return {
      mape,
      dataPoints: count,
      confidence: mape ? (mape < 20 ? 'high' : mape < 35 ? 'medium' : 'low') : 'unknown',
    };
  }

  /**
   * Batch generate forecasts for multiple SKUs
   */
  async batchGenerateForecasts(skus: string[], horizonDays: 30 | 60 | 90 = 30) {
    const results = [];

    for (const sku of skus) {
      try {
        const forecast = await this.generateForecast({
          sku,
          horizonDays,
          forceRefresh: false,
        });
        results.push({ sku, success: true, forecast });
      } catch (error: any) {
        results.push({ sku, success: false, error: error.message });
      }
    }

    return results;
  }
}

export default new ForecastService();
