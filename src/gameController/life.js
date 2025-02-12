export default class LifeManager {
    constructor(initialLives = 3) {
        this.lives = initialLives;
        this.livesContainer = document.getElementById("lives");
        this.updateLivesDisplay();
    }

    updateLivesDisplay() {
        this.livesContainer.innerHTML = "Lives: ";

        for (let i = 0; i < this.lives; i++) {
            const life = document.createElement("object");
            life.data = "../../img/dols.svg";
            life.type = "image/svg+xml";
            life.classList.add("life-icon");
            life.style.width = "24px";
            life.style.height = "24px";
            this.livesContainer.appendChild(life);
        }
    }

    loseLife() {
        if (this.lives > 1) {
            this.lives--;
            this.updateLivesDisplay();
        } else {
            this.lives = 0;
            this.updateLivesDisplay();
            this.gameOverCallback();
        }
    }

    setGameOverCallback(callback) {
        this.gameOverCallback = callback
;    }
}