from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from ai_pipeline import JARVISPipelineController
from camera_stream import CameraStreamManager
import logging
import time

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for localhost frontend

# Initialize Pipeline Controller & Camera Stream Manager
pipeline_controller = JARVISPipelineController()
camera_manager = CameraStreamManager(pipeline_controller)

logging.basicConfig(level=logging.INFO)

@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('index.html')


@app.route('/video_feed', methods=['GET'])
def video_feed():
    """
    HTTP Multipart MJPEG live video stream endpoint.
    Serves 30 FPS camera feed annotated with YOLO bounding box HUD & JARVIS HUD layer.
    """
    return Response(
        camera_manager.generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@app.route('/api/telemetry', methods=['GET'])
def get_telemetry():
    """
    Returns full telemetry payload:
    - Detected object & YOLO confidence
    - MATCH / MISMATCH / UNCERTAIN decision status
    - Per-node AI pipeline execution status and latencies
    - Current experiment procedure step info
    - JARVIS synthesized voice alert message
    - System hardware metrics (GPU VRAM, FPS)
    """
    data = pipeline_controller.process_frame_and_evaluate()
    return jsonify({"success": True, "data": data})

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "online": True,
        "mode": "DEMO" if pipeline_controller.demo_mode else "LIVE_AI",
        "models": {
            "yolo": "LOADED (Local PyTorch / Ultralytics)",
            "qwen3_vl": "READY (Vision-Language Local)",
            "rag": "CONNECTED (ChromaDB Local SOP Docs)",
            "decision_engine": "ACTIVE",
            "qwen3": "READY (Synthesizer)"
        },
        "streaming": {
            "ip_stream": pipeline_controller.ip_streaming,
            "recording": pipeline_controller.is_recording,
            "url": pipeline_controller.stream_url
        }
    })

@app.route('/api/demo', methods=['POST'])
def toggle_demo():
    body = request.get_json() or {}
    enable = body.get("enabled", not pipeline_controller.demo_mode)
    pipeline_controller.set_demo_mode(enable)
    return jsonify({"success": True, "demo_mode": pipeline_controller.demo_mode})

@app.route('/api/step/next', methods=['POST'])
def next_step():
    proc = pipeline_controller.next_step()
    return jsonify({"success": True, "procedure": proc})

@app.route('/api/step/prev', methods=['POST'])
def prev_step():
    proc = pipeline_controller.prev_step()
    return jsonify({"success": True, "procedure": proc})

@app.route('/api/recording/toggle', methods=['POST'])
def toggle_recording():
    is_rec = camera_manager.toggle_recording()
    return jsonify({"success": True, "is_recording": is_rec})

@app.route('/api/query', methods=['POST'])
def handle_query():
    body = request.get_json() or {}
    user_query = body.get("query", "")
    if not user_query:
        return jsonify({"success": False, "error": "Query empty"}), 400

    telemetry = pipeline_controller.process_frame_and_evaluate(custom_prompt=user_query)
    return jsonify({
        "success": True,
        "query": user_query,
        "jarvis_response": telemetry["jarvis_voice_message"],
        "telemetry": telemetry
    })

if __name__ == '__main__':
    print("=" * 65)
    print(" 🚀 JARVIS ASTRONAUT ASSISTANCE BACKEND RUNNING ON http://localhost:5000")
    print(" 📹 Live Stream MJPEG Feed: http://localhost:5000/video_feed")
    print("=" * 65)
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
