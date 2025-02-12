export default class LifeManager {
    constructor(initialLives = 3) {
        this.lives = initialLives;
        this.livesContainer = document.createElement("span");
        this.livesContainer.id = "lives-container";
        document.getElementById("scoreBoard").insertBefore(this.livesContainer, document.getElementById("fpsDisplay"));
        this.updateLivesDisplay();
    }

    updateLivesDisplay() {
        this.livesContainer.innerHTML = "Lives: ";

        for (let i = 0; i < this.lives; i++) {
            const life = document.createElement("object");
            life.data = "../../img/dols.svg";
            life.type = "image/svg+xml";
            life.classList.add("life-icon");
            this.livesContainer.appendChild(life);
        }
        this.adjustScoreboardFontSize();
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
        this.gameOverCallback = callback;    
    }

    adjustScoreboardFontSize() {
        const container = document.getElementById('scoreBoard-gameContainer');
        const scoreBoard = document.getElementById('scoreBoard');

        const fontSize = container.clientWidth * 0.03;
        const scoreBoardItems = scoreBoard.querySelectorAll('span');

        scoreBoardItems.forEach(item => {
            item.style.fontSize = `${fontSize}px`;
        });

        const lifeIcons = document.querySelectorAll('.life-icon');
        lifeIcons.forEach(icon => {
            icon.style.width = `${fontSize}px`; 
            icon.style.height = `${fontSize}px`;
        });
    }
}