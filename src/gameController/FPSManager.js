import { FPS_CONSTANTS } from "../utils/constants.js";

export default class FPSManager {
    constructor(){
        this.targetFPS = FPS_CONSTANTS.TARGET_FPS;
        this.maxFPS = FPS_CONSTANTS.MAX_FPS;
        this.lastFrameTime = 0; // time of the last frame
        this.lastFPSCheck = 0; //accumulated time for physics update
        this.frameCount = 0;
        this.fps = 0; //current fps
        this.fpsInterval = FPS_CONSTANTS.FPS_INTERVAL; // fps tracking interval 
        this.deltaTime = 0; //time difference between frames 
        this.fpsVisible = true;

        this.displayElement = document.getElementById('fpsDisplay');
        this.fpsHistory = [];
        this.historyLength = 10;
    }

    setFPSVisibility(visible) {
        this.fpsVisible= visible;
        this.displayElement.style.display = visible ? "block": "none";
    }

    calculateSmoothedFPS() {
        this.fpsHistory.push(this.fps);

        if (this.fpsHistory.length > this.historyLength) {
            this.fpsHistory.shift();
        }
        return Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length);
    }

    //initialize FPS tracking 
    trackFPS(timestamp){
        this.frameCount++;

        // track FPS every fpsInterval
        if (timestamp - this.lastFPSCheck >= this.fpsInterval){
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFPSCheck = timestamp;

            if (this.fpsVisible && this.displayElement) {
                const smoothedFPS = this.calculateSmoothedFPS();
                this.displayElement.textContent = `FPS: ${smoothedFPS}`;

                if (smoothedFPS < this.targetFPS * FPS_CONSTANTS.FPS_PERFORMANCE_THRESHOLDS.LOW) {
                    this.displayElement.style.color = FPS_CONSTANTS.FPS_DISPLAY_COLORS.LOW;
                } else if (smoothedFPS < this.targetFPS) {
                    this.displayElement.style.color = FPS_CONSTANTS.FPS_DISPLAY_COLORS.MEDIUM;
                } else {
                    this.displayElement.style.color = FPS_CONSTANTS.FPS_DISPLAY_COLORS.HIGH;
                }
            }
        }
    }

    // update FPS/handle frame rate
    update(timestamp){
        this.trackFPS(timestamp);

        if (timestamp - this.lastFrameTime < 1000 / this.maxFPS){
            return 0;
        }

        this.deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        return this.deltaTime;
    }
}