import React, { useState } from 'react'

const GenerateTopic: React.FC = () => {
  const [subtitle, setSubtitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    title: string
    tags: string[]
    bgm: string
  } | null>(null)

  const handleGenerate = async () => {
    if (!subtitle.trim()) {
      alert('请输入字幕内容')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/generate-topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: subtitle })
      })

      if (!response.ok) {
        throw new Error('生成失败，请检查后端接口')
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      alert(`请求失败：${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎯 智能生成标题 + 标签 + 推荐BGM</h1>

      <textarea
        className="w-full p-3 border rounded mb-4"
        rows={5}
        placeholder="请输入字幕文本，例如：这个视频讲解了如何制作美味的蛋炒饭..."
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />

      <div className="flex gap-3 mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? '生成中...' : '生成推荐文案'}
        </button>

        <button
          className="bg-gray-300 text-black px-4 py-2 rounded"
          onClick={() =>
            setSubtitle('这个视频讲解了如何制作美味的蛋炒饭，简单好上手')
          }
        >
          填充测试内容
        </button>
      </div>

      {result && (
        <div className="bg-white shadow-md rounded p-4 border">
          <h2 className="text-lg font-semibold mb-2">📢 推荐结果：</h2>
          <p><strong>标题：</strong> {result.title}</p>
          <p><strong>标签：</strong> {result.tags.join(' ')}</p>
          <p><strong>推荐 BGM：</strong> {result.bgm}</p>
        </div>
      )}
    </div>
  )
}

export default GenerateTopic
