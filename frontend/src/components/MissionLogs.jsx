import React, { useState, useEffect } from 'react';
import { Terminal, Download, Search, Filter, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

export default function MissionLogs({ telemetry }) {
  const [logs, setLogs] = useState([
    { id: 1, timestamp: "10:51:10 UTC", category: "SYSTEM", text: "JARVIS Local Astronaut Assistance Core Initialized.", level: "INFO" },
    { id: 2, timestamp: "10:51:12 UTC", category: "PIPELINE", text: "YOLO v8 / Qwen3-VL / RAG / Qwen3 Models Ready on localhost:5000.", level: "INFO" },
    { id: 3, timestamp: "10:51:30 UTC", category: "VERIFICATION", text: "Procedure STEP-01: Fuel Valve 4A MATCH verified (Conf: 94%).", level: "SUCCESS" },
    { id: 4, timestamp: "10:52:05 UTC", category: "VERIFICATION", text: "Procedure STEP-02: Wire Harness Alpha-3 MISMATCH detected.", level: "ERROR" }
  ]);

  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Append new evaluation events automatically when telemetry changes
  useEffect(() => {
    if (!telemetry) return;
    const timeStr = telemetry.timestamp || new Date().toISOString().substring(11, 19) + ' UTC';
    const status = telemetry.verification?.result || 'MATCH';
    const obj = telemetry.detection?.detected_object || 'OBJECT';
    const procId = telemetry.procedure?.id || 'STEP';

    const newLog = {
      id: Date.now(),
      timestamp: timeStr,
      category: "VERIFICATION",
      text: `[${procId}] ${obj} evaluation: ${status} (Conf: ${Math.round((telemetry.detection?.confidence||0.9)*100)}%).`,
      level: status === 'MATCH' ? 'SUCCESS' : (status === 'MISMATCH' ? 'ERROR' : 'WARN')
    };

    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
  }, [telemetry?.step_index, telemetry?.verification?.result]);

  const filteredLogs = logs.filter(log => {
    const matchCat = filterCategory === 'ALL' || log.category === filterCategory;
    const matchSearch = log.text.toLowerCase().includes(searchTerm.toLowerCase()) || log.timestamp.includes(searchTerm);
    return matchCat && matchSearch;
  });

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Timestamp,Category,Level,Message", ...logs.map(l => `"${l.timestamp}","${l.category}","${l.level}","${l.text}"`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jarvis_mission_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 'SUCCESS':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">MATCH</span>;
      case 'ERROR':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">MISMATCH</span>;
      case 'WARN':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">UNCERTAIN</span>;
      default:
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">INFO</span>;
    }
  };

  return (
    <div className="glass-panel p-5 mt-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-cyan-500/20 mb-4 gap-3 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h2 className="font-orbitron font-bold text-cyan-300 tracking-wider text-sm">
            MISSION EVENT & TELEMETRY LOGS
          </h2>
        </div>

        {/* Filters and CSV Export */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="bg-slate-950/80 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-[11px] text-cyan-200 focus:outline-none focus:border-cyan-400 w-36"
            />
          </div>

          <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[10px]">
            {['ALL', 'VERIFICATION', 'PIPELINE', 'SYSTEM'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2 py-0.5 rounded transition-all ${filterCategory === cat ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 text-[11px] transition-all"
            title="Download Mission Log as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="bg-slate-950/90 rounded-xl border border-slate-800 max-h-56 overflow-y-auto font-mono text-xs divide-y divide-slate-900">
        {filteredLogs.map(log => (
          <div key={log.id} className="px-4 py-2 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
              {getLevelBadge(log.level)}
              <span className="text-slate-300">{log.text}</span>
            </div>
            <span className="text-[10px] text-slate-600 uppercase">{log.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
