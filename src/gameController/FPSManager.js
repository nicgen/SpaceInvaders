export default class FPSManager {
    constructor() {
        this.frameCount = 0;
        this.accumulatedInterval = 0;
        this.fpsInterval = 1000;
        this.fps = 0;
        this.fpsVisible = true;
        this.fpsDisplay = document.getElementById('fpsDisplay');
    }

    // Update FPS count and manage display
    update(timestamp) {
        this.frameCount++;

        if (timestamp - this.accumulatedInterval >= this.fpsInterval) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.accumulatedInterval = timestamp;

            if (this.fpsVisible && this.fpsDisplay) {
                this.fpsDisplay.textContent = `FPS: ${this.fps}`;
                if (this.fps < 30) {
                    this.fpsDisplay.style.color = 'red';
                } else if (this.fps < 60) {
                    this.fpsDisplay.style.color = 'orange';
                } else {
                    this.fpsDisplay.style.color = 'green';
                }
            }
        }

        return 1000 / 60; // Simulate a fixed time step (60 FPS)
    }

    // Toggle FPS display visibility
    toggleFPSDisplay() {
        this.fpsVisible = !this.fpsVisible;
        if (this.fpsVisible) {
            this.fpsDisplay.style.display = 'block';
        } else {
            this.fpsDisplay.style.display = 'none';
        }
        console.log(`FPS display is now ${this.fpsVisible ? "visible" : "hidden"}`);
    }
}