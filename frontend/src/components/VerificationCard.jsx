import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight, ChevronLeft, RefreshCw, ShieldCheck } from 'lucide-react';

export default function VerificationCard({ telemetry, onNextStep, onPrevStep }) {
  const proc = telemetry?.procedure || {
    id: "STEP-01",
    title: "Primary Fuel Valve Inspection",
    expected_object: "Fuel Valve 4A",
    action_required: "Verify safety lock pin engagement."
  };

  const det = telemetry?.detection || {
    detected_object: "Fuel Valve 4A",
    confidence: 0.94
  };

  const ver = telemetry?.verification || {
    result: "MATCH",
    reason: "High confidence object match. Proceed with astronaut action.",
    match_score: 94
  };

  const status = ver.result; // MATCH, MISMATCH, UNCERTAIN
  const confidencePct = Math.round((det.confidence || 0.9) * 100);

  const getStatusDisplay = () => {
    if (status === 'MATCH') {
      return (
        <div className="badge-match px-4 py-3 rounded-xl flex items-center space-x-3">
          <CheckCircle2 className="w-8 h-8 text-green-400 shrink-0 animate-bounce" />
          <div>
            <div className="font-orbitron font-black text-lg tracking-wider text-green-300">
              VERIFICATION: MATCH
            </div>
            <div className="text-xs text-green-400/90 font-mono">
              Component verified with {confidencePct}% vision match confidence.
            </div>
          </div>
        </div>
      );
    }
    if (status === 'MISMATCH') {
      return (
        <div className="badge-mismatch px-4 py-3 rounded-xl flex items-center space-x-3">
          <XCircle className="w-8 h-8 text-red-500 shrink-0 animate-pulse" />
          <div>
            <div className="font-orbitron font-black text-lg tracking-wider text-red-400">
              VERIFICATION: MISMATCH
            </div>
            <div className="text-xs text-red-300 font-mono">
              INCORRECT COMPONENT! Expected: '{proc.expected_object}' | Detected: '{det.detected_object}'.
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="badge-uncertain px-4 py-3 rounded-xl flex items-center space-x-3">
        <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
        <div>
          <div className="font-orbitron font-black text-lg tracking-wider text-amber-300">
            VERIFICATION: UNCERTAIN
          </div>
          <div className="text-xs text-amber-300 font-mono">
            Low confidence scan ({confidencePct}%). Please adjust camera lighting or distance.
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel p-5 flex flex-col justify-between h-full">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4 font-mono">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="font-orbitron font-bold text-cyan-300 tracking-wider text-sm">
              DECISION & STEP ENGINE
            </h2>
          </div>
          <span className="text-xs text-purple-300 font-bold bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-500/30">
            STEP {telemetry?.step_index || 1} OF {telemetry?.total_steps || 4}
          </span>
        </div>

        {/* Current Active Step Title */}
        <div className="mb-4">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            {proc.id} // CURRENT PROCEDURE
          </div>
          <h3 className="font-orbitron font-bold text-lg text-white mb-2">
            {proc.title}
          </h3>
          <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono">
            <strong className="text-cyan-400">ACTION REQUIRED:</strong> {proc.action_required}
          </p>
        </div>

        {/* Expected vs Detected Card */}
        <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-500 mb-1">EXPECTED COMPONENT:</div>
            <div className="text-cyan-300 font-bold text-sm truncate">{proc.expected_object}</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-500 mb-1">VISION DETECTED:</div>
            <div className={`font-bold text-sm truncate ${status === 'MATCH' ? 'text-green-400' : (status === 'MISMATCH' ? 'text-red-400' : 'text-amber-400')}`}>
              {det.detected_object}
            </div>
          </div>
        </div>

        {/* Decision Banner */}
        <div className="mb-4">
          {getStatusDisplay()}
        </div>

        {/* Confidence Meter Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-slate-400">VISION CONFIDENCE METER:</span>
            <span className="text-cyan-300 font-bold">{confidencePct}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                confidencePct >= 85 ? 'bg-gradient-to-r from-cyan-500 to-green-400' : (confidencePct >= 70 ? 'bg-amber-400' : 'bg-red-500')
              }`}
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Navigation Step Controls */}
      <div className="flex items-center space-x-3 pt-3 border-t border-slate-800">
        <button
          onClick={onPrevStep}
          className="flex-1 py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs font-semibold hover:border-cyan-400 hover:text-cyan-300 transition-all flex items-center justify-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREV STEP</span>
        </button>

        <button
          onClick={onNextStep}
          className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all flex items-center justify-center space-x-1"
        >
          <span>NEXT STEP</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
