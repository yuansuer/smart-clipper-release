// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AutoEdit from './pages/AutoEdit';
import ClipHistory from './pages/ClipHistory';
import GenerateTopic from './pages/GenerateTopic';

function App() {
  return (
    <Router>
      <Routes>
        {/* 智能一键剪辑界面 */}
        <Route path="/auto-edit" element={<AutoEdit />} />

        {/* 剪辑历史记录界面 */}
        <Route path="/clip-history" element={<ClipHistory />} />

        {/* 热点标题/文案生成界面 */}
        <Route path="/generate-topic" element={<GenerateTopic />} />

        {/* 默认路由跳转到一键剪辑 */}
        <Route path="/" element={<Navigate to="/auto-edit" />} />

        {/* 未匹配路由全部重定向 */}
        <Route path="*" element={<Navigate to="/auto-edit" />} />
      </Routes>
    </Router>
  );
}

export default App;
