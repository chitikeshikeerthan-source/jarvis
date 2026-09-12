// Presentation Demo Mode Telemetry Simulation Engine

let demoStepIndex = 0;
let isRecording = false;

const demoProcedures = [
  {
    id: "STEP-01",
    title: "Primary Fuel Valve Inspection",
    expected_object: "Fuel Valve 4A",
    action_required: "Verify safety lock pin engagement.",
    status: "MATCH",
    confidence: 0.94,
    detected_object: "Fuel Valve 4A",
    bbox: [220, 140, 480, 360],
    reason: "High confidence object match (Fuel Valve 4A). Proceed with astronaut action.",
    jarvis_voice: "JARVIS: Fuel Valve 4A identified and verified. Verify safety lock pin engagement."
  },
  {
    id: "STEP-02",
    title: "Solar Array Wire Harness Connection",
    expected_object: "Wire Harness Alpha-3",
    action_required: "Ensure clip seating and check lead voltage.",
    status: "MISMATCH",
    confidence: 0.62,
    detected_object: "Secondary Conduit Clamp",
    bbox: [200, 180, 450, 390],
    reason: "Incorrect component detected! Expected Wire Harness Alpha-3, but detected Secondary Conduit Clamp.",
    jarvis_voice: "WARNING: Mismatch detected! Target component should be Wire Harness Alpha-3. Please pause procedure."
  },
  {
    id: "STEP-03",
    title: "Liquid Cooling Loop Pressure Sensor",
    expected_object: "Pressure Sensor Gauge",
    action_required: "Check pressure reads between 32 and 36 PSI.",
    status: "MATCH",
    confidence: 0.91,
    detected_object: "Pressure Sensor Gauge",
    bbox: [300, 200, 580, 420],
    reason: "Gauge aligned. PSI telemetry within 34.2 nominal bounds.",
    jarvis_voice: "JARVIS: Pressure Sensor Gauge identified. Pressure telemetry nominal at 34.2 PSI."
  },
  {
    id: "STEP-04",
    title: "Thermal Shield Seal Inspection",
    expected_object: "Gasket B-7",
    action_required: "Inspect silicone seal for micro-fissures.",
    status: "UNCERTAIN",
    confidence: 0.72,
    detected_object: "Gasket B-7",
    bbox: [150, 120, 490, 380],
    reason: "Confidence 72% is below 88% required threshold due to light reflection.",
    jarvis_voice: "ALERT: Low confidence verification on Gasket B-7. Please reposition helmet lamp for secondary scan."
  }
];

export function getMockTelemetry(customStep = null) {
  if (customStep !== null) {
    demoStepIndex = customStep % demoProcedures.length;
  }
  const proc = demoProcedures[demoStepIndex % demoProcedures.length];

  return {
    timestamp: new Date().toISOString().substring(11, 19) + " UTC",
    procedure: {
      id: proc.id,
      title: proc.title,
      expected_object: proc.expected_object,
      action_required: proc.action_required
    },
    step_index: (demoStepIndex % demoProcedures.length) + 1,
    total_steps: demoProcedures.length,
    detection: {
      detected_object: proc.detected_object,
      confidence: proc.confidence,
      bbox: proc.bbox
    },
    verification: {
      result: proc.status,
      reason: proc.reason,
      match_score: Math.round(proc.confidence * 100)
    },
    jarvis_voice_message: proc.jarvis_voice,
    pipeline_nodes: [
      { id: "yolo", name: "YOLO Object Detector", status: "ONLINE", latency_ms: (16 + Math.random() * 4).toFixed(1), output: proc.detected_object },
      { id: "qwen_vl", name: "Qwen3-VL Vision Engine", status: "ONLINE", latency_ms: (210 + Math.random() * 30).toFixed(1), output: "Visual alignment OK" },
      { id: "rag", name: "RAG Knowledge Base", status: "ONLINE", latency_ms: (11 + Math.random() * 5).toFixed(1), output: `NASA-SOP-${proc.id}` },
      { id: "decision", name: "Decision Engine", status: proc.status, latency_ms: (28 + Math.random() * 8).toFixed(1), output: `Score ${Math.round(proc.confidence*100)}` },
      { id: "qwen_llm", name: "Qwen3 LLM Synthesizer", status: "ONLINE", latency_ms: (95 + Math.random() * 20).toFixed(1), output: "JARVIS Voice Built" }
    ],
    telemetry: {
      fps: Math.floor(29 + Math.random() * 3),
      gpu_vram_gb: (8.1 + Math.random() * 0.4).toFixed(1),
      gpu_temp_c: Math.floor(60 + Math.random() * 3),
      total_latency_ms: (360 + Math.random() * 50).toFixed(1),
      is_recording: isRecording,
      ip_streaming: true,
      stream_url: "rtsp://localhost:8554/live/astronaut_cam"
    }
  };
}

export function nextDemoStep() {
  demoStepIndex = (demoStepIndex + 1) % demoProcedures.length;
  return getMockTelemetry();
}

export function prevDemoStep() {
  demoStepIndex = (demoStepIndex - 1 + demoProcedures.length) % demoProcedures.length;
  return getMockTelemetry();
}

export function toggleDemoRecording() {
  isRecording = !isRecording;
  return isRecording;
}
