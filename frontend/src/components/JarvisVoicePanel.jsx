import React, { useState, useEffect } from 'react';
import { MessageSquare, Mic, Send, Volume2, Sparkles, Terminal } from 'lucide-react';

export default function JarvisVoicePanel({ voiceMessage, onSendQuery, isMuted }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputQuery, setInputQuery] = useState('');

  // Typewriter Text Effect & Web Speech Synthesis
  useEffect(() => {
    if (!voiceMessage) return;

    setIsTyping(true);
    let i = 0;
    setDisplayText('');

    const timer = setInterval(() => {
      if (i < voiceMessage.length) {
        setDisplayText(prev => prev + voiceMessage.charAt(i));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20);

    // Speak aloud using Web Speech API if un-muted
    if (!isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanMsg = voiceMessage.replace(/^JARVIS:|^WARNING:|^ALERT:/i, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanMsg);
      utterance.rate = 1.0;
      utterance.pitch = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    return () => clearInterval(timer);
  }, [voiceMessage, isMuted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    onSendQuery(inputQuery);
    setInputQuery('');
  };

  return (
    <div className="glass-panel p-5 flex flex-col justify-between h-full">
      <div>
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4 font-mono">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="font-orbitron font-bold text-cyan-300 tracking-wider text-sm">
              JARVIS SYNTHESIZED VOICE HUB
            </h2>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-purple-400">
            <Volume2 className={`w-4 h-4 ${isTyping ? 'animate-bounce text-cyan-400' : ''}`} />
            <span className="font-mono">{isTyping ? 'SPEAKING...' : 'LISTENING'}</span>
          </div>
        </div>

        {/* Audio Waveform Equalizer Display */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-center space-x-1.5 h-14 mb-4">
          {[18, 32, 12, 44, 24, 38, 16, 48, 28, 14, 36, 20, 42, 26].map((h, idx) => (
            <div
              key={idx}
              className={`w-1 rounded-full transition-all duration-300 ${
                isTyping ? 'bg-gradient-to-t from-cyan-500 to-purple-400 wave-bar' : 'bg-cyan-500/30'
              }`}
              style={{
                height: isTyping ? `${Math.min(45, h * 1.1)}px` : '8px',
                animationDelay: `${idx * 0.08}s`
              }}
            />
          ))}
        </div>

        {/* Voice Speech Bubble Message Box */}
        <div className="bg-slate-950/90 p-4 rounded-xl border border-cyan-500/30 shadow-[inset_0_0_15px_rgba(0,240,255,0.05)] min-h-[110px] mb-4 relative">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>JARVIS RESPONSE STREAM</span>
          </div>
          <p className="font-mono text-sm text-cyan-100 leading-relaxed">
            {displayText || voiceMessage || "JARVIS online. Standing by for astronaut visual SOP evaluation."}
            {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-ping" />}
          </p>
        </div>
      </div>

      {/* Interactive Query Prompt Input */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask JARVIS (e.g., 'Verify Valve 4 torque limit')..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-cyan-100 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
        </div>
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-500/30 hover:text-white transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          title="Send query to JARVIS Qwen3 LLM"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
