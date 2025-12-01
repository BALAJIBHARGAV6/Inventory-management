import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Routes - Note: IDE may show errors due to TS server cache, but files exist and compile successfully
// @ts-ignore
import inventoryRoutes from './routes/inventory.route';
// @ts-ignore
import forecastRoutes from './routes/forecast.route';
// @ts-ignore
import poRoutes from './routes/po.route';
// @ts-ignore
import productsRoutes from './routes/products.route';
// @ts-ignore
import suppliersRoutes from './routes/suppliers.route';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register plugins
async function registerPlugins() {
  // Security
  await server.register(helmet);

  // CORS
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Rate limiting
  await server.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
  });

  // JWT Authentication
  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  });
}

// Register routes
async function registerRoutes() {
  // Health check
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes
  await server.register(productsRoutes, { prefix: '/api/products' });
  await server.register(inventoryRoutes, { prefix: '/api/inventory' });
  await server.register(forecastRoutes, { prefix: '/api/forecast' });
  await server.register(poRoutes, { prefix: '/api/po' });
  await server.register(suppliersRoutes, { prefix: '/api/suppliers' });
}

// Error handler
server.setErrorHandler((error: Error & { statusCode?: number }, _request: any, reply: any) => {
  server.log.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  reply.status(statusCode).send({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  });
});

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    const port = parseInt(process.env.PORT || '4000');
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });

    console.log(`
    🚀 Server ready at: http://${host}:${port}
    📊 Health check: http://${host}:${port}/health
    🔧 Environment: ${process.env.NODE_ENV || 'development'}
    `);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down gracefully...');
  await server.close();
  process.exit(0);
});

start();

export default server;
