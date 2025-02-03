import {createMenu, createPauseMenu, createGameOverScreen} from './menu.js';
import StateManager from './stateManager.js';
import Ship  from '../objects/player.js';
import InputHandler from '../utils/inputHandler.js';
import FPSManager from './FPSManager.js';

export default class Game {
    constructor() {
        this.stateManager = new StateManager();
        this.running = false;
        this.score = 0;

        this.gameContainer = document.getElementById('game-container');
        this.fpsManager = new FPSManager(60, 80);
        this.inputHandler = new InputHandler();

        this.ship = new Ship(this.gameContainer, this);
        this.beams = [];
        this.enemy = null;

        this.menuScreen = createMenu(() => this.startGame());
        this.pauseMenu = createPauseMenu(
            () => this.resumeGame(),
            () => this.restartGame()
        );
        this.gameOverScreen = createGameOverScreen(
            () => this.restartGame(),
            () => window.location.reload()
        );
    }

    //game logic for key presse
    handleKeyPress() {
        if (this.inputHandler.isKeyPressed("ArrowLeft") && this.stateManager.isRunning()){
            this.ship.moveLeft();
        } else if (this.inputHandler.isKeyPressed("ArrowRight") && this.stateManager.isRunning()){
            this.ship.moveRight();
        }
        if (this.inputHandler.isKeyPressed(" ") && this.stateManager.isRunning() && this.ship.canShoot) {
            this.ship.shoot();
            this.ship.canShoot = false;
            setTimeout(() => this.ship.canShoot = true, this.ship.shootCooldown);

        }
        if (this.inputHandler.isKeyJustPressed("Escape")) {
            if (this.stateManager.isRunning()) {
                this.pauseGame();
            } else if (this.stateManager.isPaused()){
                this.resumeGame();
            }
        }
    }

    restartGame() {
        this.pauseMenu.classList.add("hidden");
        this.gameOverScreen.classList.add("hidden");
        this.stateManager.resetGame();
        this.startGame();
    }

    startGame() {
        this.menuScreen.classList.add("hidden");
        this.stateManager.setRunning();
        this.running = true;
        this.score = 0;

        //player/enemies initialization

        this.gameLoop(performance.now());
    }

    gameLoop(timestamp) {
        const dt = this.fpsManager.update(timestamp);

        if (this.running && dt > 0) {
            this.updateGame();
            this.renderGame();
        }

        this.handleKeyPress();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    // player/enemies movement mechanics
    updateGame() {
        this.beams.forEach((beam, index) => {
            beam.update();
            
            if (!beam.beam.parentElement){
                this.beams.splice(index, 1);
            }
        });
    }
    

    renderGame() {
        this.ship.render();
        this.beams.forEach((beam) => beam.render());
    }
 
    pauseGame() {
        this.running = false;
        this.stateManager.setPaused();
        this.pauseMenu.classList.remove("hidden");
    }

    resumeGame() {
        this.running = true;
        this.stateManager.setRunning();
        this.pauseMenu.classList.add("hidden");

        //continue game loop
        this.gameLoop(performance.now());
    }

    gameOver() {
        this.running = false;
        this.stateManager.setGameOver();
        this.gameOverScreen.classList.remove("hidden");
        document.getElementById("finalScore").textContent =`Score: ${this.score}`;
    }
}

