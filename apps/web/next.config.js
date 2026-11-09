const path = require('path');
const dotenv = require('dotenv');

// 解析根目录的 .env 文件
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@openmusic/shared'],
};

module.exports = nextConfig;
