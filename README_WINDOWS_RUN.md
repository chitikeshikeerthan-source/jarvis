# 🚀 JARVIS Local Astronaut-Assistance Mission Control Dashboard

A futuristic local aerospace mission-control dashboard for astronauts connected to a local Python AI Flask backend at `http://localhost:5000`.

## 📌 Features

1. **Live Camera Feed & Computer Vision HUD**:
   - Real-time OpenCV MJPEG video stream from `http://localhost:5000/video_feed` or interactive presentation Canvas.
   - Dynamic YOLO target bounding boxes, crosshairs, target labels, scanlines overlay, and resolution tags.
   - IP Camera RTSP streaming status indicator and local MP4 recording engine.

2. **Complete AI Pipeline Architecture Visualizer**:
   - Live telemetry node graph: `YOLO Detector` -> `Qwen3-VL` -> `RAG SOP Docs` -> `Decision Engine` -> `Qwen3 LLM Synthesizer`.
   - Real-time latency tracking (ms) per AI module.

3. **Decision & Step Verification Engine**:
   - Current procedure step tracking (Expected component vs. Detected component).
   - Prominent **MATCH** (Green glow), **MISMATCH** (Red pulsing alert), or **UNCERTAIN** (Amber warning) badges.
   - Vision confidence percentage gauge and step navigation controls (`Prev Step`, `Next Step`).

4. **JARVIS Voice & Assistant Hub**:
   - Synthesized JARVIS speech bubble transcription with animated typewriter text.
   - Browser Web Speech API text-to-speech option (JARVIS speaks voice updates aloud).
   - Audio waveform equalizer visualizer and interactive query prompt input ("Ask JARVIS...").

5. **Telemetry Metrics & Mission Logs**:
   - Hardware metrics (FPS, GPU VRAM, GPU Thermal Temp, RTSP URL).
   - Scrollable real-time event log feed with search filtering and CSV log export.

6. **Presentation Demo Mode**:
   - Built-in Demo Mode toggle for presentations and offline testing without live hardware.

---

## 💻 Windows Execution Instructions

### Prerequisites
- **Python 3.9+** installed (with `python` added to PATH)
- **Node.js 18+** installed (with `npm` added to PATH)

### Option 1: One-Click Master Launcher (Recommended)
Simply double-click `start_jarvis.bat` in the project root folder.
This will automatically launch the Flask AI backend on `http://localhost:5000` and open the Web UI on `http://localhost:3000`.

### Option 2: Manual Terminal Execution

#### 1. Start Python Flask AI Backend (Port 5000)
```cmd
cd backend
python -m pip install -r requirements.txt
python app.py
```

#### 2. Start Frontend Mission Control UI (Port 3000)
Open a second terminal window:
```cmd
cd frontend
npm install
npm run dev
```

Then open your browser and navigate to:
👉 `http://localhost:3000`

---

## 🛠️ Connecting Your Existing AI Models

The backend (`backend/ai_pipeline.py`) is structured for zero-headache plug-and-play integration with your existing Python AI models:

- **YOLO Object Detector**: Import your PyTorch / Ultralytics model in `_run_yolo()` (`model.predict(frame)`).
- **Qwen3-VL Vision Engine**: Call your local Qwen3-VL model instance in `_run_qwen3_vl()`.
- **RAG Knowledge Base**: Plug your ChromaDB or FAISS retriever in `_run_rag_knowledge()`.
- **Qwen3 LLM Synthesizer**: Connect your local vLLM / Ollama / HuggingFace model in `_run_qwen3_llm()`.
