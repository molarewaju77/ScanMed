import cv2
import numpy as np

class RednessDetector:
    @staticmethod
    def analyze(eye_image):
        if eye_image is None:
            return {"score": 0, "is_red": False}
            
        # Convert to HSV
        hsv = cv2.cvtColor(eye_image, cv2.COLOR_BGR2HSV)
        
        # Define red range
        lower_red1 = np.array([0, 50, 50])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([170, 50, 50])
        upper_red2 = np.array([180, 255, 255])
        
        mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
        mask = mask1 + mask2
        
        red_pixels = cv2.countNonZero(mask)
        total_pixels = eye_image.shape[0] * eye_image.shape[1]
        
        score = (red_pixels / total_pixels) * 100
        
        return {
            "score": round(score, 2),
            "is_red": score > 15,
            "confidence": 0.85
        }
