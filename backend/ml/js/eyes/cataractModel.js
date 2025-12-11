const BaseModel = require('../BaseModel');

class CataractModel extends BaseModel {
    async load() {
        // Load TF.js model
        this.isLoaded = true;
    }

    async predict(eyeImage) {
        return { hasCataract: false, probability: 0 };
    }
}

module.exports = CataractModel;
