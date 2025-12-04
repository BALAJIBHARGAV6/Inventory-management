import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';

dotenv.config();

// Routes
import authRoutes from './routes/auth.route';
import productsRoutes from './routes/products.route';
import ordersRoutes from './routes/orders.route';
import forecastRoutes from './routes/forecast.route';
import inventoryRoutes from './routes/inventory.route';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Register plugins
async function registerPlugins() {
  await server.register(helmet, { contentSecurityPolicy: false });

  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  });
}

// Auth decorator for protected routes
server.decorate('authenticate', async function (request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

// Register routes
async function registerRoutes() {
  server.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  await server.register(authRoutes, { prefix: '/api/auth' });
  await server.register(productsRoutes, { prefix: '/api/products' });
  await server.register(ordersRoutes, { prefix: '/api/orders' });
  await server.register(forecastRoutes, { prefix: '/api/forecast' });
  await server.register(inventoryRoutes, { prefix: '/api/inventory' });
}

// Error handler
server.setErrorHandler((error: any, _request: any, reply: any) => {
  server.log.error(error);
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    error: {
      message: error.message || 'Internal Server Error',
      statusCode,
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
    console.log(`🚀 Server running at http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();

export default server;
