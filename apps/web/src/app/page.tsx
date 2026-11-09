export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">OpenMusic Lab</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        基于 ACE Step 1.5 的开源 AI 音乐社区
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/generate"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          开始创作
        </a>
        <a href="/loras" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
          浏览 LoRA
        </a>
      </div>
    </main>
  );
}
