from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from openai import OpenAI
import re

# 加载 .env 文件中的环境变量
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=OPENAI_API_KEY)

# 热词列表（可扩展）
hotwords = [
   "和平精英混剪", "吃鸡", "随拍", "生活记录", "家居不锈钢橱柜",  "美食", "vlog", "游戏剪辑", ""
]

# 匹配热词
def extract_keywords(text, keywords):
    return [kw for kw in keywords if kw in text] or ["日常分享"]

# 使用 GPT 生成推荐文案
def generate_gpt_copy(subtitle, matched):
    prompt = f"""
你是一位短视频文案生成专家，请根据以下字幕内容：

---
{subtitle}
---

结合以下话题关键词：{', '.join(matched)}，生成：
1. 一个吸引眼球的视频标题
2. 三个相关的标签（以 # 开头）
3. 一个风格匹配的背景音乐推荐名称

请以 JSON 格式返回，格式如：
{{
  "title": "xxx",
  "tags": ["#标签1", "#标签2"],
  "bgm": "推荐背景音乐名称"
}}
"""

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8
        )
        content = completion.choices[0].message.content
        match = re.search(r'\{.*\}', content, re.DOTALL)
        return eval(match.group()) if match else {"title": "默认标题", "tags": ["#默认"], "bgm": "默认音乐"}
    except Exception as e:
        print("OpenAI 生成失败：", str(e))
        return {"title": "默认标题", "tags": ["#默认"], "bgm": "默认音乐"}

# 推荐接口
@app.route('/generate-topic', methods=['POST'])
def generate_topic():
    data = request.get_json()
    subtitle = data.get('text', '')
    matched = extract_keywords(subtitle, hotwords)
    result = generate_gpt_copy(subtitle, matched)
    return jsonify(result)
    from werkzeug.utils import secure_filename
from moviepy.editor import VideoFileClip
import uuid

UPLOAD_FOLDER = 'uploads'
EXPORT_FOLDER = 'exports'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EXPORT_FOLDER, exist_ok=True)

@app.route('/auto-edit', methods=['POST'])
def auto_edit():
    video = request.files.get('video')
    if not video:
        return jsonify({'error': 'No video uploaded'}), 400

    filename = secure_filename(video.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    video.save(file_path)

    # 假设简单处理：裁剪前10秒
    output_filename = f"{uuid.uuid4().hex}.mp4"
    output_path = os.path.join(EXPORT_FOLDER, output_filename)

    try:
        clip = VideoFileClip(file_path).subclip(0, min(10, VideoFileClip(file_path).duration))
        clip.write_videofile(output_path, codec='libx264', audio_codec='aac')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # 返回视频 URL（假设前端能通过 http://localhost:5000/exports 访问）
    return jsonify({'video_url': f'http://localhost:5000/exports/{output_filename}'})
