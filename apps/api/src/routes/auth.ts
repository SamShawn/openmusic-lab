import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@openmusic/db';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { redis } from '../lib/redis.js';
import { authenticate } from '../plugins/auth.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default async function authRoutes(app: FastifyInstance) {
  // 注册
  app.post('/register', async (request, reply) => {
    const result = registerSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }
    const { email, password, name } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(409).send({ error: 'Email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
      select: { id: true, email: true, name: true, role: true },
    });

    return reply.status(201).send(user);
  });

  // 登录
  app.post('/login', async (request, reply) => {
    const result = loginSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }
    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    // 签发 Token
    const token = app.jwt.sign({ userId: user.id, role: user.role }, { expiresIn: '7d' });

    // 存入 Redis
    await redis.set(`session:${user.id}`, 'active', 'EX', 7 * 24 * 60 * 60);

    // 设置 HttpOnly Cookie
    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  });

  // 获取当前用户信息
  app.get('/me', { preHandler: [authenticate] }, async (request) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user?.userId },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true },
    });
    return user;
  });

  // 登出
  app.post('/logout', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user?.userId;
    if (userId) {
      await redis.del(`session:${userId}`);
    }
    reply.clearCookie('token', { path: '/' });
    return { success: true };
  });
}
