import mediapipe as mp
import cv2
from ..base_model import BaseModel

class FaceLandmarks(BaseModel):
    def __init__(self, config=None):
        super().__init__(config)
        self.mp_face_mesh = mp.solutions.face_mesh

    def load(self):
        self.model = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5
        )
        self.is_loaded = True
        print("FaceMesh model loaded (Python)")
        return True

    def get_landmarks(self, image):
        if not self.is_loaded:
            raise Exception("Model not loaded")
        
        # Convert BGR to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.model.process(image_rgb)
        return results.multi_face_landmarks
