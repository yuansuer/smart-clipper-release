import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    electronAPI: {
      ping: () => Promise<string>;
      fetchHistory: () => Promise<any>;
      generateTitle: (text: string) => Promise<string>;
    };
  }
}

const ClipEditor: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'ok' | 'fail'>('checking');
  const [loading, setLoading] = useState(false);
  const [clipResult, setClipResult] = useState<string | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await window.electronAPI.ping();
        if (res.includes('pong')) {
          setBackendStatus('ok');
        } else {
          setBackendStatus('fail');
        }
      } catch (err) {
        setBackendStatus('fail');
      }
    };
    checkBackend();
  }, []);

  const handleClip = async () => {
    setLoading(true);
    try {
      const title = await window.electronAPI.generateTitle('剪辑视频测试');
      setClipResult(title);
    } catch (err) {
      setClipResult('❌ 剪辑失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎬 SmartClipper 剪辑工具</h1>

      {backendStatus === 'checking' && <p>🔍 正在检查后端服务状态...</p>}
      {backendStatus === 'fail' && <p style={{ color: 'red' }}>❌ 后端未响应，请检查 Flask 是否已启动</p>}
      {backendStatus === 'ok' && (
        <>
          <button onClick={handleClip} disabled={loading}>
            {loading ? '剪辑中...' : '开始剪辑'}
          </button>
          {clipResult && <p>🎯 剪辑结果：{clipResult}</p>}
        </>
      )}
    </div>
  );
};

export default ClipEditor;
