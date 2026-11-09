import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 向上寻找根目录的 .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = Fastify({ logger: true });

await app.register(cors, { origin: true, credentials: true });
await app.register(cookie);
await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-prod',
});

app.get('/health', async () => ({ status: 'ok' }));

// 挂载路由
await app.register(authRoutes, { prefix: '/auth' });

const port = Number(process.env.API_PORT) || 4000;

try {
  await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`API listening on http://localhost:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
