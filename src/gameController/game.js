import {createMenu, createPauseMenu, createGameOverScreen} from './menu.js';
import StateManager from './stateManager.js';
import { Player } from '../objects/player.js';
import { Enemy } from '../objects/enemy.js';
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

        this.player = null;
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
            /*
            this.updateGame();
            this.renderGame();
            */
        }

        this.handleKeyPress();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    /* // player/enemies movement mechanics
    udpateGame() {
        this.player.update(this.inputHandler.keys);
        this.enemy.update();

        //collision logic
    }

    renderGame() {
        this.player.render();
        thie.enemy.render();
    }
 */
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

