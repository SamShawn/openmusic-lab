import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenMusic Lab',
  description: '基于 ACE Step 1.5 的开源 AI 音乐社区',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
