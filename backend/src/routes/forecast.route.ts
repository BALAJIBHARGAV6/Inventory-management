import { FastifyInstance } from 'fastify';
import forecastService from '../services/forecast.service';

export default async function forecastRoutes(fastify: FastifyInstance) {
  // Generate forecast for SKU(s)
  fastify.post('/generate', async (request: any, reply: any) => {
    try {
      const { skus, horizon_days } = request.body as any;

      if (!skus || !Array.isArray(skus) || skus.length === 0) {
        return reply.status(400).send({ error: 'SKUs array is required' });
      }

      const horizonDays = horizon_days || 30;
      if (![30, 60, 90].includes(horizonDays)) {
        return reply.status(400).send({ error: 'horizon_days must be 30, 60, or 90' });
      }

      // Generate forecasts for all SKUs
      const results = await forecastService.batchGenerateForecasts(
        skus,
        horizonDays
      );

      return reply.send({
        results,
        generated_at: new Date().toISOString(),
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get latest forecast for a SKU
  fastify.get('/:sku', async (request: any, reply: any) => {
    try {
      const { sku } = request.params as any;
      const { horizon } = request.query as any;

      const horizonDays = horizon ? parseInt(horizon) : 30;
      if (![30, 60, 90].includes(horizonDays)) {
        return reply.status(400).send({ error: 'horizon must be 30, 60, or 90' });
      }

      const forecast = await forecastService.getLatestForecast(sku, horizonDays as 30 | 60 | 90);

      if (!forecast) {
        return reply.status(404).send({
          error: 'No forecast found for this SKU. Generate one first.',
        });
      }

      return reply.send(forecast);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get forecast history for accuracy tracking
  fastify.get('/:sku/history', async (request: any, reply: any) => {
    try {
      const { sku } = request.params as any;
      const { limit } = request.query as any;

      const history = await forecastService.getForecastHistory(
        sku,
        limit ? parseInt(limit) : 10
      );

      return reply.send({
        sku,
        history,
        count: history.length,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Calculate forecast accuracy
  fastify.get('/accuracy/:forecastId', async (request, reply) => {
    try {
      const { forecastId } = request.params as any;

      const accuracy = await forecastService.calculateAccuracy(forecastId);

      return reply.send(accuracy);
    } catch (error: any) {
      return reply.status(404).send({ error: error.message });
    }
  });
}
