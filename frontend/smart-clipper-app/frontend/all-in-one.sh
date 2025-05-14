#!/bin/bash
# 一键打包 SmartClipper 应用 + 上传 .dmg + 生成并上传 latest-mac.json 到 Cloudflare R2

VERSION=$(date +"%Y.%m.%d.%H%M")
DMG_NAME="SmartClipper-${VERSION}.dmg"
LOG_FILE="upload_log.txt"
R2_URL="https://pub-685ef086e21840f7b283d9739be7987d.r2.dev"

echo "🛠 [构建中] SmartClipper v$VERSION" | tee -a "$LOG_FILE"
cd ../frontend

# 构建前端 + 打包应用（确保 electron-builder 已配置）
npm run build && npx electron-builder --mac --config ./electron-builder.json

cd ..
# 重命名打包产物
if [ -f "./frontend/dist/SmartClipper.dmg" ]; then
    mv ./frontend/dist/SmartClipper.dmg "$DMG_NAME"
else
    echo "❌ 未找到打包产物 ./frontend/dist/SmartClipper.dmg" | tee -a "$LOG_FILE"
    exit 1
fi

# 上传 .dmg 到 R2
echo "📤 上传 $DMG_NAME 到 R2..." | tee -a "$LOG_FILE"
rclone copy "$DMG_NAME" r2:smartclipper-app --progress

# 生成 latest-mac.json
echo "📦 生成 latest-mac.json..." | tee -a "$LOG_FILE"
SHA512=$(shasum -a 512 "$DMG_NAME" | awk '{print $1}')
SIZE=$(stat -f%z "$DMG_NAME")
DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat <<EOF > latest-mac.json
{
  "version": "$VERSION",
  "files": [
    {
      "url": "$R2_URL/$DMG_NAME",
      "sha512": "$SHA512",
      "size": $SIZE
    }
  ],
  "path": "$DMG_NAME",
  "releaseDate": "$DATE"
}
EOF

# 上传 manifest
echo "☁️ 上传 latest-mac.json..." | tee -a "$LOG_FILE"
rclone copy latest-mac.json r2:smartclipper-app --progress

# 总结
echo "✅ 所有操作完成：" | tee -a "$LOG_FILE"
echo "🔗 下载链接: $R2_URL/$DMG_NAME" | tee -a "$LOG_FILE"
echo "🔗 更新清单: $R2_URL/latest-mac.json" | tee -a "$LOG_FILE"
