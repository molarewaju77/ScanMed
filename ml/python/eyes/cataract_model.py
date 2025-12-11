from ..base_model import BaseModel

class CataractModel(BaseModel):
    def load(self):
        # Load TensorFlow/Keras model
        # self.model = tf.keras.models.load_model('path/to/model')
        self.is_loaded = True

    def predict(self, eye_image):
        return {"has_cataract": False, "probability": 0}
