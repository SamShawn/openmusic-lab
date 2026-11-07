# OpenMusic Lab

> 基于 ACE Step 1.5 的开源 AI 音乐社区

用户可以在线体验、发布作品、分享 LoRA / 衍生模型、管理版本，并围绕 license & provenance 建立可持续的社区生态。

## 技术栈

- **前端**：Next.js 14 + TypeScript + Tailwind
- **后端**：Fastify + TypeScript
- **Worker**：Node.js + BullMQ
- **数据**：PostgreSQL + Redis
- **搜索**：Meilisearch
- **存储**：S3 / Cloudflare R2 + CDN
- **基建**：Docker + Turborepo + GitHub Actions

## 目录结构

```
openmusic-lab/
├── apps/
│   ├── web/          # Next.js 前端
│   ├── api/          # Fastify 后端
│   └── worker/       # 异步任务 worker
├── packages/
│   ├── db/           # Prisma schema 和 client
│   └── shared/       # 共享类型和工具
├── docker-compose.yml
└── README.md
```

## 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 启动基础设施
docker compose up -d

# 3. 配置环境变量
cp .env.example .env.local

# 4. 启动开发服务
pnpm dev
```

访问：
- 前端：http://localhost:3000
- API：http://localhost:4000
- 健康检查：http://localhost:4000/health

## 脚本

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动所有开发服务 |
| `pnpm build` | 构建所有包 |
| `pnpm lint` | 代码检查 |
| `pnpm typecheck` | 类型检查 |
| `pnpm test` | 运行测试 |
| `pnpm db:migrate` | 运行数据库迁移 |
| `pnpm db:generate` | 生成 Prisma client |
| `pnpm db:studio` | 打开 Prisma Studio |

## License

MIT
