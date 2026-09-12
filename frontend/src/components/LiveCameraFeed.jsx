import React, { useState, useEffect, useRef } from 'react';
import { Camera, Video, Maximize2, Minimize2, Eye, ShieldAlert, Disc, Sliders } from 'lucide-react';

export default function LiveCameraFeed({ telemetry, demoMode, onToggleRecord, isBackendOnline }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScanlines, setShowScanlines] = useState(true);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Dynamic canvas animation for Demo Mode or offline presentation
  useEffect(() => {
    if (!demoMode && isBackendOnline) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angle = 0;

    const renderDemoCanvas = () => {
      angle = (angle + 2) % 360;
      const w = canvas.width;
      const h = canvas.height;

      // Dark background
      ctx.fillStyle = '#06090f';
      ctx.fillRect(0, 0, w, h);

      // Grid pattern
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Radar Sweep
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.stroke();

      const rad = (angle * Math.PI) / 180;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 140 * Math.cos(rad), cy + 140 * Math.sin(rad));
      ctx.stroke();

      // Simulated Hardware Target Box
      const bbox = telemetry?.detection?.bbox || [200, 150, 480, 360];
      const [x1, y1, x2, y2] = bbox;
      const bw = x2 - x1;
      const bh = y2 - y1;

      const status = telemetry?.verification?.result || 'MATCH';
      const color = status === 'MATCH' ? '#00ff88' : (status === 'MISMATCH' ? '#ff2a6d' : '#ffaa00');

      // Target Corner Brackets
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      const len = 20;
      
      // Top-left
      ctx.beginPath(); ctx.moveTo(x1, y1 + len); ctx.lineTo(x1, y1); ctx.lineTo(x1 + len, y1); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(x2 - len, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y1 + len); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(x1, y2 - len); ctx.lineTo(x1, y2); ctx.lineTo(x1 + len, y2); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(x2 - len, y2); ctx.lineTo(x2, y2); ctx.lineTo(x2, y2 - len); ctx.stroke();

      // Crosshair center
      const tcx = (x1 + x2) / 2;
      const tcy = (y1 + y2) / 2;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(tcx - 12, tcy); ctx.lineTo(tcx + 12, tcy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tcx, tcy - 12); ctx.lineTo(tcx, tcy + 12); ctx.stroke();

      // Tag box
      ctx.fillStyle = color;
      ctx.fillRect(x1, y1 - 26, 260, 24);
      ctx.fillStyle = '#06090f';
      ctx.font = 'bold 12px "JetBrains Mono"';
      ctx.fillText(`TARGET: ${telemetry?.detection?.detected_object || 'OBJECT'}`, x1 + 6, y1 - 9);

      animationFrameId = requestAnimationFrame(renderDemoCanvas);
    };

    renderDemoCanvas();
    return () => cancelAnimationFrame(animationFrameId);
  }, [demoMode, isBackendOnline, telemetry]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const isRecording = telemetry?.telemetry?.is_recording;

  return (
    <div ref={containerRef} className="glass-panel p-4 flex flex-col h-full relative group">
      {/* Top Feed Bar HUD */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 text-cyan-400" />
          <span className="font-orbitron font-bold text-cyan-300 tracking-wider">LIVE HELMETCAM FEED</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
            1280x720 // 30 FPS
          </span>
        </div>

        {/* IP Stream & REC Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowScanlines(!showScanlines)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded border text-[11px] transition-all ${showScanlines ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
            title="Toggle Retro CRT Scanline Overlay"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>SCANLINES</span>
          </button>

          <button
            onClick={onToggleRecord}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded border text-[11px] font-bold transition-all ${
              isRecording 
                ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_12px_rgba(255,42,109,0.5)] animate-pulse' 
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-red-400 hover:text-red-400'
            }`}
          >
            <Disc className={`w-3.5 h-3.5 ${isRecording ? 'text-red-500 animate-spin' : ''}`} />
            <span>{isRecording ? 'REC ACTIVE' : 'LOCAL REC'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-all"
            title="Toggle Fullscreen Video HUD"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport Canvas / Image Stream */}
      <div className={`relative flex-1 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-slate-800 ${showScanlines ? 'scanlines' : ''}`}>
        {isBackendOnline && !demoMode ? (
          <img
            src="http://localhost:5000/video_feed"
            alt="Live JARVIS Camera Stream"
            className="w-full h-full object-contain max-h-[460px]"
            onError={(e) => {
              // Fallback to canvas if image load fails
              e.target.style.display = 'none';
            }}
          />
        ) : null}

        {/* Demo Mode / Fallback Animated Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className={`w-full h-full object-contain max-h-[460px] ${isBackendOnline && !demoMode ? 'hidden' : 'block'}`}
        />

        {/* HUD Overlay telemetry text on Video */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded border border-cyan-500/30 text-cyan-300 font-mono text-[11px] space-y-0.5 pointer-events-none">
          <div>CAM_ID: <span className="text-white">EVA-HEADCAM-01</span></div>
          <div>STREAM: <span className="text-green-400">RTSP LIVE (OK)</span></div>
          <div>LATENCY: <span className="text-cyan-300">{telemetry?.telemetry?.total_latency_ms || 34.2} ms</span></div>
        </div>

        {/* Bounding Box Info HUD Overlay Bottom Right */}
        <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded border border-slate-700 text-slate-300 font-mono text-[11px] pointer-events-none">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">DETECTED:</span>
            <span className="text-cyan-400 font-bold">{telemetry?.detection?.detected_object || 'NONE'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">CONFIDENCE:</span>
            <span className="text-green-400 font-bold">{Math.round((telemetry?.detection?.confidence || 0.92) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
