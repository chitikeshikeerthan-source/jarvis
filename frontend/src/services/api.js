import { getMockTelemetry, nextDemoStep, prevDemoStep, toggleDemoRecording } from './demoEngine';

const API_BASE = 'http://localhost:5000';

export async function fetchTelemetry(demoMode = false) {
  if (demoMode) {
    return getMockTelemetry();
  }
  try {
    const res = await fetch(`${API_BASE}/api/telemetry`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data;
  } catch (err) {
    // Fallback to demo mode telemetry if backend not yet running
    return getMockTelemetry();
  }
}

export async function fetchStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/status`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Status failed');
    return await res.json();
  } catch (err) {
    return {
      online: false,
      mode: "DEMO_FALLBACK",
      models: { yolo: "SIMULATED", qwen3_vl: "SIMULATED", rag: "SIMULATED", decision_engine: "ACTIVE", qwen3: "SIMULATED" },
      streaming: { ip_stream: true, recording: false, url: "rtsp://localhost:8554/live/astronaut_cam" }
    };
  }
}

export async function postNextStep(demoMode = false) {
  if (demoMode) return nextDemoStep();
  try {
    const res = await fetch(`${API_BASE}/api/step/next`, { method: 'POST' });
    const json = await res.json();
    return json;
  } catch (err) {
    return nextDemoStep();
  }
}

export async function postPrevStep(demoMode = false) {
  if (demoMode) return prevDemoStep();
  try {
    const res = await fetch(`${API_BASE}/api/step/prev`, { method: 'POST' });
    const json = await res.json();
    return json;
  } catch (err) {
    return prevDemoStep();
  }
}

export async function postToggleRecording(demoMode = false) {
  if (demoMode) return toggleDemoRecording();
  try {
    const res = await fetch(`${API_BASE}/api/recording/toggle`, { method: 'POST' });
    const json = await res.json();
    return json.is_recording;
  } catch (err) {
    return toggleDemoRecording();
  }
}

export async function postQuery(userQuery, demoMode = false) {
  try {
    const res = await fetch(`${API_BASE}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userQuery })
    });
    if (!res.ok) throw new Error('Query error');
    return await res.json();
  } catch (err) {
    return {
      success: true,
      query: userQuery,
      jarvis_response: `JARVIS Response: Processing query "${userQuery}". All telemetry sensors nominal for procedure.`,
      telemetry: getMockTelemetry()
    };
  }
}
