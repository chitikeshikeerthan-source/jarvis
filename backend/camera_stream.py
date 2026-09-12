import cv2
import numpy as np
import time
import threading
import logging

class CameraStreamManager:
    """
    OpenCV Camera Manager for Live Feed & Synthetic Fallback Feed.
    Draws dynamic futuristic HUD elements, bounding boxes, and handles local video recording.
    """
    def __init__(self, controller):
        self.controller = controller
        self.cap = None
        self.is_running = False
        self.lock = threading.Lock()
        self.frame_width = 1280
        self.frame_height = 720
        self.recording_writer = None
        self._init_camera()

    def _init_camera(self):
        try:
            # Try to open default camera (index 0)
            self.cap = cv2.VideoCapture(0)
            if self.cap and self.cap.isOpened():
                self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.frame_width)
                self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.frame_height)
                logging.info("Physical webcam initialized successfully.")
            else:
                logging.info("Physical webcam not detected. Using high-tech synthetic HUD camera stream.")
                self.cap = None
        except Exception as e:
            logging.warning(f"Camera init error: {e}. Switching to synthetic stream.")
            self.cap = None

    def toggle_recording(self):
        self.controller.is_recording = not self.controller.is_recording
        if self.controller.is_recording:
            fourcc = cv2.VideoWriter_fourcc(*'XVID')
            filename = f"jarvis_rec_{int(time.time())}.avi"
            self.recording_writer = cv2.VideoWriter(filename, fourcc, 20.0, (self.frame_width, self.frame_height))
            logging.info(f"Started recording to {filename}")
        else:
            if self.recording_writer:
                self.recording_writer.release()
                self.recording_writer = None
            logging.info("Stopped recording.")
        return self.controller.is_recording

    def generate_frames(self):
        """
        Generates MJPEG byte stream for HTTP streaming response.
        """
        angle = 0
        while True:
            t_now = time.time()
            if self.cap and self.cap.isOpened():
                success, raw_frame = self.cap.read()
                if not success:
                    raw_frame = self._create_synthetic_frame(angle)
            else:
                raw_frame = self._create_synthetic_frame(angle)

            angle = (angle + 3) % 360

            # Get current pipeline assessment
            eval_data = self.controller.process_frame_and_evaluate()
            
            # Overlay Aerospace HUD on frame
            hud_frame = self._draw_futuristic_hud(raw_frame, eval_data, angle)

            # Record if recording active
            if self.controller.is_recording and self.recording_writer:
                self.recording_writer.write(hud_frame)

            ret, buffer = cv2.imencode('.jpg', hud_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            
            time.sleep(0.033) # ~30 FPS

    def _create_synthetic_frame(self, angle):
        """
        Creates a crisp dark aerospace 720p simulation video canvas with grid lines.
        """
        img = np.zeros((self.frame_height, self.frame_width, 3), dtype=np.uint8)
        
        # Dark space backdrop with subtle grid
        img[:, :] = (12, 10, 8) # Deep navy black

        # Draw tech grid pattern
        grid_size = 40
        for x in range(0, self.frame_width, grid_size):
            cv2.line(img, (x, 0), (x, self.frame_height), (24, 20, 18), 1)
        for y in range(0, self.frame_height, grid_size):
            cv2.line(img, (0, y), (self.frame_width, y), (24, 20, 18), 1)

        # Draw simulated object geometry in center (Valve / Wire / Module)
        cx, cy = self.frame_width // 2, self.frame_height // 2
        
        # Rotating radar reticle in background
        cv2.circle(img, (cx, cy), 180, (0, 80, 100), 1)
        cv2.circle(img, (cx, cy), 120, (0, 120, 150), 1)
        
        rad = np.radians(angle)
        rx = int(cx + 180 * np.cos(rad))
        ry = int(cy + 180 * np.sin(rad))
        cv2.line(img, (cx, cy), (rx, ry), (0, 240, 255), 1)

        # Draw mock hardware target object
        cv2.rectangle(img, (cx - 140, cy - 90), (cx + 140, cy + 90), (45, 40, 35), -1)
        cv2.rectangle(img, (cx - 140, cy - 90), (cx + 140, cy + 90), (0, 200, 255), 2)
        cv2.circle(img, (cx, cy), 45, (0, 170, 255), 2)
        cv2.putText(img, "EXP-SPECIMEN-UNIT", (cx - 120, cy - 110),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 240, 255), 1, cv2.LINE_AA)

        return img

    def _draw_futuristic_hud(self, frame, eval_data, angle):
        """
        Renders HUD telemetry, YOLO bounding box, target crosshair, and status banners onto the frame.
        """
        img = frame.copy()
        h, w = img.shape[:2]
        
        det = eval_data["detection"]
        ver = eval_data["verification"]
        status = ver["result"]
        
        # Colors (BGR format)
        CYAN = (255, 240, 0)
        GREEN = (136, 255, 0)
        RED = (109, 42, 255)
        AMBER = (0, 170, 255)
        WHITE = (255, 255, 255)

        color = GREEN if status == "MATCH" else (RED if status == "MISMATCH" else AMBER)

        # Draw YOLO Bounding Box
        bbox = det["bbox"]
        x1, y1, x2, y2 = bbox
        
        # Draw tech corner brackets instead of simple box
        line_len = 25
        thickness = 2
        # Top-left corner
        cv2.line(img, (x1, y1), (x1 + line_len, y1), color, thickness)
        cv2.line(img, (x1, y1), (x1, y1 + line_len), color, thickness)
        # Top-right corner
        cv2.line(img, (x2, y1), (x2 - line_len, y1), color, thickness)
        cv2.line(img, (x2, y1), (x2, y1 + line_len), color, thickness)
        # Bottom-left corner
        cv2.line(img, (x1, y2), (x1 + line_len, y2), color, thickness)
        cv2.line(img, (x1, y2), (x1, y2 - line_len), color, thickness)
        # Bottom-right corner
        cv2.line(img, (x2, y2), (x2 - line_len, y2), color, thickness)
        cv2.line(img, (x2, y2), (x2, y2 - line_len), color, thickness)

        # Label tag background box
        label_text = f"TARGET: {det['detected_object']} | CONF: {int(det['confidence']*100)}%"
        cv2.rectangle(img, (x1, y1 - 28), (x1 + 380, y1), color, -1)
        cv2.putText(img, label_text, (x1 + 8, y1 - 8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (10, 10, 10), 2, cv2.LINE_AA)

        # Draw Crosshair target center
        tcx, tcy = (x1 + x2) // 2, (y1 + y2) // 2
        cv2.line(img, (tcx - 15, tcy), (tcx + 15, tcy), CYAN, 1)
        cv2.line(img, (tcx, tcy - 15), (tcx, tcy + 15), CYAN, 1)
        cv2.circle(img, (tcx, tcy), 6, CYAN, 1)

        # Top Banner Overlay
        cv2.rectangle(img, (20, 20), (w - 20, 60), (15, 12, 10), -1)
        cv2.rectangle(img, (20, 20), (w - 20, 60), CYAN, 1)
        
        banner_text = f"JARVIS CV-HUD // {eval_data['procedure']['id']} - {eval_data['procedure']['title']}"
        cv2.putText(img, banner_text, (35, 46),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.65, CYAN, 2, cv2.LINE_AA)

        # Verification Status Badge on Frame
        status_text = f"EVAL RESULT: [{status}]"
        cv2.putText(img, status_text, (w - 320, 46),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.65, color, 2, cv2.LINE_AA)

        # REC Indicator if recording
        if self.controller.is_recording:
            cv2.circle(img, (w - 50, 40), 8, (0, 0, 255), -1)
            cv2.putText(img, "REC", (w - 35, 45), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)

        return img
