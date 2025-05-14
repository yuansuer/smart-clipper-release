// src/pages/MultiMerge.tsx

import { useState } from 'react';
import axios from 'axios';

export default function MultiMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultPath, setResultPath] = useState('');

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('video/'));
    setFiles(prev => [...prev, ...dropped]);
  };

  const handleMergeAndEdit = async () => {
    if (files.length < 2) return alert('请拖入至少两个视频');
    setLoading(true);

    try {
      const paths: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post('http://localhost:5000/upload', formData);
        paths.push(res.data.path);
      }

      const mergeRes = await axios.post('http://localhost:5000/merge-videos', {
        video_paths: paths,
        output_name: 'merged_final.mp4'
      });

      const autoEditRes = await axios.post('http://localhost:5000/auto-edit', {
        input_path: mergeRes.data.output_path,
        start_time: 0,
        duration: 60
      });

      setResultPath(autoEditRes.data.final_path);
    } catch (err) {
      alert('处理失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🧩 拖拽合并 + 智能剪辑</h2>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-400 rounded p-6 text-center bg-white"
      >
        <p>拖拽多个视频文件到此处</p>
      </div>

      <ul className="mt-4 list-disc pl-6">
        {files.map((f, idx) => <li key={idx}>{f.name}</li>)}
      </ul>

      <button
        onClick={handleMergeAndEdit}
        disabled={loading || files.length < 2}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
      >
        {loading ? '处理中...' : '合并并剪辑'}
      </button>

      {resultPath && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">✅ 成片输出完成</h3>
          <video src={`http://localhost:5000/${resultPath}`} controls width="640" />
        </div>
      )}
    </div>
  );
}
