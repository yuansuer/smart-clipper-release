// src/pages/Settings.tsxSettings.tsx
import { useState } from 'react';

export default function Settings() {
  const [bgm, setBgm] = useState('默认BGM');
  const [keywords, setKeywords] = useState('游戏,精彩,吃鸡');

  const saveParams = () => {
    localStorage.setItem('userBGM', bgm);
    localStorage.setItem('userKeywords', keywords);
    alert('剪辑参数已保存 ✅');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">⚙️ 剪辑参数设置</h1>

      <label className="block mb-2">背景音乐名称：</label>
      <input
        type="text"
        value={bgm}
        onChange={(e) => setBgm(e.target.value)}
        className="border px-2 py-1 rounded w-full mb-4"
      />

      <label className="block mb-2">关键词（逗号分隔）：</label>
      <input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="border px-2 py-1 rounded w-full mb-4"
      />

      <button
        onClick={saveParams}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        保存设置
      </button>
    </div>
  );
}
