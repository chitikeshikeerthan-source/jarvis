import React, { useState, useEffect } from 'react';
import HeaderHUD from './components/HeaderHUD';
import LiveCameraFeed from './components/LiveCameraFeed';
import PipelineVisualizer from './components/PipelineVisualizer';
import VerificationCard from './components/VerificationCard';
import JarvisVoicePanel from './components/JarvisVoicePanel';
import TelemetryMetrics from './components/TelemetryMetrics';
import MissionLogs from './components/MissionLogs';
import { fetchTelemetry, fetchStatus, postNextStep, postPrevStep, postToggleRecording, postQuery } from './services/api';

export default function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [demoMode, setDemoMode] = useState(true); // Default presentation demo mode ON for instant preview
  const [isMuted, setIsMuted] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Poll backend status and telemetry
  useEffect(() => {
    const updateTelemetry = async () => {
      const statusRes = await fetchStatus();
      setIsBackendOnline(statusRes.online);

      const data = await fetchTelemetry(demoMode);
      setTelemetry(data);
    };

    updateTelemetry();
    const interval = setInterval(updateTelemetry, 1500);
    return () => clearInterval(interval);
  }, [demoMode]);

  const handleNextStep = async () => {
    const res = await postNextStep(demoMode);
    if (res?.procedure) {
      const freshData = await fetchTelemetry(demoMode);
      setTelemetry(freshData);
    } else {
      setTelemetry(res);
    }
  };

  const handlePrevStep = async () => {
    const res = await postPrevStep(demoMode);
    if (res?.procedure) {
      const freshData = await fetchTelemetry(demoMode);
      setTelemetry(freshData);
    } else {
      setTelemetry(res);
    }
  };

  const handleToggleRecord = async () => {
    const recState = await postToggleRecording(demoMode);
    setTelemetry(prev => ({
      ...prev,
      telemetry: { ...prev?.telemetry, is_recording: recState }
    }));
  };

  const handleSendQuery = async (userQuery) => {
    const res = await postQuery(userQuery, demoMode);
    if (res?.telemetry) {
      setTelemetry(res.telemetry);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 p-4 md:p-6 flex flex-col justify-between max-w-[1700px] mx-auto selection:bg-cyan-500 selection:text-black">
      <div>
        {/* Top Header HUD Bar */}
        <HeaderHUD
          telemetry={telemetry}
          demoMode={demoMode}
          onToggleDemo={() => setDemoMode(!demoMode)}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          isBackendOnline={isBackendOnline}
        />

        {/* AI Pipeline Architecture Visualizer */}
        <PipelineVisualizer
          nodes={telemetry?.pipeline_nodes}
          totalLatency={telemetry?.telemetry?.total_latency_ms}
        />

        {/* Grid Layout: Live Camera Feed (Left) & Verification Engine + JARVIS Hub (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Left Column: Live Camera & Vision HUD (7 cols on Desktop) */}
          <div className="lg:col-span-7 flex flex-col">
            <LiveCameraFeed
              telemetry={telemetry}
              demoMode={demoMode}
              onToggleRecord={handleToggleRecord}
              isBackendOnline={isBackendOnline}
            />
          </div>

          {/* Right Column: Step Verification & JARVIS Voice Hub (5 cols on Desktop) */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-6">
            <VerificationCard
              telemetry={telemetry}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
            />
            
            <JarvisVoicePanel
              voiceMessage={telemetry?.jarvis_voice_message}
              onSendQuery={handleSendQuery}
              isMuted={isMuted}
            />
          </div>
        </div>

        {/* Hardware & Telemetry Gauges */}
        <TelemetryMetrics telemetry={telemetry} />

        {/* Real-time Mission Logs */}
        <MissionLogs telemetry={telemetry} />
      </div>

      {/* Footer System Status Bar */}
      <footer className="mt-8 pt-4 border-t border-cyan-500/20 text-center font-mono text-xs text-slate-500 flex flex-wrap justify-between items-center gap-2">
        <div>
          JARVIS LOCAL ASTRONAUT ASSISTANT // DEEP SPACE EXPEDITION MISSION CONTROL
        </div>
        <div className="text-cyan-400">
          LOCAL HOST 5000 // YOLO v8 + Qwen3-VL + RAG + DECISION ENGINE + Qwen3 LLM
        </div>
      </footer>
    </div>
  );
}
