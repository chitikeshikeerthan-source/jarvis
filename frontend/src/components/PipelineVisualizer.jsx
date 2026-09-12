import React from 'react';
import { Layers, Cpu, Eye, Database, CheckSquare, MessageSquareCode, ArrowRight, Zap } from 'lucide-react';

export default function PipelineVisualizer({ nodes, totalLatency }) {
  const defaultNodes = [
    { id: "yolo", name: "YOLO Object Detector", status: "ONLINE", latency_ms: 18.2, output: "Fuel Valve 4A" },
    { id: "qwen_vl", name: "Qwen3-VL Vision Engine", status: "ONLINE", latency_ms: 224.0, output: "Visual Features OK" },
    { id: "rag", name: "RAG Knowledge Base", status: "ONLINE", latency_ms: 12.5, output: "NASA-SOP-STEP-01" },
    { id: "decision", name: "Decision Engine", status: "MATCH", latency_ms: 31.0, output: "Score 94%" },
    { id: "qwen_llm", name: "Qwen3 LLM Synthesizer", status: "ONLINE", latency_ms: 104.5, output: "JARVIS Voice Built" }
  ];

  const activeNodes = nodes && nodes.length > 0 ? nodes : defaultNodes;

  const getIcon = (id) => {
    switch (id) {
      case 'yolo': return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'qwen_vl': return <Eye className="w-5 h-5 text-purple-400" />;
      case 'rag': return <Database className="w-5 h-5 text-blue-400" />;
      case 'decision': return <CheckSquare className="w-5 h-5 text-green-400" />;
      case 'qwen_llm': return <MessageSquareCode className="w-5 h-5 text-amber-400" />;
      default: return <Zap className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'MATCH' || status === 'ONLINE') {
      return <span className="px-1.5 py-0.5 text-[10px] rounded bg-green-500/20 text-green-400 border border-green-500/30 font-mono">ONLINE</span>;
    }
    if (status === 'MISMATCH') {
      return <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-500/20 text-red-400 border border-red-500/30 font-mono animate-pulse">MISMATCH</span>;
    }
    return <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">UNCERTAIN</span>;
  };

  return (
    <div className="glass-panel p-5 mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="font-orbitron font-bold text-cyan-300 tracking-wider text-sm">
            AI PIPELINE ARCHITECTURE MONITOR
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">TOTAL LATENCY:</span>
          <span className="text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-cyan-500/30">
            {totalLatency || 388.2} ms
          </span>
        </div>
      </div>

      {/* Interactive Horizontal Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {activeNodes.map((node, index) => (
          <div key={node.id} className="relative flex flex-col justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition-all group">
            {/* Connecting Arrow for desktop */}
            {index < activeNodes.length - 1 && (
              <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-4 h-4 items-center justify-center bg-slate-900 border border-slate-700 rounded-full text-cyan-400">
                <ArrowRight className="w-2.5 h-2.5" />
              </div>
            )}

            {/* Node Top Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-cyan-400/50 transition-colors">
                {getIcon(node.id)}
              </div>
              {getStatusBadge(node.status)}
            </div>

            {/* Node Title */}
            <div>
              <h3 className="font-rajdhani font-bold text-slate-200 text-xs tracking-wider uppercase mb-1">
                {node.name}
              </h3>
              <div className="text-[11px] font-mono text-slate-400 truncate mb-2">
                Out: <span className="text-cyan-300 font-semibold">{node.output}</span>
              </div>
            </div>

            {/* Node Latency Meter */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500">EXEC TIME:</span>
              <span className="text-purple-400 font-bold">{node.latency_ms} ms</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
