import React from 'react';
import { Activity, Cpu, Thermometer, Radio, Zap, HardDrive } from 'lucide-react';

export default function TelemetryMetrics({ telemetry }) {
  const t = telemetry?.telemetry || {
    fps: 30,
    gpu_vram_gb: 8.4,
    gpu_temp_c: 62,
    total_latency_ms: 388.2,
    ip_streaming: true,
    stream_url: "rtsp://localhost:8554/live/astronaut_cam"
  };

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="font-orbitron font-bold text-cyan-300 tracking-wider text-sm">
            HARDWARE & TELEMETRY MONITOR
          </h2>
        </div>
        <span className="text-xs text-green-400 font-mono flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span>REAL-TIME</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        {/* FPS Gauge */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>VISION FPS</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-orbitron font-black text-xl text-white">
            {t.fps} <span className="text-xs text-slate-400 font-sans">FPS</span>
          </div>
          <div className="text-[10px] text-green-400 mt-1">Nominal (30 Hz)</div>
        </div>

        {/* GPU VRAM Usage */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>GPU VRAM</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-orbitron font-black text-xl text-purple-300">
            {t.gpu_vram_gb} <span className="text-xs text-slate-400 font-sans">GB</span>
          </div>
          <div className="text-[10px] text-purple-400/80 mt-1">Local VRAM / 16GB</div>
        </div>

        {/* GPU Thermal Temp */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>GPU TEMP</span>
            <Thermometer className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-orbitron font-black text-xl text-red-300">
            {t.gpu_temp_c}°C
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Thermal Normal</div>
        </div>

        {/* IP RTSP Stream URL */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>IP RTSP FEED</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-mono text-[11px] text-cyan-300 truncate">
            {t.stream_url}
          </div>
          <div className="text-[10px] text-green-400 mt-1">Stream Active</div>
        </div>
      </div>
    </div>
  );
}
