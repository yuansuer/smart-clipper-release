import os
import whisper
import openai
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from moviepy.editor import VideoFileClip, concatenate_videoclips, AudioFileClip, CompositeAudioClip
from dotenv import load_dotenv
import time

# 加载 .env 中的环境变量（如 OPENAI_API_KEY）
load_dotenv()

# 初始化 Flask 应用
app = Flask(__name__)
CORS(app)

# 路径设置
UPLOAD_FOLDER = 'uploads'
EXPORT_FOLDER = 'exports'
MUSIC_FOLDER = 'music'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EXPORT_FOLDER, exist_ok=True)
os.makedirs(MUSIC_FOLDER, exist_ok=True)

# 获取 OpenAI 密钥
openai.api_key = os.getenv("OPENAI_API_KEY")

# 健康检查接口
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

# 上传视频
@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'no file'}), 400
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)
    return jsonify({'path': path})

# Whisper 字幕识别
@app.route('/transcribe_whisper', methods=['POST'])
def transcribe_whisper():
    data = request.json
    path = data.get('path')
    if not path or not os.path.exists(path):
        return jsonify({'error': 'Invalid path'}), 400

    model = whisper.load_model("base")
    result = model.transcribe(path)
    return jsonify({'subtitles': result['segments'], 'text': result['text']})

# GPT 生成标题 + 简介
@app.route('/generate_title_gpt', methods=['POST'])
def generate_title_gpt():
    data = request.json
    transcript = data.get('transcript', '')
    if not transcript:
        return jsonify({'error': 'Missing transcript'}), 400

    prompt = f"请根据以下视频内容生成一个吸引人的中文标题和简短文案：{transcript}"

    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        content = completion['choices'][0]['message']['content']
        lines = content.splitlines()
        return jsonify({
            'title': lines[0] if lines else '生成失败',
            'description': '\n'.join(lines[1:]) if len(lines) > 1 else ''
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 分段剪辑 + BGM 合成
@app.route('/clip_and_bgm', methods=['POST'])
def clip_and_add_bgm():
    data = request.json
    path = data.get('path')
    if not path or not os.path.exists(path):
        return jsonify({'error': 'Invalid path'}), 400

    try:
        clip = VideoFileClip(path)
        duration = clip.duration
        segment_length = 5
        subclips = [clip.subclip(i, min(i + segment_length, duration)) for i in range(0, int(duration), segment_length)]
        final_clip = concatenate_videoclips(subclips)

        # 如果 music/bgm.mp3 存在则添加背景音乐
        bgm_path = os.path.join(MUSIC_FOLDER, 'bgm.mp3')
        if os.path.exists(bgm_path):
            bgm_audio = AudioFileClip(bgm_path).subclip(0, final_clip.duration).volumex(0.3)
            final = final_clip.set_audio(CompositeAudioClip([final_clip.audio, bgm_audio]))
        else:
            final = final_clip

        output_path = os.path.join(EXPORT_FOLDER, 'clip_bgm_output.mp4')
        final.write_videofile(output_path, codec='libx264', audio_codec='aac')

        return jsonify({'output': output_path})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 提供导出视频访问
@app.route('/exports/<path:filename>')
def serve_export(filename):
    return send_from_directory(EXPORT_FOLDER, filename)

# ✅ 启动入口
if __name__ == '__main__':
    app.run(debug=True, port=5000)
@app.route('/auto-edit', methods=['POST'])
def auto_edit():
    try:
        ...
    except Exception as e:
        print("Auto edit error:", e)
        return jsonify({'error': str(e)}), 500


import time

@app.route('/api/history', methods=['GET'])
def list_clips():
    clips = []
    for filename in os.listdir(EXPORT_FOLDER):
        if filename.endswith('.mp4'):
            full_path = os.path.join(EXPORT_FOLDER, filename)
            created = os.path.getctime(full_path)
            clips.append({
                'video': full_path,
                'title': os.path.splitext(filename)[0],
                'created_at': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(created))
            })
    return jsonify(clips)

@app.route('/api/delete-clip', methods=['POST'])
def delete_clip():
    data = request.json
    filepath = data.get('filename')
    if not filepath or not os.path.exists(filepath):
        return jsonify({'error': 'Invalid path'}), 400

    try:
        os.remove(filepath)
        return jsonify({'status': 'deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "ok"}), 200

@app.route("/auto-edit", methods=["POST"])
def auto_edit():
    data = request.json
    # 模拟处理
    return jsonify({"status": "success", "message": "剪辑完成"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
