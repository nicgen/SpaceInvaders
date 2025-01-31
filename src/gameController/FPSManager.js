export default class FPSManager {
    constructor(targetFPS = 60, maxFPS = 80){
        this.targetFPS = targetFPS;
        this.maxFPS = maxFPS;
        this.lastTime = 0; // time of the last frame
        this.accumulatedTime = 0; //accumulated time for physics update
        this.frameCount = 0;
        this.fps = 0; //current fps
        this.fpsInterval = 1000; // fps tracking interval (1s)
        this.deltaTime = 0; //time difference between frames 
    }

    //initialize FPS tracking 
    trackFPS(timestamp){
        this.frameCount++;

        // track FPS every 1s
        if (timestamp - this.lastTime > this.fpsInterval){
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = timestamp;
            console.log(`FPS: ${this.fps}`);
        }
    }

    // update FPS/handle frame rate
    update(timestamp){
        this.trackFPS(timestamp);

        if (timestamp - this.lastTime < 1000 / this.maxFPS){
            return 0;
        }

        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        return this.deltaTime;
    }
}