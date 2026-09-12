import React, { useState, useEffect } from 'react';
import { Cpu, Radio, Video, Volume2, VolumeX, Play, Pause, ShieldCheck, Activity } from 'lucide-react';

export default function HeaderHUD({ telemetry, demoMode, onToggleDemo, isMuted, onToggleMute, isBackendOnline }) {
  const [timeUtc, setTimeUtc] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTimeUtc(d.toISOString().substring(11, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="glass-panel px-6 py-4 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/30">
      {/* Left Branding & Mission Title */}
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400 glow-cyan">
          <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-orbitron font-black text-xl tracking-wider text-cyan-400">
              JARVIS <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">v3.0 LOCAL</span>
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-purple-500/40 text-purple-400 bg-purple-950/30">
              ASTRONAUT ASSIST
            </span>
          </div>
          <p className="text-xs font-rajdhani text-slate-400 tracking-wide">
            MISSION CONTROL // ISS COLUMBUS MODULE EXPERIMENT MONITOR
          </p>
        </div>
      </div>

      {/* Center Live Telemetry Clock & Indicators */}
      <div className="hidden md:flex items-center space-x-6 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs">
        <div className="flex items-center space-x-2 text-cyan-300">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>TIME: <strong className="text-white font-semibold">{timeUtc || '10:52:30 UTC'}</strong></span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center space-x-2">
          <Radio className={`w-4 h-4 ${telemetry?.telemetry?.ip_streaming ? 'text-green-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="text-slate-300">IP STREAM:</span>
          <span className={`px-1.5 py-0.5 text-[10px] rounded font-bold ${telemetry?.telemetry?.ip_streaming ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-400'}`}>
            {telemetry?.telemetry?.ip_streaming ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center space-x-2">
          <Video className={`w-4 h-4 ${telemetry?.telemetry?.is_recording ? 'text-red-500 animate-ping' : 'text-slate-500'}`} />
          <span className="text-slate-300">REC:</span>
          <span className={`px-1.5 py-0.5 text-[10px] rounded font-bold ${telemetry?.telemetry?.is_recording ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-400'}`}>
            {telemetry?.telemetry?.is_recording ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>
      </div>

      {/* Right Controls: Backend Status, Audio Mute, Demo Mode */}
      <div className="flex items-center space-x-3">
        {/* Backend Connection Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs">
          <div className={`w-2.5 h-2.5 rounded-full ${isBackendOnline ? 'bg-green-400 shadow-[0_0_8px_#00ff88]' : 'bg-amber-400 shadow-[0_0_8px_#ffaa00]'}`} />
          <span className="text-slate-300 hidden sm:inline">PY FLASK (5000):</span>
          <span className={isBackendOnline ? 'text-green-400 font-semibold' : 'text-amber-400 font-semibold'}>
            {isBackendOnline ? 'CONNECTED' : 'DEMO MODE'}
          </span>
        </div>

        {/* Audio Mute Button */}
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-lg border transition-all ${isMuted ? 'bg-red-950/40 border-red-500/40 text-red-400 hover:bg-red-900/60' : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60'}`}
          title={isMuted ? "Unmute JARVIS Voice" : "Mute JARVIS Voice"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Demo Mode Presentation Toggle */}
        <button
          onClick={onToggleDemo}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold border transition-all ${
            demoMode 
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,170,0,0.3)] animate-pulse' 
              : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300'
          }`}
        >
          {demoMode ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
          <span>{demoMode ? 'DEMO MODE: ON' : 'DEMO MODE'}</span>
        </button>
      </div>
    </header>
  );
}
