// ✅ 修复后的 App 调用 Flask 接口（AutoEdit 示例）
import { useState } from 'react';
import axios from 'axios';

function AutoEdit() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const baseUrl = 'http://localhost:5000'; // Electron 打包后仍使用本地后端

  const handleUpload = async () => {
    if (!file) {
      setMessage('❗️请选择一个视频文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    setMessage('📤 上传中...');

    try {
      const res = await axios.post(`${baseUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(`✅ 上传成功，已保存为：${res.data.path}`);
    } catch (error) {
      console.error(error);
      setMessage('❌ 上传失败，请确认 Flask 是否已运行');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h2>🎬 Smart Clipper · 视频上传</h2>
      <input type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} style={{ marginLeft: 12 }}>
        {loading ? '上传中...' : '上传'}
      </button>
      <p style={{ marginTop: 20 }}>{message}</p>
    </div>
  );
}

export default AutoEdit;