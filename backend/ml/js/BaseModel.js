/**
 * Base class for all ML models
 */
class BaseModel {
    constructor(config = {}) {
        this.config = config;
        this.model = null;
        this.isLoaded = false;
    }

    /**
     * Load the model
     * @returns {Promise<boolean>}
     */
    async load() {
        throw new Error("Method 'load' must be implemented");
    }

    /**
     * Run prediction on input
     * @param {any} input 
     * @returns {Promise<any>}
     */
    async predict(input) {
        throw new Error("Method 'predict' must be implemented");
    }

    /**
     * Dispose of model resources
     */
    dispose() {
        this.model = null;
        this.isLoaded = false;
    }
}

export default BaseModel;
