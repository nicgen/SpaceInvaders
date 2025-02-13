import { TIMER } from "../utils/constants.js";

export default class Timer {
    constructor(displayElementId, initialTime = TIMER.DEFAULT_TIME, onTimeUp) {
        this.initialTime = initialTime;
        this.remainingTime = initialTime * 1000;
        this.timerInterval = null;
        this.displayElement = document.getElementById(displayElementId);
        this.paused = false;
        this.onTimeUp = onTimeUp;
    }

    start() {
        if (this.paused) {
            // If the timer is paused, do not start a new interval
            return;
        }

        this.updateDisplay();
        this.timerInterval = setInterval(() => {
            this.remainingTime -= TIMER.INTERVAL; 

            if (this.remainingTime <= 0) {
                this.stop();
                this.remainingTime = 0;
                this.updateDisplay();

                // Call the onTimeUp callback to trigger game over
                if (this.onTimeUp) {
                    this.onTimeUp('loose');
                }
            } else {
                this.updateDisplay();
            }
        }, this.remainingTime); 
    }

    stop() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    pause() {
        if (!this.paused) {
            this.stop();
            this.paused = true;
        }
    }

    resume() {
        if (this.paused) {
            this.paused = false;
            this.start();
        }
    }

    updateDisplay() {
        const seconds = Math.floor(this.remainingTime / 1000);
        const milliseconds = Math.floor((this.remainingTime % 1000) / 100);
        this.displayElement.textContent = `Time: ${seconds}s ${milliseconds}ms`;
    }
}
