import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

connection.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

connection.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

export default connection;
