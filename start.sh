#!/bin/bash

echo "🎬 SmartClipper 全系统启动中..."

# 启动后端
cd backend || { echo "❌ 未找到 backend 目录"; exit 1; }

echo "🚀 启动 Flask 后端..."
if [ -d "../.venv" ]; then
  source ../.venv/bin/activate
else
  echo "⚠️ 未找到虚拟环境 .venv，请先创建"
  exit 1
fi
python enhanced_backend.py &

# 启动前端
cd ../frontend || { echo "❌ 未找到 frontend 目录"; exit 1; }

echo "🌐 启动前端 Vite + Electron..."
npm run dev
