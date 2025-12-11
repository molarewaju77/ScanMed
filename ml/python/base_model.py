class BaseModel:
    def __init__(self, config=None):
        self.config = config or {}
        self.model = None
        self.is_loaded = False

    def load(self):
        """Load the model"""
        raise NotImplementedError("Method 'load' must be implemented")

    def predict(self, input_data):
        """Run prediction on input"""
        raise NotImplementedError("Method 'predict' must be implemented")

    def dispose(self):
        """Dispose of model resources"""
        self.model = None
        self.is_loaded = False
