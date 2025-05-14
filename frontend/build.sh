#!/bin/bash

echo "📦 清理旧构建文件..."
rm -rf dist dist-electron

echo "📦 安装依赖..."
npm install

echo "⚙️ 运行 Vite 构建前端..."
npm run build

echo "⚙️ 打包 Electron 应用为 .app..."
npm run dist
