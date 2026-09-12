import time
import random
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

class JARVISPipelineController:
    """
    JARVIS Modular AI Pipeline Controller.
    Preserves existing user models: YOLO, Qwen3-VL, RAG Engine, Decision Engine, and Qwen3 LLM.
    Provides mock/simulation fallbacks if models are not pre-loaded.
    """
    def __init__(self):
        self.demo_mode = True
        self.current_step_index = 0
        self.is_recording = False
        self.ip_streaming = True
        self.stream_url = "rtsp://localhost:8554/live/astronaut_cam"
        
        # Experiment Procedure Standard Operating Procedures (SOP)
        self.procedures = [
            {
                "id": "STEP-01",
                "title": "Primary Fuel Valve Inspection",
                "expected_object": "Fuel Valve 4A",
                "target_bbox": [220, 140, 480, 360],
                "action_required": "Verify safety lock pin engagement.",
                "confidence_threshold": 0.85
            },
            {
                "id": "STEP-02",
                "title": "Solar Array Wire Harness Connection",
                "expected_object": "Wire Harness Alpha-3",
                "target_bbox": [180, 160, 520, 410],
                "action_required": "Ensure clip seating and check lead voltage.",
                "confidence_threshold": 0.90
            },
            {
                "id": "STEP-03",
                "title": "Liquid Cooling Loop Pressure Sensor",
                "expected_object": "Pressure Sensor Gauge",
                "target_bbox": [300, 200, 580, 420],
                "action_required": "Check pressure reads between 32 and 36 PSI.",
                "confidence_threshold": 0.80
            },
            {
                "id": "STEP-04",
                "title": "Thermal Shield Seal Inspection",
                "expected_object": "Gasket B-7",
                "target_bbox": [150, 120, 490, 380],
                "action_required": "Inspect silicone seal for micro-fissures.",
                "confidence_threshold": 0.88
            }
        ]

    def set_demo_mode(self, enabled: bool):
        self.demo_mode = enabled
        logging.info(f"JARVIS Pipeline Demo Mode set to {self.demo_mode}")

    def get_current_procedure(self):
        return self.procedures[self.current_step_index % len(self.procedures)]

    def next_step(self):
        self.current_step_index = (self.current_step_index + 1) % len(self.procedures)
        return self.get_current_procedure()

    def prev_step(self):
        self.current_step_index = (self.current_step_index - 1) % len(self.procedures)
        return self.get_current_procedure()

    def process_frame_and_evaluate(self, frame=None, custom_prompt=None):
        """
        Executes the 5-stage AI pipeline:
        1. YOLO Object Detection
        2. Qwen3-VL Vision Language Analysis
        3. RAG Knowledge Base Procedure Retrieval
        4. Decision Engine Match Verification
        5. Qwen3 LLM Speech & Response Synthesis
        """
        t0 = time.time()
        procedure = self.get_current_procedure()
        
        # 1. Stage 1: YOLO Object Detection
        t_yolo_start = time.time()
        yolo_result = self._run_yolo(frame, procedure)
        t_yolo = round((time.time() - t_yolo_start) * 1000, 1)

        # 2. Stage 2: Qwen3-VL Analysis
        t_vl_start = time.time()
        vl_result = self._run_qwen3_vl(frame, yolo_result)
        t_vl = round((time.time() - t_vl_start) * 1000, 1)

        # 3. Stage 3: RAG Retrieval
        t_rag_start = time.time()
        rag_result = self._run_rag_knowledge(procedure["id"])
        t_rag = round((time.time() - t_rag_start) * 1000, 1)

        # 4. Stage 4: Decision Engine Verification
        t_dec_start = time.time()
        decision = self._run_decision_engine(yolo_result, vl_result, rag_result, procedure)
        t_dec = round((time.time() - t_dec_start) * 1000, 1)

        # 5. Stage 5: Qwen3 LLM Response Generation
        t_llm_start = time.time()
        jarvis_response = self._run_qwen3_llm(decision, procedure, custom_prompt)
        t_llm = round((time.time() - t_llm_start) * 1000, 1)

        total_latency = round((time.time() - t0) * 1000, 1)

        return {
            "timestamp": time.strftime("%H:%M:%S UTC"),
            "procedure": procedure,
            "step_index": self.current_step_index + 1,
            "total_steps": len(self.procedures),
            "detection": {
                "detected_object": yolo_result["label"],
                "confidence": yolo_result["confidence"],
                "bbox": yolo_result["bbox"]
            },
            "verification": {
                "result": decision["status"],  # MATCH, MISMATCH, UNCERTAIN
                "reason": decision["reason"],
                "match_score": decision["score"]
            },
            "jarvis_voice_message": jarvis_response["text"],
            "pipeline_nodes": [
                {"id": "yolo", "name": "YOLO Object Detector", "status": "ONLINE", "latency_ms": t_yolo, "output": yolo_result["label"]},
                {"id": "qwen_vl", "name": "Qwen3-VL Vision Engine", "status": "ONLINE", "latency_ms": t_vl, "output": vl_result["scene_desc"]},
                {"id": "rag", "name": "RAG Knowledge Base", "status": "ONLINE", "latency_ms": t_rag, "output": rag_result["doc_id"]},
                {"id": "decision", "name": "Decision Engine", "status": decision["status"], "latency_ms": t_dec, "output": f"Score {decision['score']}"},
                {"id": "qwen_llm", "name": "Qwen3 LLM Synthesizer", "status": "ONLINE", "latency_ms": t_llm, "output": "JARVIS Voice Built"}
            ],
            "telemetry": {
                "fps": random.randint(28, 32),
                "gpu_vram_gb": round(random.uniform(7.8, 9.4), 1),
                "gpu_temp_c": random.randint(58, 64),
                "total_latency_ms": total_latency,
                "is_recording": self.is_recording,
                "ip_streaming": self.ip_streaming,
                "stream_url": self.stream_url
            }
        }

    # ---------------- Hooks for User Models ----------------
    def _run_yolo(self, frame, procedure):
        """
        User Plug & Play Hook: Replace with `model.predict(frame)`
        """
        if self.demo_mode or frame is None:
            # Simulated detection based on step index for presentation testing
            outcomes = [
                {"label": procedure["expected_object"], "confidence": 0.94, "bbox": procedure["target_bbox"]},
                {"label": procedure["expected_object"], "confidence": 0.91, "bbox": procedure["target_bbox"]},
                {"label": "Secondary Conduit Clamp", "confidence": 0.62, "bbox": [200, 180, 450, 390]}, # MISMATCH case
                {"label": procedure["expected_object"], "confidence": 0.72, "bbox": procedure["target_bbox"]}  # UNCERTAIN case
            ]
            return outcomes[self.current_step_index % len(outcomes)]
        return {"label": procedure["expected_object"], "confidence": 0.89, "bbox": procedure["target_bbox"]}

    def _run_qwen3_vl(self, frame, yolo_result):
        """
        User Plug & Play Hook: Replace with local Qwen3-VL inference call
        """
        return {
            "scene_desc": f"Visual features confirm structural outline matching {yolo_result['label']} under current ambient lighting.",
            "spatial_alignment": "Centered in camera frame view."
        }

    def _run_rag_knowledge(self, procedure_id):
        """
        User Plug & Play Hook: Replace with ChromaDB / FAISS vector retriever query
        """
        return {
            "doc_id": f"NASA-SOP-MANUAL-{procedure_id}",
            "snippet": "Ensure double retention pin click sound before engaging pressure valve assembly."
        }

    def _run_decision_engine(self, yolo, vl, rag, procedure):
        """
        Decision Logic: Evaluates YOLO label + confidence against Procedure expectation
        """
        expected = procedure["expected_object"].lower()
        detected = yolo["label"].lower()
        conf = yolo["confidence"]

        if expected in detected or detected in expected:
            if conf >= procedure["confidence_threshold"]:
                return {"status": "MATCH", "score": round(conf * 100, 1), "reason": f"High confidence object match ({yolo['label']}). Proceed with astronaut action."}
            else:
                return {"status": "UNCERTAIN", "score": round(conf * 100, 1), "reason": f"Object recognized ({yolo['label']}) but confidence {int(conf*100)}% is below required {int(procedure['confidence_threshold']*100)}% threshold."}
        else:
            return {"status": "MISMATCH", "score": round(conf * 100, 1), "reason": f"Incorrect component detected! Expected '{procedure['expected_object']}', but vision sensor detected '{yolo['label']}'."}

    def _run_qwen3_llm(self, decision, procedure, custom_prompt=None):
        """
        User Plug & Play Hook: Synthesizes final astronaut notification & audio message text
        """
        if custom_prompt:
            return {"text": f"JARVIS Response: Regarding '{custom_prompt}' — Step {procedure['id']} mandates: {procedure['action_required']}"}

        status = decision["status"]
        if status == "MATCH":
            text = f"JARVIS: {procedure['expected_object']} identified and verified. {procedure['action_required']}"
        elif status == "MISMATCH":
            text = f"WARNING: Mismatch detected! Target component should be {procedure['expected_object']}. Please pause procedure."
        else:
            text = f"ALERT: Low confidence verification on {procedure['expected_object']}. Please reposition headcam for secondary scan."
        return {"text": text}
