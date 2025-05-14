import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';

let mainWindow: BrowserWindow | null = null;

function startBackend() {
  const script = path.join(__dirname, '..', 'backend', 'start.sh');
  const subprocess = spawn('bash', [script], {
    cwd: path.join(__dirname, '..', 'backend'),
    detached: true,
    stdio: 'ignore'
  });
  subprocess.unref();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // ✅ 指定 preload
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const isDev = !app.isPackaged;
  const devURL = 'http://localhost:5173';
  const prodURL = `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(isDev ? devURL : prodURL);
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  // ✅ 注册 IPC 方法
  ipcMain.handle('your-function', async () => {
    console.log('yourFunction called from renderer');
  });

  ipcMain.handle('ping', async () => {
    return 'pong 🏓';
  });

  ipcMain.handle('fetch-history', async () => {
    // 假设返回数据库或 json 数据
    return [{ id: 1, title: '剪辑历史1' }, { id: 2, title: '剪辑历史2' }];
  });

  ipcMain.handle('generate-title', async (event, text: string) => {
    return `生成的标题：${text.slice(0, 10)}...`;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
