import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

// Define return types for better type safety
export interface Prediction {
    className: string;
    probability: number;
}

export interface ObjectDetection {
    class: string;
    score: number;
    bbox: [number, number, number, number];
}

class ModelManager {
    private static instance: ModelManager;
    private mobileNetModel: mobilenet.MobileNet | null = null;
    private cocoSsdModel: cocoSsd.ObjectDetection | null = null;
    private isLoadingMobileNet = false;
    private isLoadingCocoSsd = false;

    private constructor() {
        // Initialize TFJS backend (webgl is standard for browser)
        tf.ready().then(() => {
            console.log('TensorFlow.js ready');
        });
    }

    public static getInstance(): ModelManager {
        if (!ModelManager.instance) {
            ModelManager.instance = new ModelManager();
        }
        return ModelManager.instance;
    }

    // Lazy Load MobileNet (Image Classification)
    public async loadMobileNet(): Promise<mobilenet.MobileNet> {
        if (this.mobileNetModel) return this.mobileNetModel;

        if (this.isLoadingMobileNet) {
            // Wait for existing load to finish
            return new Promise((resolve) => {
                const check = setInterval(() => {
                    if (this.mobileNetModel) {
                        clearInterval(check);
                        resolve(this.mobileNetModel);
                    }
                }, 100);
            });
        }

        this.isLoadingMobileNet = true;
        console.log("Loading MobileNet...");
        try {
            this.mobileNetModel = await mobilenet.load({ version: 2, alpha: 1.0 });
            console.log("MobileNet Loaded");
            return this.mobileNetModel;
        } catch (err) {
            console.error("Failed to load MobileNet", err);
            this.isLoadingMobileNet = false;
            throw err;
        }
    }

    // Lazy Load COCO-SSD (Object Detection)
    public async loadCocoSsd(): Promise<cocoSsd.ObjectDetection> {
        if (this.cocoSsdModel) return this.cocoSsdModel;

        if (this.isLoadingCocoSsd) {
            return new Promise((resolve) => {
                const check = setInterval(() => {
                    if (this.cocoSsdModel) {
                        clearInterval(check);
                        resolve(this.cocoSsdModel);
                    }
                }, 100);
            });
        }

        this.isLoadingCocoSsd = true;
        console.log("Loading COCO-SSD...");
        try {
            this.cocoSsdModel = await cocoSsd.load();
            console.log("COCO-SSD Loaded");
            return this.cocoSsdModel;
        } catch (err) {
            console.error("Failed to load COCO-SSD", err);
            this.isLoadingCocoSsd = false;
            throw err;
        }
    }

    // Run Classification (MobileNet)
    public async classify(element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): Promise<Prediction[]> {
        const model = await this.loadMobileNet();
        return await model.classify(element);
    }

    // Run Detection (COCO-SSD)
    public async detect(element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): Promise<ObjectDetection[]> {
        const model = await this.loadCocoSsd();
        return await model.detect(element);
    }
}

export const modelManager = ModelManager.getInstance();
