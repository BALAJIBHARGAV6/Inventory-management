import { Worker, Queue } from 'bullmq';
import connection from '../config/redis';
import forecastService from '../services/forecast.service';
import inventoryService from '../services/inventory.service';

interface ForecastJob {
  sku: string;
  horizonDays: 30 | 60 | 90;
}

interface LowStockAlertJob {
  sku: string;
  recommendation: any;
}

// Create forecast queue
export const forecastQueue = new Queue('forecast-queue', { connection });

// Create notification queue
export const notificationQueue = new Queue('notification-queue', { connection });

// Forecast Worker
export const forecastWorker = new Worker<ForecastJob>(
  'forecast-queue',
  async job => {
    console.log(`[Forecast Worker] Processing job ${job.id} for SKU: ${job.data.sku}`);

    try {
      const { sku, horizonDays } = job.data;

      // Generate forecast
      const forecastResult = await forecastService.generateForecast({
        sku,
        horizonDays,
        forceRefresh: true,
      });

      console.log(`[Forecast Worker] Forecast generated for SKU: ${sku}`);

      // Check if reorder needed
      if (forecastResult.reorder_recommendation.should_reorder) {
        // Add low-stock alert job to notification queue
        await notificationQueue.add('low-stock-alert', {
          sku,
          recommendation: forecastResult.reorder_recommendation,
        });

        console.log(`[Forecast Worker] Low stock alert queued for SKU: ${sku}`);
      }

      return {
        success: true,
        sku,
        horizonDays,
        totalPredicted: forecastResult.summary.total_predicted,
      };
    } catch (error: any) {
      console.error(`[Forecast Worker] Error processing SKU ${job.data.sku}:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 3, // Process 3 forecasts concurrently
    limiter: {
      max: 10, // Maximum 10 jobs
      duration: 60000, // Per minute (to respect OpenAI rate limits)
    },
  }
);

// Notification Worker
export const notificationWorker = new Worker<LowStockAlertJob>(
  'notification-queue',
  async job => {
    console.log(`[Notification Worker] Processing alert for SKU: ${job.data.sku}`);

    try {
      const { sku, recommendation } = job.data;

      // Get inventory details
      const inventory = await inventoryService.getInventoryBySku(sku);

      // In a real app, send email/Slack notification here
      console.log(`
      ⚠️  LOW STOCK ALERT ⚠️
      SKU: ${sku}
      Current Stock: ${inventory.qtyAvailable}
      Suggested Order: ${recommendation.suggested_qty} units
      Reasoning: ${recommendation.reasoning}
      Urgency: ${recommendation.urgency}
      `);

      // TODO: Implement email/Slack notification
      // await sendEmail({
      //   to: 'admin@yourcompany.com',
      //   subject: `Low Stock Alert: ${sku}`,
      //   body: notification message
      // });

      return {
        success: true,
        sku,
        notificationSent: true,
      };
    } catch (error: any) {
      console.error(
        `[Notification Worker] Error processing alert for ${job.data.sku}:`,
        error
      );
      throw error;
    }
  },
  {
    connection,
  }
);

// Schedule daily forecast generation for all active SKUs
export async function scheduleDailyForecasts() {
  try {
    // Get all low-stock items (they need forecasts most urgently)
    const lowStockItems = (await inventoryService.getLowStockItems()) as any[];

    console.log(`[Scheduler] Scheduling forecasts for ${lowStockItems.length} low-stock items`);

    for (const item of lowStockItems) {
      await forecastQueue.add(
        'daily-forecast',
        {
          sku: item.sku,
          horizonDays: 30,
        },
        {
          removeOnComplete: 100, // Keep last 100 completed jobs
          removeOnFail: 50, // Keep last 50 failed jobs
        }
      );
    }

    console.log('[Scheduler] Daily forecast jobs scheduled successfully');
  } catch (error) {
    console.error('[Scheduler] Error scheduling daily forecasts:', error);
  }
}

// Worker event handlers
forecastWorker.on('completed', job => {
  console.log(`[Forecast Worker] Job ${job.id} completed successfully`);
});

forecastWorker.on('failed', (job, err) => {
  console.error(`[Forecast Worker] Job ${job?.id} failed:`, err);
});

notificationWorker.on('completed', job => {
  console.log(`[Notification Worker] Job ${job.id} completed successfully`);
});

notificationWorker.on('failed', (job, err) => {
  console.error(`[Notification Worker] Job ${job?.id} failed:`, err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Workers] Shutting down gracefully...');
  await forecastWorker.close();
  await notificationWorker.close();
  await connection.quit();
  process.exit(0);
});

console.log('✅ Forecast and Notification workers started');

// Schedule daily forecasts (run at midnight)
setInterval(
  () => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      scheduleDailyForecasts();
    }
  },
  60000 // Check every minute
);
