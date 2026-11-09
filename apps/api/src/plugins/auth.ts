import { FastifyRequest, FastifyReply } from 'fastify';
import { redis } from '../lib/redis.js';

// 修复：正确扩展 @fastify/jwt 的类型
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string; role: string };
    user: { userId: string; role: string };
  }
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // 验证 JWT
    await request.jwtVerify();
    const payload = request.user;

    // 检查 Redis 中是否存在 session（支持注销和封禁）
    const sessionKey = `session:${payload.userId}`;
    const sessionExists = await redis.exists(sessionKey);

    if (!sessionExists) {
      return reply.status(401).send({ error: 'Session expired or revoked' });
    }
  } catch {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
};

export const requireRole = (roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
  };
};
