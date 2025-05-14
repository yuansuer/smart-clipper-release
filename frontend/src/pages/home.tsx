import { useState } from 'react';
import axios from 'axios';

export default function AutoEdit() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultPath, setResultPath] = useState('');

  const handleUpload = async () => {
    if (!videoFile) return alert('请选择一个视频文件');

    setLoading(true);

    // Step 1: 上传视频
    const formData = new FormData();
    formData.append('file', videoFile);

    const uploadRes = await axios.post('http://localhost:5000/upload', formData);
    const uploadedPath = uploadRes.data.path;

    // Step 2: 调用 auto-edit 接口
    const editRes = await axios.post('http://localhost:5000/auto-edit', {
      input_path: uploadedPath,
      start_time: 0,
      duration: 10
    });

    setResultPath(editRes.data.final_path);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">一键自动剪辑</h2>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? '处理中...' : '开始剪辑'}
      </button>

      {resultPath && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">处理完成 ✅</h3>
          <video src={`http://localhost:5000/${resultPath}`} controls width="600" />
        </div>
      )}
    </div>
  );
}
