import { contextBridge, ipcRenderer } from 'electron';

// 安全地暴露 API 到渲染进程 window 对象
contextBridge.exposeInMainWorld('electronAPI', {
  yourFunction: () => ipcRenderer.invoke('your-function'),

  // 示例：你可以添加更多自定义方法
  ping: () => ipcRenderer.invoke('ping'),
  fetchHistory: () => ipcRenderer.invoke('fetch-history'),
  generateTitle: (text: string) => ipcRenderer.invoke('generate-title', text)
});
